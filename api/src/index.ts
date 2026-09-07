import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticate, CustomerIdentity } from "./auth.js";
import { database, sql } from "./db.js";
import { notifyAdmins } from "./email.js";

const json = (body: unknown, status = 200): HttpResponseInit => ({ status, jsonBody: body });
const money = (value: unknown) => Math.round(Number(value) * 100) / 100;

app.http("products", { methods:["GET"], authLevel:"anonymous", route:"products", handler: async request => {
  try {
    const pool=await database(); const category=request.query.get("category"); const subcategory=request.query.get("subcategory");
    const dbRequest=pool.request().input("category",sql.VarChar,category).input("subcategory",sql.VarChar,subcategory);
    const result=await dbRequest.query(`SELECT p.id,p.sku,p.name,p.description,p.price,p.image_url,p.tag,c.parent_name category,c.slug subcategory FROM Products p LEFT JOIN ProductCategories c ON c.id=p.category_id WHERE p.is_active=1 AND (@category IS NULL OR c.parent_name=@category) AND (@subcategory IS NULL OR c.slug=@subcategory) ORDER BY c.display_order,p.name`);
    return json(result.recordset.map(p=>({id:p.id,sku:p.sku,name:p.name,description:p.description,price:money(p.price),image:p.image_url||"/placeholder.svg",tag:p.tag})));
  } catch(error){console.error(error);return json({message:"No se pudo cargar el catálogo."},500);}
} });

app.http("builderOptions", { methods: ["GET"], authLevel: "anonymous", route: "builder-options", handler: async () => {
  try {
    const pool = await database();
    const result = await pool.request().query(`SELECT id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity FROM BuilderOptions WHERE is_active=1 ORDER BY option_group,display_order,name`);
    return json(result.recordset.map(o => ({ id:o.id, sku:o.sku, group:o.option_group, name:o.name, color:o.color_name, price:money(o.unit_price), min:o.min_quantity, max:o.max_quantity })));
  } catch(error) { console.error(error); return json({message:"No se pudo cargar el catálogo."},500); }
} });

async function secured(request: HttpRequest, handler: (identity: CustomerIdentity) => Promise<HttpResponseInit>) {
  try { return await handler(await authenticate(request)); }
  catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "UNAUTHORIZED") return json({ message: "Debes iniciar sesión." }, 401);
    if (message === "FORBIDDEN") return json({ message: "No tienes acceso a este módulo." }, 403);
    console.error(error);
    return json({ message: "Ocurrió un error en el servidor." }, 500);
  }
}

app.http("me", { methods: ["GET"], authLevel: "anonymous", route: "me", handler: (request) => secured(request, async identity => {
  const pool = await database();
  const customer=(await pool.request().input("id",sql.NVarChar,identity.id).input("email",sql.NVarChar,identity.email).input("name",sql.NVarChar,identity.name).query(`DECLARE @customer nvarchar(128); SELECT TOP(1) @customer=id FROM Customers WHERE id=@id OR email=@email ORDER BY CASE WHEN id=@id THEN 0 ELSE 1 END; IF @customer IS NULL BEGIN SET @customer=@id; INSERT Customers(id,email,name) VALUES(@customer,@email,@name); END ELSE UPDATE Customers SET email=@email,name=@name WHERE id=@customer; SELECT @customer id;`)).recordset[0].id;
  const result = await pool.request().input("id", sql.NVarChar, customer).query(`
    SELECT c.name,c.email,c.phone,l.purchase_count,l.cycle_spend,
      CAST(CASE WHEN EXISTS(SELECT 1 FROM Benefits b WHERE b.customer_id=c.id AND b.kind='free_shipping' AND b.redeemed_at IS NULL) THEN 1 ELSE 0 END AS bit) free_shipping,
      COALESCE((SELECT SUM(amount) FROM Benefits b WHERE b.customer_id=c.id AND b.kind='credit' AND b.redeemed_at IS NULL),0) credit
    FROM Customers c LEFT JOIN Loyalty l ON l.customer_id=c.id WHERE c.id=@id;
    SELECT id,created_at,total,status,(SELECT SUM(quantity) FROM OrderItems WHERE order_id=o.id) item_count FROM Orders o WHERE customer_id=@id ORDER BY created_at DESC;`);
  const recordsets = result.recordsets as sql.IRecordSet<Record<string, unknown>>[];
  const profile = recordsets[0][0];
  return json({ isAdmin:identity.admin, name: profile.name, email: profile.email, phone: profile.phone, loyalty: { completedPurchases: profile.purchase_count || 0, cycleSpend: money(profile.cycle_spend), freeShippingAvailable: profile.free_shipping, creditAvailable: money(profile.credit) }, orders: recordsets[1].map(o => ({ id:o.id, createdAt:o.created_at, total:money(o.total), status:o.status, itemCount:o.item_count })) });
}) });

app.http("orders", { methods: ["POST"], authLevel: "anonymous", route: "orders", handler: (request) => secured(request, async identity => {
  type IncomingItem = { id:string; sku?:string; name:string; price?:number; quantity:number; configuration?:Array<{optionId:string;sku:string;name:string;quantity:number}> };
  const body = await request.json() as { items?: IncomingItem[]; delivery?: Record<string,string> };
  if (!body.items?.length || body.items.some(i => !i.id || !i.name?.trim() || i.name.length>240 || !Number.isInteger(i.quantity) || i.quantity<1 || i.quantity>100)) return json({ message: "El pedido no es válido." }, 400);
  const pool = await database(); const tx = new sql.Transaction(pool); await tx.begin();
  try {
    const customer=(await new sql.Request(tx).input("id",sql.NVarChar,identity.id).input("email",sql.NVarChar,identity.email).input("name",sql.NVarChar,identity.name).query(`DECLARE @customer nvarchar(128); SELECT TOP(1) @customer=id FROM Customers WITH(UPDLOCK,HOLDLOCK) WHERE id=@id OR email=@email ORDER BY CASE WHEN id=@id THEN 0 ELSE 1 END; IF @customer IS NULL BEGIN SET @customer=@id; INSERT Customers(id,email,name) VALUES(@customer,@email,@name); END ELSE UPDATE Customers SET email=@email,name=@name WHERE id=@customer; SELECT @customer id;`)).recordset[0].id;
    const pricedItems: Array<IncomingItem & { unitPrice:number; displayName:string; resolved?:Array<{id:string;sku:string;name:string;quantity:number;unitPrice:number}> }> = [];
    for (const item of body.items) {
      if (item.sku === "CUSTOM-BOUQUET") {
        if (!item.configuration?.length) { await tx.rollback(); return json({message:"El ramo personalizado no tiene opciones."},400); }
        const resolved: Array<{id:string;sku:string;name:string;quantity:number;unitPrice:number}> = [];
        let unitPrice = 0; let flowers = 0; let wraps = 0;
        for (const selected of item.configuration) {
          const option = (await new sql.Request(tx).input("id",sql.UniqueIdentifier,selected.optionId).query(`SELECT id,sku,option_group,name,color_name,unit_price,max_quantity FROM BuilderOptions WHERE id=@id AND is_active=1`)).recordset[0];
          const qty = Math.floor(selected.quantity);
          if (!option || qty < 1 || qty > option.max_quantity) { await tx.rollback(); return json({message:"Una opción del ramo ya no está disponible."},409); }
          if(option.option_group === "flower") flowers += qty; if(option.option_group === "wrap") wraps += qty;
          unitPrice += Number(option.unit_price) * qty;
          resolved.push({id:option.id,sku:option.sku,name:option.color_name?`${option.name} ${option.color_name}`:option.name,quantity:qty,unitPrice:Number(option.unit_price)});
        }
        if(flowers < 1 || wraps > 1) { await tx.rollback(); return json({message:"Revisa las flores y la envoltura del ramo."},400); }
        pricedItems.push({...item,unitPrice:money(unitPrice),displayName:"Ramo personalizado",resolved});
      } else {
        const sku=item.sku||`LEGACY-${item.id.toUpperCase()}`;
        const product=(await new sql.Request(tx).input("sku",sql.VarChar,sku).query(`SELECT sku,name,price FROM Products WHERE sku=@sku AND is_active=1`)).recordset[0];
        if(product) pricedItems.push({...item,sku:product.sku,unitPrice:money(product.price),displayName:product.name});
        else {
          const submittedPrice=money(item.price);
          if(!sku.startsWith("LEGACY-")||!Number.isFinite(submittedPrice)||submittedPrice<0||submittedPrice>10000000){await tx.rollback();return json({message:`El producto ${sku} no está disponible en el catálogo.`},409);}
          pricedItems.push({...item,sku,unitPrice:submittedPrice,displayName:item.name.trim()});
        }
      }
    }
    const subtotal=money(pricedItems.reduce((sum,item)=>sum+item.unitPrice*Math.floor(item.quantity),0));
    const configuredTaxRate=Number(process.env.IVA_RATE||"0.13");
    const taxRate=Number.isFinite(configuredTaxRate)&&configuredTaxRate>=0&&configuredTaxRate<=1?configuredTaxRate:0.13;
    const taxAmount=money(subtotal*taxRate); const total=money(subtotal+taxAmount);
    const orderId = crypto.randomUUID();
    const invoiceNumber=`GB-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${orderId.slice(0,8).toUpperCase()}`; const createdAt=new Date().toISOString();
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,orderId).input("customer",sql.NVarChar,customer).input("invoice",sql.VarChar,invoiceNumber).input("subtotal",sql.Decimal(12,2),subtotal).input("taxRate",sql.Decimal(6,5),taxRate).input("taxAmount",sql.Decimal(12,2),taxAmount).input("total",sql.Decimal(12,2),total).input("delivery",sql.NVarChar,JSON.stringify(body.delivery||{})).query(`INSERT Orders(id,customer_id,invoice_number,subtotal,tax_rate,tax_amount,total,status,delivery_json) VALUES(@id,@customer,@invoice,@subtotal,@taxRate,@taxAmount,@total,'pending',@delivery)`);
    for (const item of pricedItems) {
      const inserted=await new sql.Request(tx).input("order",sql.UniqueIdentifier,orderId).input("product",sql.NVarChar,item.id).input("sku",sql.VarChar,item.sku).input("name",sql.NVarChar,item.displayName).input("price",sql.Decimal(12,2),item.unitPrice).input("qty",sql.Int,Math.floor(item.quantity)).input("config",sql.NVarChar,item.resolved?JSON.stringify(item.resolved):null).query(`INSERT OrderItems(order_id,product_id,sku,name,unit_price,quantity,configuration_json) OUTPUT INSERTED.id VALUES(@order,@product,@sku,@name,@price,@qty,@config)`);
      if(item.resolved) for(const option of item.resolved) await new sql.Request(tx).input("orderItem",sql.BigInt,inserted.recordset[0].id).input("option",sql.UniqueIdentifier,option.id).input("sku",sql.VarChar,option.sku).input("name",sql.NVarChar,option.name).input("qty",sql.Int,option.quantity).input("price",sql.Decimal(12,2),option.unitPrice).query(`INSERT CustomBouquetItems(order_item_id,builder_option_id,sku,name,quantity,unit_price) VALUES(@orderItem,@option,@sku,@name,@qty,@price)`);
    }
    await tx.commit();
    const invoiceItems=pricedItems.map(item=>({sku:item.sku!,name:item.displayName,quantity:Math.floor(item.quantity),unitPrice:item.unitPrice,lineSubtotal:money(item.unitPrice*Math.floor(item.quantity)),configuration:item.resolved}));
    let notificationSent=false; try{notificationSent=await notifyAdmins({invoiceNumber,createdAt,customer:{name:identity.name,email:identity.email},delivery:body.delivery||{},items:invoiceItems,subtotal,taxRate,taxAmount,total});}catch(error){console.error("No se pudo enviar el correo del pedido",error);}
    return json({id:orderId,invoiceNumber,createdAt,currency:"CRC",items:invoiceItems,delivery:body.delivery||{},subtotal,taxRate,taxAmount,total,notificationSent},201);
  } catch(error) { await tx.rollback(); throw error; }
}) });

app.http("adminOrders", { methods:["GET"], authLevel:"anonymous", route:"admin/orders", handler:(request) => secured(request, async identity => {
  if (!identity.admin) throw new Error("FORBIDDEN");
  const search=(request.query.get("search")||"").trim().slice(0,100);
  const requestedStatus=request.query.get("status")||"all";
  const status=["pending","paid","cancelled"].includes(requestedStatus)?requestedStatus:null;
  const pool=await database();
  const result=await pool.request().input("search",sql.NVarChar,search?`%${search}%`:null).input("status",sql.VarChar,status).query(`
    SELECT TOP (100) o.id,o.invoice_number,o.created_at,o.paid_at,o.subtotal,o.tax_rate,o.tax_amount,o.total,o.status,o.delivery_json,c.id customer_id,c.name,c.email,c.phone,
      COALESCE(l.purchase_count,0) purchase_count,
      JSON_QUERY((SELECT oi.sku,oi.name,oi.quantity,oi.unit_price,oi.configuration_json FROM OrderItems oi WHERE oi.order_id=o.id ORDER BY oi.id FOR JSON PATH)) items
    FROM Orders o JOIN Customers c ON c.id=o.customer_id LEFT JOIN Loyalty l ON l.customer_id=c.id
    WHERE (@status IS NULL OR o.status=@status) AND (@search IS NULL OR c.name LIKE @search OR c.email LIKE @search OR c.phone LIKE @search OR o.invoice_number LIKE @search OR CONVERT(varchar(36),o.id) LIKE @search OR EXISTS(SELECT 1 FROM OrderItems oi WHERE oi.order_id=o.id AND (oi.sku LIKE @search OR oi.name LIKE @search)))
    ORDER BY CASE WHEN o.status='pending' THEN 0 ELSE 1 END,o.created_at DESC;
    SELECT COUNT(*) total,SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) pending,SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) paid,SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) cancelled FROM Orders;`);
  const sets=result.recordsets as sql.IRecordSet<Record<string,unknown>>[];
  return json({orders:sets[0].map(order=>({...order,items:JSON.parse(String(order.items||"[]")),delivery:JSON.parse(String(order.delivery_json||"{}")),delivery_json:undefined})),stats:sets[1][0]||{total:0,pending:0,paid:0,cancelled:0}});
}) });

app.http("confirmOrder", { methods:["POST"], authLevel:"anonymous", route:"admin/orders/{id}/confirm", handler:(request) => secured(request, async identity => {
  if (!identity.admin) throw new Error("FORBIDDEN"); const id=request.params.id; const pool=await database(); const tx=new sql.Transaction(pool); await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
  try {
    const order=(await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`SELECT customer_id,total,status FROM Orders WITH(UPDLOCK,HOLDLOCK) WHERE id=@id`)).recordset[0];
    if (!order) { await tx.rollback(); return json({message:"Pedido no encontrado."},404); }
    if (order.status!=="pending") { await tx.rollback(); return json({message:"El pedido ya fue procesado."},409); }
    await new sql.Request(tx).input("customer",sql.NVarChar,order.customer_id).query(`IF NOT EXISTS(SELECT 1 FROM Loyalty WHERE customer_id=@customer) INSERT Loyalty(customer_id,purchase_count,cycle_spend) VALUES(@customer,0,0)`);
    const loyalty=(await new sql.Request(tx).input("customer",sql.NVarChar,order.customer_id).query(`SELECT purchase_count,cycle_spend FROM Loyalty WITH(UPDLOCK,HOLDLOCK) WHERE customer_id=@customer`)).recordset[0];
    const startingCount=loyalty.purchase_count>=10?0:loyalty.purchase_count; const startingSpend=loyalty.purchase_count>=10?0:Number(loyalty.cycle_spend); const count=startingCount+1; const spend=startingSpend+Number(order.total);
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`UPDATE Orders SET status='paid',paid_at=SYSUTCDATETIME() WHERE id=@id`);
    await new sql.Request(tx).input("customer",sql.NVarChar,order.customer_id).input("count",sql.Int,count).input("spend",sql.Decimal(12,2),spend).query(`UPDATE Loyalty SET purchase_count=@count,cycle_spend=@spend,updated_at=SYSUTCDATETIME() WHERE customer_id=@customer`);
    if(count===5) await new sql.Request(tx).input("customer",sql.NVarChar,order.customer_id).input("order",sql.UniqueIdentifier,id).query(`INSERT Benefits(customer_id,source_order_id,kind,amount) VALUES(@customer,@order,'free_shipping',0)`);
    if(count===10) await new sql.Request(tx).input("customer",sql.NVarChar,order.customer_id).input("order",sql.UniqueIdentifier,id).input("amount",sql.Decimal(12,2),money(spend*.10)).query(`INSERT Benefits(customer_id,source_order_id,kind,amount) VALUES(@customer,@order,'credit',@amount)`);
    await tx.commit(); return json({ok:true,purchaseCount:count});
  } catch(error) { await tx.rollback(); throw error; }
}) });
