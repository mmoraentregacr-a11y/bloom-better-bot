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

type BuilderOptionInput = { sku?:string; group?:string; name?:string; color?:string; price?:number; min?:number; max?:number; displayOrder?:number; active?:boolean };
function parseBuilderOption(value: BuilderOptionInput) {
  const sku=String(value.sku||"").trim().toUpperCase();
  const group=String(value.group||"");
  const name=String(value.name||"").trim();
  const color=String(value.color||"").trim();
  const price=Number(value.price), min=Number(value.min), max=Number(value.max), displayOrder=Number(value.displayOrder);
  if (!/^[A-Z0-9_-]{2,100}$/.test(sku) || !["flower","wrap","addon"].includes(group) || !name || name.length>160 || color.length>100 || !Number.isFinite(price) || price<0 || price>10000000 || Math.round(price*100)!==price*100 || !Number.isInteger(min) || !Number.isInteger(max) || min<0 || max<1 || min>max || max>1000 || !Number.isInteger(displayOrder) || displayOrder<0 || displayOrder>100000 || typeof value.active!=="boolean") return null;
  return {sku,group,name,color:color||null,price,min,max,displayOrder,active:value.active};
}

app.http("adminBuilderOptions", { methods:["GET","POST"], authLevel:"anonymous", route:"dashboard-builder-options", handler:(request)=>secured(request, async identity=>{
  if(!identity.admin) throw new Error("FORBIDDEN");
  const pool=await database();
  if(request.method==="GET") {
    const result=await pool.request().query(`SELECT id,sku,option_group AS [group],name,color_name AS color,unit_price AS price,min_quantity AS min,max_quantity AS max,display_order AS displayOrder,is_active AS active FROM BuilderOptions ORDER BY display_order,name,sku`);
    return json(result.recordset.map(o=>({...o,price:money(o.price),active:Boolean(o.active)})));
  }
  const input=parseBuilderOption(await request.json() as BuilderOptionInput);
  if(!input) return json({message:"Revisa los datos de la opción (SKU, grupo, precio y cantidades)."},400);
  try {
    const result=await pool.request().input("id",sql.UniqueIdentifier,crypto.randomUUID()).input("sku",sql.VarChar,input.sku).input("group",sql.VarChar,input.group).input("name",sql.NVarChar,input.name).input("color",sql.NVarChar,input.color).input("price",sql.Decimal(12,2),input.price).input("min",sql.Int,input.min).input("max",sql.Int,input.max).input("displayOrder",sql.Int,input.displayOrder).input("active",sql.Bit,input.active).query(`INSERT BuilderOptions(id,sku,option_group,name,color_name,unit_price,min_quantity,max_quantity,display_order,is_active) OUTPUT INSERTED.id VALUES(@id,@sku,@group,@name,@color,@price,@min,@max,@displayOrder,@active)`);
    return json({id:result.recordset[0].id},201);
  } catch(error) { if((error as {number?:number}).number===2601 || (error as {number?:number}).number===2627) return json({message:"Ya existe una opción con ese SKU."},409); throw error; }
}) });

app.http("adminBuilderOption", { methods:["PATCH"], authLevel:"anonymous", route:"dashboard-builder-options/{id}", handler:(request)=>secured(request, async identity=>{
  if(!identity.admin) throw new Error("FORBIDDEN");
  const id=request.params.id;
  if(!id || !/^[0-9a-f-]{36}$/i.test(id)) return json({message:"Opción no válida."},400);
  const input=parseBuilderOption(await request.json() as BuilderOptionInput);
  if(!input) return json({message:"Revisa los datos de la opción."},400);
  const pool=await database();
  const result=await pool.request().input("id",sql.UniqueIdentifier,id).input("sku",sql.VarChar,input.sku).input("group",sql.VarChar,input.group).input("name",sql.NVarChar,input.name).input("color",sql.NVarChar,input.color).input("price",sql.Decimal(12,2),input.price).input("min",sql.Int,input.min).input("max",sql.Int,input.max).input("displayOrder",sql.Int,input.displayOrder).input("active",sql.Bit,input.active).query(`UPDATE BuilderOptions SET option_group=@group,name=@name,color_name=@color,unit_price=@price,min_quantity=@min,max_quantity=@max,display_order=@displayOrder,is_active=@active WHERE id=@id AND sku=@sku`);
  return result.rowsAffected[0] ? json({ok:true}) : json({message:"La opción no existe o su SKU cambió. Recarga la página."},404);
}) });

async function secured(request: HttpRequest, handler: (identity: CustomerIdentity) => Promise<HttpResponseInit>) {
  try { return await handler(await authenticate(request)); }
  catch (error) { return serverError(error); }
}

async function optionallySecured(request: HttpRequest, handler: (identity?: CustomerIdentity) => Promise<HttpResponseInit>) {
  try {
    const hasToken=Boolean(request.headers.get("x-golden-bloom-authorization"));
    return await handler(hasToken ? await authenticate(request) : undefined);
  } catch (error) { return serverError(error); }
}

function serverError(error: unknown): HttpResponseInit {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "UNAUTHORIZED") return json({ message: "Debes iniciar sesión." }, 401);
    if (message === "FORBIDDEN") return json({ message: "No tienes acceso a este módulo." }, 403);
    const reference=crypto.randomUUID().slice(0,8);
    console.error(`[${reference}]`,error);
    const sqlMessage=error instanceof Error?error.message:"";
    if(/Invalid object name 'dbo\.Inventory|Invalid object name 'Inventory|InventoryItems|InventoryMovements/i.test(sqlMessage)) return json({message:"Falta aplicar la actualización de inventario en la base de datos.",code:"INVENTORY_SCHEMA_OUTDATED",reference},503);
    if(/Invalid column name|invoice_number|tax_amount|tax_rate/i.test(sqlMessage)) return json({message:"Falta aplicar la actualización de facturación en la base de datos.",code:"DATABASE_SCHEMA_OUTDATED",reference},503);
    if(/duplicate key|unique index|UX_Customers_Email/i.test(sqlMessage)) return json({message:"El correo está vinculado a otra cuenta de cliente. Cierra la sesión e ingresa nuevamente.",code:"CUSTOMER_EMAIL_CONFLICT",reference},409);
    const diagnostic=sqlMessage.replace(/(password|pwd|accesskey)\s*=\s*[^;\s]+/gi,"$1=[hidden]").slice(0,240);
    return json({ message: "Ocurrió un error en el servidor.", code:"SERVER_ERROR", reference, diagnostic }, 500);
}

app.http("me", { methods: ["GET"], authLevel: "anonymous", route: "me", handler: (request) => secured(request, async identity => {
  const pool = await database();
  const customer=(await pool.request().input("id",sql.NVarChar,identity.id).input("email",sql.NVarChar,identity.email).input("name",sql.NVarChar,identity.name).input("phone",sql.NVarChar,identity.phone||null).query(`DECLARE @customer nvarchar(128); SELECT TOP(1) @customer=id FROM Customers WHERE email=@email; IF @customer IS NULL SELECT TOP(1) @customer=id FROM Customers WHERE id=@id; IF @customer IS NULL BEGIN SET @customer=@id; INSERT Customers(id,email,name,phone) VALUES(@customer,@email,@name,@phone); END ELSE UPDATE Customers SET email=@email,name=@name,phone=COALESCE(NULLIF(@phone,''),phone) WHERE id=@customer; SELECT @customer id;`)).recordset[0].id;
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

app.http("orders", { methods: ["POST"], authLevel: "anonymous", route: "orders", handler: (request) => optionallySecured(request, async identity => {
  type IncomingItem = { id:string; sku?:string; name:string; price?:number; quantity:number; bouquetSize?:"small"|"medium"|"large"; configuration?:Array<{optionId:string;sku:string;name:string;quantity:number}> };
  const body = await request.json() as { items?: IncomingItem[]; delivery?: Record<string,string> };
  if (!body.items?.length || body.items.some(i => !i.id || !i.name?.trim() || i.name.length>240 || !Number.isInteger(i.quantity) || i.quantity<1 || i.quantity>100)) return json({ message: "El pedido no es válido." }, 400);
  const guestName=String(body.delivery?.nombre||"").trim().slice(0,100);
  const guestEmail=String(body.delivery?.email||"").trim().toLowerCase().slice(0,255);
  if(!identity&&(!guestName||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail))) return json({message:"Completa un nombre y correo válidos para continuar sin iniciar sesión."},400);
  const pool = await database(); const tx = new sql.Transaction(pool); await tx.begin();
  try {
    const guestId=crypto.randomUUID();
    const customerId=identity?.id||`guest:${guestId}`;
    const customerEmail=identity?.email||`guest-${guestId}@guest.goldenbloom.invalid`;
    const customerName=identity?.name||guestName;
    const accountPhone=String(body.delivery?.telefono||identity?.phone||"").trim().slice(0,30)||null;
    const customer=(await new sql.Request(tx).input("id",sql.NVarChar,customerId).input("email",sql.NVarChar,customerEmail).input("name",sql.NVarChar,customerName).input("phone",sql.NVarChar,accountPhone).query(`DECLARE @customer nvarchar(128); SELECT TOP(1) @customer=id FROM Customers WITH(UPDLOCK,HOLDLOCK) WHERE email=@email; IF @customer IS NULL SELECT TOP(1) @customer=id FROM Customers WITH(UPDLOCK,HOLDLOCK) WHERE id=@id; IF @customer IS NULL BEGIN SET @customer=@id; INSERT Customers(id,email,name,phone) VALUES(@customer,@email,@name,@phone); END ELSE UPDATE Customers SET email=@email,name=@name,phone=COALESCE(NULLIF(@phone,''),phone) WHERE id=@customer; SELECT @customer id;`)).recordset[0].id;
    const pricedItems: Array<IncomingItem & { unitPrice:number; displayName:string; resolved?:Array<{id:string;sku:string;name:string;quantity:number;unitPrice:number}> }> = [];
    for (const item of body.items) {
      if (item.sku === "CUSTOM-BOUQUET") {
        if (!item.configuration?.length) { await tx.rollback(); return json({message:"El ramo personalizado no tiene opciones."},400); }
        const bouquetSizes = { small:{name:"pequeño",flowers:3,price:5500}, medium:{name:"mediano",flowers:6,price:12000}, large:{name:"grande",flowers:12,price:22000} } as const;
        const size = item.bouquetSize && bouquetSizes[item.bouquetSize];
        if (!size) { await tx.rollback(); return json({message:"Selecciona el tamaño del ramo personalizado."},400); }
        const resolved: Array<{id:string;sku:string;name:string;quantity:number;unitPrice:number}> = [];
        let detailsPrice = 0; let flowers = 0; let wraps = 0;
        for (const selected of item.configuration) {
          const option = (await new sql.Request(tx).input("id",sql.UniqueIdentifier,selected.optionId).query(`SELECT id,sku,option_group,name,color_name,unit_price,max_quantity FROM BuilderOptions WHERE id=@id AND is_active=1`)).recordset[0];
          const qty = Math.floor(selected.quantity);
          if (!option || qty < 1 || qty > option.max_quantity) { await tx.rollback(); return json({message:"Una opción del ramo ya no está disponible."},409); }
          if(option.option_group === "flower") flowers += qty; if(option.option_group === "wrap") wraps += qty;
          if(option.option_group !== "flower") detailsPrice += Number(option.unit_price) * qty;
          resolved.push({id:option.id,sku:option.sku,name:option.color_name?`${option.name} ${option.color_name}`:option.name,quantity:qty,unitPrice:Number(option.unit_price)});
        }
        if(flowers < size.flowers || wraps > 1) { await tx.rollback(); return json({message:`El ramo ${size.name} requiere al menos ${size.flowers} flores y una sola envoltura.`},400); }
        const unitPrice = size.price + Math.max(0,flowers-size.flowers)*2000 + detailsPrice;
        pricedItems.push({...item,unitPrice:money(unitPrice),displayName:`Ramo personalizado ${size.name}`,resolved});
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
    const total=money(pricedItems.reduce((sum,item)=>sum+item.unitPrice*Math.floor(item.quantity),0));
    const configuredTaxRate=Number(process.env.IVA_RATE||"0.13");
    const taxRate=Number.isFinite(configuredTaxRate)&&configuredTaxRate>=0&&configuredTaxRate<=1?configuredTaxRate:0.13;
    // Catalog prices already include IVA. Extract it for the invoice instead of
    // charging the customer a second time.
    const subtotal=money(total/(1+taxRate));
    const taxAmount=money(total-subtotal);
    const orderId = crypto.randomUUID();
    const invoiceNumber=`GB-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${orderId.slice(0,8).toUpperCase()}`; const createdAt=new Date().toISOString();
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,orderId).input("customer",sql.NVarChar,customer).input("invoice",sql.VarChar,invoiceNumber).input("subtotal",sql.Decimal(12,2),subtotal).input("taxRate",sql.Decimal(6,5),taxRate).input("taxAmount",sql.Decimal(12,2),taxAmount).input("total",sql.Decimal(12,2),total).input("delivery",sql.NVarChar,JSON.stringify(body.delivery||{})).query(`INSERT Orders(id,customer_id,invoice_number,subtotal,tax_rate,tax_amount,total,status,delivery_json) VALUES(@id,@customer,@invoice,@subtotal,@taxRate,@taxAmount,@total,'pending',@delivery)`);
    for (const item of pricedItems) {
      const inserted=await new sql.Request(tx).input("order",sql.UniqueIdentifier,orderId).input("product",sql.NVarChar,item.id).input("sku",sql.VarChar,item.sku).input("name",sql.NVarChar,item.displayName).input("price",sql.Decimal(12,2),item.unitPrice).input("qty",sql.Int,Math.floor(item.quantity)).input("config",sql.NVarChar,item.resolved?JSON.stringify(item.resolved):null).query(`INSERT OrderItems(order_id,product_id,sku,name,unit_price,quantity,configuration_json) OUTPUT INSERTED.id VALUES(@order,@product,@sku,@name,@price,@qty,@config)`);
      if(item.resolved) for(const option of item.resolved) await new sql.Request(tx).input("orderItem",sql.BigInt,inserted.recordset[0].id).input("option",sql.UniqueIdentifier,option.id).input("sku",sql.VarChar,option.sku).input("name",sql.NVarChar,option.name).input("qty",sql.Int,option.quantity).input("price",sql.Decimal(12,2),option.unitPrice).query(`INSERT CustomBouquetItems(order_item_id,builder_option_id,sku,name,quantity,unit_price) VALUES(@orderItem,@option,@sku,@name,@qty,@price)`);
    }
    await tx.commit();
    const invoiceItems=pricedItems.map(item=>({sku:item.sku!,name:item.displayName,quantity:Math.floor(item.quantity),unitPrice:item.unitPrice,lineSubtotal:money(item.unitPrice*Math.floor(item.quantity)),configuration:item.resolved}));
    const notificationCustomer={name:identity?.name||guestName,email:identity?.email||guestEmail};
    let notificationSent=false; let customerNotificationSent=false; try{const sent=await notifyAdmins({invoiceNumber,createdAt,customer:notificationCustomer,delivery:body.delivery||{},items:invoiceItems,subtotal,taxRate,taxAmount,total});notificationSent=sent.adminSent;customerNotificationSent=sent.customerSent;}catch(error){console.error("No se pudo enviar el correo del pedido",error);}
    return json({id:orderId,invoiceNumber,createdAt,currency:"CRC",items:invoiceItems,delivery:body.delivery||{},subtotal,taxRate,taxAmount,total,notificationSent,customerNotificationSent,loyaltyEligible:Boolean(identity)},201);
  } catch(error) { await tx.rollback(); throw error; }
}) });

app.http("dashboardOrders", { methods:["GET"], authLevel:"anonymous", route:"dashboard-orders", handler:(request) => secured(request, async identity => {
  if (!identity.admin) throw new Error("FORBIDDEN");
  const search=(request.query.get("search")||"").trim().slice(0,100);
  const requestedStatus=request.query.get("status")||"all";
  const status=["pending","paid","cancelled"].includes(requestedStatus)?requestedStatus:null;
  const pool=await database();
  const result=await pool.request().input("search",sql.NVarChar,search?`%${search}%`:null).input("status",sql.VarChar,status).query(`
    SELECT TOP (100) o.id,o.invoice_number,o.created_at,o.paid_at,o.subtotal,o.tax_rate,o.tax_amount,o.total,o.status,o.delivery_json,c.id customer_id,
      CASE WHEN c.id LIKE 'guest:%' THEN COALESCE(JSON_VALUE(o.delivery_json,'$.nombre'),c.name) ELSE c.name END name,
      CASE WHEN c.id LIKE 'guest:%' THEN JSON_VALUE(o.delivery_json,'$.email') ELSE c.email END email,c.phone,
      COALESCE(l.purchase_count,0) purchase_count,
      JSON_QUERY((SELECT oi.sku,oi.name,oi.quantity,oi.unit_price,oi.configuration_json FROM OrderItems oi WHERE oi.order_id=o.id ORDER BY oi.id FOR JSON PATH)) items
    FROM Orders o JOIN Customers c ON c.id=o.customer_id LEFT JOIN Loyalty l ON l.customer_id=c.id
    WHERE (@status IS NULL OR o.status=@status) AND (@search IS NULL OR c.name LIKE @search OR c.email LIKE @search OR c.phone LIKE @search OR o.invoice_number LIKE @search OR CONVERT(varchar(36),o.id) LIKE @search OR EXISTS(SELECT 1 FROM OrderItems oi WHERE oi.order_id=o.id AND (oi.sku LIKE @search OR oi.name LIKE @search)))
    ORDER BY CASE WHEN o.status='pending' THEN 0 ELSE 1 END,o.created_at DESC;
    SELECT COUNT(*) total,SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) pending,SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) paid,SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) cancelled FROM Orders;`);
  const sets=result.recordsets as sql.IRecordSet<Record<string,unknown>>[];
  return json({orders:sets[0].map(order=>({...order,items:JSON.parse(String(order.items||"[]")),delivery:JSON.parse(String(order.delivery_json||"{}")),delivery_json:undefined})),stats:sets[1][0]||{total:0,pending:0,paid:0,cancelled:0}});
}) });

app.http("inventory", { methods:["GET"], authLevel:"anonymous", route:"inventory", handler:(request) => secured(request, async identity => {
  if(!identity.admin) throw new Error("FORBIDDEN");
  const pool=await database();
  await pool.request().query(`
    MERGE InventoryItems AS target USING (
      SELECT p.sku,p.name,'product' item_type,'unidad' unit FROM Products p WHERE p.is_active=1
      UNION ALL SELECT b.sku,CONCAT(b.name,CASE WHEN NULLIF(b.color_name,'') IS NULL THEN '' ELSE CONCAT(' ',b.color_name) END),'component','unidad' FROM BuilderOptions b WHERE b.is_active=1
    ) AS source ON target.sku=source.sku
    WHEN MATCHED THEN UPDATE SET name=source.name,item_type=source.item_type,is_active=1,updated_at=SYSUTCDATETIME()
    WHEN NOT MATCHED THEN INSERT(sku,name,item_type,unit) VALUES(source.sku,source.name,source.item_type,source.unit);`);
  const result=await pool.request().query(`
    SELECT id,sku,name,item_type,unit,current_stock,minimum_stock,
      CAST(CASE WHEN current_stock<=minimum_stock THEN 1 ELSE 0 END AS bit) low_stock
    FROM InventoryItems WHERE is_active=1 ORDER BY CASE WHEN current_stock<=minimum_stock THEN 0 ELSE 1 END,name;
    SELECT TOP(100) m.id,m.movement_type,m.quantity,m.order_id,o.invoice_number,m.notes,m.created_by,m.created_at,i.sku,i.name,i.unit
    FROM InventoryMovements m JOIN InventoryItems i ON i.id=m.inventory_item_id LEFT JOIN Orders o ON o.id=m.order_id ORDER BY m.created_at DESC,m.id DESC;
    SELECT COUNT(*) item_count,SUM(CASE WHEN current_stock<=minimum_stock THEN 1 ELSE 0 END) low_stock_count,
      SUM(CASE WHEN current_stock<0 THEN 1 ELSE 0 END) negative_stock_count FROM InventoryItems WHERE is_active=1;`);
  const sets=result.recordsets as sql.IRecordSet<Record<string,unknown>>[];
  return json({items:sets[0],movements:sets[1],stats:sets[2][0]||{item_count:0,low_stock_count:0,negative_stock_count:0}});
}) });

app.http("inventoryMovement", { methods:["POST"], authLevel:"anonymous", route:"inventory-movements", handler:(request) => secured(request, async identity => {
  if(!identity.admin) throw new Error("FORBIDDEN");
  const body=await request.json() as {sku?:string;type?:string;quantity?:number;notes?:string};
  const skuValue=String(body.sku||"").trim().slice(0,100);
  const type=String(body.type||"");
  const quantity=Number(body.quantity);
  if(!skuValue||!["purchase","damage"].includes(type)||!Number.isFinite(quantity)||quantity<=0||quantity>100000) return json({message:"El movimiento de inventario no es válido."},400);
  const delta=type==="purchase"?quantity:-quantity;
  const pool=await database(); const tx=new sql.Transaction(pool); await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
  try {
    const item=(await new sql.Request(tx).input("sku",sql.VarChar,skuValue).query(`SELECT id,current_stock FROM InventoryItems WITH(UPDLOCK,HOLDLOCK) WHERE sku=@sku AND is_active=1`)).recordset[0];
    if(!item){await tx.rollback();return json({message:"Producto de inventario no encontrado."},404);}
    if(type==="damage"&&Number(item.current_stock)<quantity){await tx.rollback();return json({message:"La baja por daño supera la existencia disponible."},409);}
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,item.id).input("delta",sql.Decimal(12,2),delta).query(`UPDATE InventoryItems SET current_stock=current_stock+@delta,updated_at=SYSUTCDATETIME() WHERE id=@id`);
    await new sql.Request(tx).input("id",sql.UniqueIdentifier,item.id).input("type",sql.VarChar,type).input("quantity",sql.Decimal(12,2),delta).input("notes",sql.NVarChar,String(body.notes||"").trim().slice(0,400)||null).input("admin",sql.NVarChar,identity.email).query(`INSERT InventoryMovements(inventory_item_id,movement_type,quantity,notes,created_by) VALUES(@id,@type,@quantity,@notes,@admin)`);
    await tx.commit(); return json({ok:true,currentStock:money(Number(item.current_stock)+delta)});
  } catch(error){await tx.rollback();throw error;}
}) });

app.http("confirmDashboardOrder", { methods:["POST"], authLevel:"anonymous", route:"dashboard-orders/{id}/confirm", handler:(request) => secured(request, async identity => {
  if (!identity.admin) throw new Error("FORBIDDEN"); const id=request.params.id; const pool=await database(); const tx=new sql.Transaction(pool); await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
  try {
    const order=(await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`SELECT customer_id,total,status FROM Orders WITH(UPDLOCK,HOLDLOCK) WHERE id=@id`)).recordset[0];
    if (!order) { await tx.rollback(); return json({message:"Pedido no encontrado."},404); }
    if (order.status!=="pending") { await tx.rollback(); return json({message:"El pedido ya fue procesado."},409); }
    await new sql.Request(tx).input("order",sql.UniqueIdentifier,id).input("admin",sql.NVarChar,identity.email).query(`
      ;WITH SoldRaw AS (
        SELECT oi.sku,oi.name,CAST(oi.quantity AS decimal(12,2)) quantity FROM OrderItems oi WHERE oi.order_id=@order AND oi.sku<>'CUSTOM-BOUQUET'
        UNION ALL
        SELECT cbi.sku,cbi.name,CAST(cbi.quantity*oi.quantity AS decimal(12,2)) quantity FROM CustomBouquetItems cbi JOIN OrderItems oi ON oi.id=cbi.order_item_id WHERE oi.order_id=@order
      ), Sold AS (SELECT sku,MAX(name) name,SUM(quantity) quantity FROM SoldRaw GROUP BY sku)
      MERGE InventoryItems AS target USING Sold AS source ON target.sku=source.sku
      WHEN NOT MATCHED THEN INSERT(sku,name,item_type,unit,current_stock) VALUES(source.sku,source.name,'product','unidad',0);
      ;WITH SoldRaw AS (
        SELECT oi.sku,CAST(oi.quantity AS decimal(12,2)) quantity FROM OrderItems oi WHERE oi.order_id=@order AND oi.sku<>'CUSTOM-BOUQUET'
        UNION ALL SELECT cbi.sku,CAST(cbi.quantity*oi.quantity AS decimal(12,2)) FROM CustomBouquetItems cbi JOIN OrderItems oi ON oi.id=cbi.order_item_id WHERE oi.order_id=@order
      ), Sold AS (SELECT sku,SUM(quantity) quantity FROM SoldRaw GROUP BY sku)
      UPDATE i SET current_stock=i.current_stock-s.quantity,updated_at=SYSUTCDATETIME() FROM InventoryItems i JOIN Sold s ON s.sku=i.sku;
      ;WITH SoldRaw AS (
        SELECT oi.sku,CAST(oi.quantity AS decimal(12,2)) quantity FROM OrderItems oi WHERE oi.order_id=@order AND oi.sku<>'CUSTOM-BOUQUET'
        UNION ALL SELECT cbi.sku,CAST(cbi.quantity*oi.quantity AS decimal(12,2)) FROM CustomBouquetItems cbi JOIN OrderItems oi ON oi.id=cbi.order_item_id WHERE oi.order_id=@order
      ), Sold AS (SELECT sku,SUM(quantity) quantity FROM SoldRaw GROUP BY sku)
      INSERT InventoryMovements(inventory_item_id,movement_type,quantity,order_id,notes,created_by)
      SELECT i.id,'sale',-s.quantity,@order,'Salida automática por venta confirmada',@admin FROM Sold s JOIN InventoryItems i ON i.sku=s.sku;`);
    if(String(order.customer_id).startsWith("guest:")) {
      await new sql.Request(tx).input("id",sql.UniqueIdentifier,id).query(`UPDATE Orders SET status='paid',paid_at=SYSUTCDATETIME() WHERE id=@id`);
      await tx.commit(); return json({ok:true,purchaseCount:null,loyaltyEligible:false});
    }
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
