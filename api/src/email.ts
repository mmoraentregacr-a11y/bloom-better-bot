import { EmailClient } from "@azure/communication-email";

type InvoiceItem = { sku:string; name:string; quantity:number; unitPrice:number; lineSubtotal:number; configuration?:Array<{name:string;quantity:number;unitPrice:number}> };
export type OrderNotification = { invoiceNumber:string; createdAt:string; customer:{name:string;email:string}; delivery:Record<string,string>; items:InvoiceItem[]; subtotal:number; taxRate:number; taxAmount:number; total:number };

const escapeHtml = (value:unknown) => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const crc = (value:number) => new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",minimumFractionDigits:2}).format(value);

export async function notifyAdmins(order:OrderNotification):Promise<{adminSent:boolean;customerSent:boolean}> {
  const connectionString=process.env.AZURE_COMMUNICATION_EMAIL_CONNECTION_STRING?.trim();
  const senderAddress=process.env.ORDER_NOTIFICATION_FROM?.trim();
  const recipients=(process.env.ADMIN_EMAILS||"").split(",").map(value=>value.trim()).filter(Boolean);
  if(!connectionString||!senderAddress){console.warn("Pedido guardado sin correo: faltan variables de Azure Communication Services Email.");return {adminSent:false,customerSent:false};}
  const itemRows=order.items.map(item=>{const details=item.configuration?.map(option=>`<br><small>↳ ${option.quantity} × ${escapeHtml(option.name)} (${crc(option.unitPrice)} c/u)</small>`).join("")||"";return `<tr><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(item.name)}<br><small>${escapeHtml(item.sku)}</small>${details}</td><td style="padding:10px;border-bottom:1px solid #ddd;text-align:center">${item.quantity}</td><td style="padding:10px;border-bottom:1px solid #ddd;text-align:right">${crc(item.unitPrice)}</td><td style="padding:10px;border-bottom:1px solid #ddd;text-align:right">${crc(item.lineSubtotal)}</td></tr>`;}).join("");
  const deliveryRows=Object.entries(order.delivery).filter(([,value])=>value).map(([key,value])=>`<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`).join("");
  const html=`<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#173828"><h1>Nueva solicitud de pedido</h1><p><strong>Orden:</strong> ${escapeHtml(order.invoiceNumber)}<br><strong>Cliente:</strong> ${escapeHtml(order.customer.name)} (${escapeHtml(order.customer.email)})<br><strong>Fecha:</strong> ${escapeHtml(new Date(order.createdAt).toLocaleString("es-CR"))}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px">Producto</th><th>Cantidad</th><th style="text-align:right">Precio (IVA incluido)</th><th style="text-align:right">Importe</th></tr></thead><tbody>${itemRows}</tbody></table><div style="margin-top:20px;text-align:right"><p>Subtotal sin IVA: <strong>${crc(order.subtotal)}</strong></p><p>IVA incluido (${order.taxRate*100}%): <strong>${crc(order.taxAmount)}</strong></p><p style="font-size:20px">Total: <strong>${crc(order.total)}</strong></p></div><h2>Entrega</h2><ul>${deliveryRows}</ul><p>La solicitud ya está disponible en el panel administrativo de Golden Bloom.</p></div>`;
  const client=new EmailClient(connectionString);
  const send=async(addresses:string[],subject:string,emailHtml:string)=>{if(!addresses.length)return false;const poller=await client.beginSend({senderAddress,content:{subject,plainText:`Orden ${order.invoiceNumber}. Total: ${crc(order.total)}.`,html:emailHtml},recipients:{to:addresses.map(address=>({address}))}});return (await poller.pollUntilDone()).status==="Succeeded";};
  const customerHtml=html.replace("Nueva solicitud de pedido","Recibimos tu solicitud").replace("La solicitud ya está disponible en el panel administrativo de Golden Bloom.","Esta orden está pendiente de confirmación por parte de Golden Bloom. Conserva este correo como comprobante de tu solicitud.");
  const [adminSent,customerSent]=await Promise.all([send(recipients,`Nueva solicitud ${order.invoiceNumber} — Golden Bloom`,html),send([order.customer.email],`Tu orden ${order.invoiceNumber} — Golden Bloom`,customerHtml)]);
  return {adminSent,customerSent};
}
