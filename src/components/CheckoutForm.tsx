import { useEffect, useState } from "react";
import { z } from "zod";
import { User, Package, Calendar, CheckCircle2, MessageCircle, Printer, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { customerApi, type OrderInvoice } from "@/lib/api";
import type { LoyaltySummary } from "@/types/customer";
import { useQueryClient } from "@tanstack/react-query";

const PROVINCIAS = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
];
const PROVINCE_IDS: Record<string, number> = Object.fromEntries(PROVINCIAS.map((name,index)=>[name,index+1]));
const normalizePlace = (value:string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const excludedAlajuelaCantons = new Set(["san carlos","los chiles","orotina","zarcero","guatuso","upala","san mateo","rio cuarto","sarchi","grecia","naranjo","san ramon","palmares"]);
const isSupportedDelivery = (provincia:string,canton:string) => PROVINCIAS.includes(provincia)&&!(normalizePlace(provincia)==="alajuela"&&excludedAlajuelaCantons.has(normalizePlace(canton)));
const isFreeDeliveryZone = (provincia:string,canton:string,distrito:string) => {
  const p=normalizePlace(provincia),c=normalizePlace(canton),d=normalizePlace(distrito);
  return p==="san jose"&&((c==="desamparados"&&d==="desamparados")||(["central","san jose"].includes(c)&&["san francisco de dos rios","san sebastian"].includes(d)));
};
const locationOptions = async (url:string):Promise<Record<string,string>> => {
  const response=await fetch(`https://ubicaciones.paginasweb.cr${url}`);
  if(!response.ok) throw new Error("No se pudieron cargar las ubicaciones.");
  return response.json() as Promise<Record<string,string>>;
};


const HORAS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

// Número de WhatsApp del encargado de pedidos
const ORDER_WHATSAPP = "50689686661";

const schema = z.object({
  pickup: z.boolean(),
  nombre: z.string().trim().min(2, "Nombre requerido").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  telefono: z.string().trim().min(8, "Teléfono inválido").max(20),
  recibeNombre: z.string().trim().max(100),
  recibeTel: z.string().trim().max(20),
  provincia: z.string(),
  canton: z.string().trim().max(80),
  distrito: z.string().trim().max(80),
  direccion: z.string().trim().max(400),
  fecha: z.string().min(1, "Fecha requerida"),
  hora: z.string().min(1, "Selecciona una hora"),
  mensaje: z.string().max(300).optional(),
}).superRefine((value,ctx)=>{
  if(value.pickup) return;
  const required: Array<[keyof typeof value,string,number]> = [["recibeNombre","Nombre de quien recibe requerido",2],["recibeTel","Teléfono de quien recibe inválido",8],["provincia","Selecciona una provincia",1],["canton","Selecciona un cantón",2],["distrito","Selecciona un distrito",2],["direccion","Dirección exacta requerida",5]];
  for(const [key,message,min] of required) if(String(value[key]).trim().length<min) ctx.addIssue({code:z.ZodIssueCode.custom,path:[key],message});
  if(value.provincia&&value.canton&&!isSupportedDelivery(value.provincia,value.canton)) ctx.addIssue({code:z.ZodIssueCode.custom,path:["canton"],message:"No realizamos entregas en esta zona."});
});

type FormData = z.infer<typeof schema>;

const initial: FormData = {
  pickup: false,
  nombre: "",
  email: "",
  telefono: "",
  recibeNombre: "",
  recibeTel: "",
  provincia: "",
  canton: "",
  distrito: "",
  direccion: "",
  fecha: "",
  hora: "",
  mensaje: "",
};
const CHECKOUT_DRAFT_KEY="golden-bloom-checkout-draft";
const fmtCRC = (n: number) => `₡ ${n.toLocaleString("es-CR")}`;

const inputCls =
  "w-full bg-background border border-border rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

const CheckoutForm = ({ onCancel }: { onCancel: () => void }) => {
  const navigate=useNavigate();
  const queryClient=useQueryClient();
  const { items, total:cartTotal, clear, closeCart } = useCart();
  const { account, configured, login } = useAuth();
  const [data, setData] = useState<FormData>(()=>{
    try{return {...initial,...JSON.parse(sessionStorage.getItem(CHECKOUT_DRAFT_KEY)||"{}")};}
    catch{return initial;}
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);
  const [showGuestChoice,setShowGuestChoice]=useState(false);
  const [loyalty,setLoyalty]=useState<LoyaltySummary|null>(null);
  const [loyaltyError,setLoyaltyError]=useState(false);
  const [redeemFreeShipping,setRedeemFreeShipping]=useState(false);
  const [redeemCredit,setRedeemCredit]=useState(false);
  const [cantons,setCantons]=useState<Record<string,string>>({});
  const [districts,setDistricts]=useState<Record<string,string>>({});
  const [locationsError,setLocationsError]=useState(false);
  const provinceId=PROVINCE_IDS[data.provincia];
  const cantonEntry=Object.entries(cantons).find(([,name])=>name===data.canton);
  const shippingEstimate=data.pickup||isFreeDeliveryZone(data.provincia,data.canton,data.distrito)||redeemFreeShipping?0:2000;

  useEffect(()=>{
    if(data.pickup||isFreeDeliveryZone(data.provincia,data.canton,data.distrito)) setRedeemFreeShipping(false);
  },[data.pickup,data.provincia,data.canton,data.distrito]);

  useEffect(()=>{
    if(!provinceId){setCantons({});return;}
    let active=true;
    locationOptions(`/provincia/${provinceId}/cantones.json`).then(options=>{if(active){setCantons(provinceId===2?Object.fromEntries(Object.entries(options).filter(([,name])=>!excludedAlajuelaCantons.has(normalizePlace(name)))):options);setLocationsError(false);}}).catch(()=>{if(active)setLocationsError(true);});
    return ()=>{active=false;};
  },[provinceId]);
  useEffect(()=>{
    if(!provinceId||!cantonEntry){setDistricts({});return;}
    let active=true;
    locationOptions(`/provincia/${provinceId}/canton/${cantonEntry[0]}/distritos.json`).then(options=>{if(active){setDistricts(options);setLocationsError(false);}}).catch(()=>{if(active)setLocationsError(true);});
    return ()=>{active=false;};
  },[provinceId,cantonEntry?.[0]]);

  useEffect(()=>{
    if(!account)return;
    setData(current=>({...current,nombre:current.nombre||account.name||"",email:current.email||account.username||""}));
    customerApi.dashboard(account).then(profile=>{setLoyalty(profile.loyalty);setLoyaltyError(false);setData(current=>({...current,nombre:current.nombre||profile.name||"",email:current.email||profile.email||"",telefono:current.telefono||profile.phone||""}));}).catch(()=>setLoyaltyError(true));
  },[account]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const createOrder = async (d:FormData,asGuest=false) => {
    setSubmitting(true);
    let created:OrderInvoice;
    const delivery={...d,pickup:d.pickup?"Sí":"No",...(d.pickup?{recibeNombre:"",recibeTel:"",provincia:"",canton:"",distrito:"",direccion:""}:{})};
    try { created=asGuest?await customerApi.createGuestOrder({items,delivery}):await customerApi.createOrder(account!,{items,delivery,redeemFreeShipping,redeemCredit}); }
    catch(error){toast({title:"No pudimos registrar el pedido",description:error instanceof Error?error.message:undefined,variant:"destructive"});setSubmitting(false);return;}
    const lines: string[] = [];
    lines.push("*🌸 NUEVO PEDIDO — GOLDEN BLOOM*");
    lines.push(`Orden: ${created.invoiceNumber}`);
    lines.push("");
    lines.push("*👤 Solicitante*");
    lines.push(`Nombre: ${d.nombre}`);
    lines.push(`Correo: ${d.email}`);
    lines.push(`Teléfono: ${d.telefono}`);
    lines.push("");
    lines.push("*📦 Entrega*");
    if(d.pickup) lines.push("El cliente pasa a retirar");
    else {lines.push(`Recibe: ${d.recibeNombre} (${d.recibeTel})`);lines.push(`Provincia: ${d.provincia}`);lines.push(`Cantón: ${d.canton}`);lines.push(`Distrito: ${d.distrito}`);lines.push(`Dirección: ${d.direccion}`);}
    lines.push("");
    lines.push("*📅 Fecha y hora*");
    lines.push(`${d.fecha} · ${d.hora}`);
    lines.push("");
    lines.push("*🛒 Productos*");
    created.items.forEach((it) => { lines.push(`• ${it.name} x${it.quantity} — ${fmtCRC(it.lineSubtotal)}`); });
    lines.push("");
    lines.push(`Subtotal sin IVA: ${fmtCRC(created.subtotal)}`);
    lines.push(`IVA incluido (${created.taxRate*100}%): ${fmtCRC(created.taxAmount)}`);
    if(created.creditApplied) lines.push(`Crédito de lealtad aplicado: −${fmtCRC(created.creditApplied)}`);
    if(created.freeShippingRedeemed) lines.push("Beneficio de envío gratis redimido");
    lines.push(`Envío: ${fmtCRC(created.shippingFee)}`);
    lines.push(`*TOTAL: ${fmtCRC(created.total)}*`);
    if (d.mensaje && d.mensaje.trim().length > 0) { lines.push("", "*📝 Mensaje / notas*", d.mensaje.trim()); }
    sessionStorage.setItem("golden-bloom-order-whatsapp",lines.join("\n"));
    setInvoice(created);
    toast({title:"Solicitud creada",description:created.customerNotificationSent?"Enviamos una copia de la factura a tu correo.":"La factura fue creada, pero no pudimos enviar la copia por correo."});
    setSubmitting(false);
    void queryClient.invalidateQueries({queryKey:["customer-dashboard"]});
    clear();
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    setData(initial);
    onCancel();
    closeCart();
    navigate("/cuenta");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Tu carrito está vacío", variant: "destructive" });
      return;
    }
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof FormData;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      toast({ title: "Revisa los campos del formulario", variant: "destructive" });
      return;
    }
    setErrors({});
    const d = result.data;
    if(!account){setShowGuestChoice(true);return;}
    await createOrder(d);
  };

  if(invoice){
    const finish=()=>{clear();sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);setData(initial);setInvoice(null);onCancel();closeCart();navigate("/cuenta");};
    const whatsapp=()=>window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(sessionStorage.getItem("golden-bloom-order-whatsapp")||"")}`,"_blank","noopener,noreferrer");
    return <section className="space-y-6" aria-label="Orden de compra">
      <div className="text-center"><CheckCircle2 className="mx-auto text-primary" size={42}/><p className="text-xs tracking-[.3em] uppercase text-primary mt-3">Solicitud recibida</p><h3 className="font-serif text-3xl mt-2">Orden de compra</h3><p className="font-mono text-sm mt-1">{invoice.invoiceNumber}</p><p className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleString("es-CR")}</p></div>
      <div className="border border-border bg-card p-5 space-y-4"><div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[10px] uppercase tracking-wider text-muted-foreground"><span>Detalle</span><span>Cant.</span><span>Importe</span></div>{invoice.items.map((item,index)=><div key={`${item.sku}-${index}`} className="grid grid-cols-[1fr_auto_auto] gap-3 border-t border-border pt-3 text-sm"><div><strong>{item.name}</strong><p className="text-xs text-muted-foreground">{item.sku} · {fmtCRC(item.unitPrice)} c/u (IVA incluido)</p>{item.configuration?.map(option=><p key={option.sku} className="text-xs text-muted-foreground mt-1">↳ {option.quantity} × {option.name} ({fmtCRC(option.unitPrice)} c/u)</p>)}</div><span>{item.quantity}</span><span className="tabular-nums">{fmtCRC(item.lineSubtotal)}</span></div>)}<dl className="border-t border-border pt-4 space-y-2 text-sm"><div className="flex justify-between"><dt>Productos</dt><dd>{fmtCRC(invoice.productTotal)}</dd></div><div className="flex justify-between"><dt>Envío</dt><dd>{fmtCRC(invoice.shippingFee)}</dd></div>{invoice.creditApplied>0&&<div className="flex justify-between text-primary"><dt>Crédito de lealtad</dt><dd>−{fmtCRC(invoice.creditApplied)}</dd></div>}{invoice.freeShippingRedeemed&&<div className="flex justify-between text-primary"><dt>Beneficio de envío gratis</dt><dd>Redimido</dd></div>}<div className="flex justify-between"><dt>Subtotal sin IVA</dt><dd>{fmtCRC(invoice.subtotal)}</dd></div><div className="flex justify-between"><dt>IVA incluido ({invoice.taxRate*100}%)</dt><dd>{fmtCRC(invoice.taxAmount)}</dd></div><div className="flex justify-between font-serif text-xl text-primary"><dt>Total</dt><dd>{fmtCRC(invoice.total)}</dd></div></dl></div>
      <p className={`text-xs border p-3 ${invoice.notificationSent&&invoice.customerNotificationSent?"border-primary/30":"border-amber-500/40"}`}>{invoice.notificationSent&&invoice.customerNotificationSent?"Enviamos la factura a tu correo y notificamos a los administradores.":invoice.customerNotificationSent?"Enviamos tu factura por correo; la solicitud también está guardada en el panel administrativo.":"La solicitud está guardada, pero no se pudo enviar la copia por correo."}</p>
      <div className="grid sm:grid-cols-2 gap-3"><button type="button" onClick={()=>window.print()} className="border border-foreground/30 px-4 py-3 text-xs uppercase tracking-wider inline-flex justify-center items-center gap-2"><Printer size={15}/> Imprimir / PDF</button><button type="button" onClick={whatsapp} className="border border-foreground/30 px-4 py-3 text-xs uppercase tracking-wider inline-flex justify-center items-center gap-2"><MessageCircle size={15}/> WhatsApp</button></div>
      <button type="button" onClick={finish} className="w-full bg-primary text-primary-foreground px-5 py-4 text-xs uppercase tracking-[.25em]">Ir a mi cuenta</button>
    </section>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {showGuestChoice&&<div className="fixed inset-0 z-[100] bg-secondary/60 backdrop-blur-sm grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="guest-choice-title"><section className="bg-card shadow-elegant max-w-lg w-full p-8 text-center"><p className="text-xs tracking-[.3em] uppercase text-primary">Programa de lealtad</p><h3 id="guest-choice-title" className="font-serif text-3xl mt-3">¿Deseas acumular beneficios?</h3><p className="text-muted-foreground mt-4 leading-relaxed">Inicia sesión para sumar esta compra a tu tarjeta Golden Bloom. También puedes continuar sin beneficios y enviaremos normalmente la solicitud y la factura.</p><div className="grid gap-3 mt-7"><button type="button" disabled={!configured} onClick={()=>{sessionStorage.setItem(CHECKOUT_DRAFT_KEY,JSON.stringify(data));void login();}} className="bg-primary text-primary-foreground px-5 py-4 text-xs uppercase tracking-[.2em] inline-flex justify-center items-center gap-2 disabled:opacity-40"><LogIn size={16}/> Iniciar sesión y acumular</button><button type="button" onClick={()=>{setShowGuestChoice(false);void createOrder(data,true);}} className="border border-foreground/30 px-5 py-4 text-xs uppercase tracking-[.18em]">Continuar sin beneficios</button><button type="button" onClick={()=>setShowGuestChoice(false)} className="text-xs text-muted-foreground py-2">Volver al pedido</button></div></section></div>}
      {/* Solicitante */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-serif text-xl">
          <User size={18} className="text-primary" /> Datos del solicitante
        </h3>
        <input
          className={inputCls}
          placeholder="Nombre completo"
          value={data.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          maxLength={100}
        />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
        <input
          className={inputCls}
          type="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          maxLength={255}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        <input
          className={inputCls}
          placeholder="Teléfono del solicitante"
          value={data.telefono}
          onChange={(e) => set("telefono", e.target.value)}
          maxLength={20}
        />
        {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
      </section>

      {/* Entrega */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-serif text-xl">
          <Package size={18} className="text-primary" /> Datos de entrega
        </h3>
        <label className="flex items-center gap-3 border border-primary/30 p-4 cursor-pointer"><input type="checkbox" checked={data.pickup} onChange={e=>set("pickup",e.target.checked)}/><span>Pasaré a retirar mi pedido (sin costo de envío)</span></label>
        {!data.pickup&&<>
        <input
          className={inputCls}
          placeholder="Nombre de quien recibe"
          value={data.recibeNombre}
          onChange={(e) => set("recibeNombre", e.target.value)}
          maxLength={100}
        />
        {errors.recibeNombre && <p className="text-xs text-destructive">{errors.recibeNombre}</p>}
        <input
          className={inputCls}
          placeholder="Teléfono de quien recibe"
          value={data.recibeTel}
          onChange={(e) => set("recibeTel", e.target.value)}
          maxLength={20}
        />
        {errors.recibeTel && <p className="text-xs text-destructive">{errors.recibeTel}</p>}
        <select
          className={inputCls}
          value={data.provincia}
          onChange={(e) => setData(current=>({...current,provincia:e.target.value,canton:"",distrito:""}))}
        >
          <option value="">Provincia</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
        {locationsError?<input className={inputCls} placeholder="Cantón" value={data.canton} onChange={e=>setData(current=>({...current,canton:e.target.value,distrito:""}))} maxLength={80}/>:<select className={inputCls} value={data.canton} onChange={e=>setData(current=>({...current,canton:e.target.value,distrito:""}))} disabled={!data.provincia}><option value="">Selecciona un cantón</option>{Object.entries(cantons).map(([id,name])=><option key={id} value={name}>{name}</option>)}</select>}
        {errors.canton && <p className="text-xs text-destructive">{errors.canton}</p>}
        {locationsError?<input className={inputCls} placeholder="Distrito" value={data.distrito} onChange={e=>set("distrito",e.target.value)} maxLength={80}/>:<select className={inputCls} value={data.distrito} onChange={e=>set("distrito",e.target.value)} disabled={!data.canton}><option value="">Selecciona un distrito</option>{Object.entries(districts).map(([id,name])=><option key={id} value={name}>{name}</option>)}</select>}
        {errors.distrito && <p className="text-xs text-destructive">{errors.distrito}</p>}
        {locationsError&&<p className="text-xs text-amber-700">No se pudieron cargar las ubicaciones; puedes escribir el cantón y distrito.</p>}
        <textarea
          className={inputCls + " min-h-[80px] resize-y"}
          placeholder="Dirección exacta"
          value={data.direccion}
          onChange={(e) => set("direccion", e.target.value)}
          maxLength={400}
        />
        {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
        </>}
      </section>

      {/* Fecha y hora */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-serif text-xl">
          <Calendar size={18} className="text-primary" /> Fecha y hora
        </h3>
        <input
          className={inputCls}
          type="date"
          value={data.fecha}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => set("fecha", e.target.value)}
        />
        {errors.fecha && <p className="text-xs text-destructive">{errors.fecha}</p>}
        <select
          className={inputCls}
          value={data.hora}
          onChange={(e) => set("hora", e.target.value)}
        >
          <option value="">Seleccione una hora</option>
          {HORAS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        {errors.hora && <p className="text-xs text-destructive">{errors.hora}</p>}
        <textarea
          className={inputCls + " min-h-[70px] resize-y"}
          placeholder="Mensaje o tarjeta (opcional)"
          value={data.mensaje}
          onChange={(e) => set("mensaje", e.target.value)}
          maxLength={300}
        />
      </section>

      {account&&(loyalty?.freeShippingAvailable||Number(loyalty?.creditAvailable)>0)&&<section className="space-y-4 border border-primary/30 bg-primary/5 p-5" aria-label="Redimir beneficios"><h3 className="font-serif text-xl">Tus beneficios disponibles</h3>{loyalty?.freeShippingAvailable&&<label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={redeemFreeShipping} onChange={event=>setRedeemFreeShipping(event.target.checked)} disabled={data.pickup||isFreeDeliveryZone(data.provincia,data.canton,data.distrito)} className="mt-1"/><span><strong>Envío gratis</strong><span className="block text-sm text-muted-foreground">Lo ganaste al completar 5 compras. {data.pickup||isFreeDeliveryZone(data.provincia,data.canton,data.distrito)?"Este pedido ya tiene envío sin costo; guarda el beneficio para otra entrega.":"¿Quieres redimirlo en este pedido?"}</span></span></label>}{Number(loyalty?.creditAvailable)>0&&<label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={redeemCredit} onChange={event=>setRedeemCredit(event.target.checked)} className="mt-1"/><span><strong>Crédito del 10%: {fmtCRC(loyalty!.creditAvailable)} disponible</strong><span className="block text-sm text-muted-foreground">Lo ganaste al completar 10 compras. ¿Quieres aplicar hasta {fmtCRC(Math.min(cartTotal,loyalty!.creditAvailable))} a esta compra? Si sobra crédito, queda disponible para otra compra.</span></span></label>}<p className="text-xs text-muted-foreground">Los beneficios se aplican solo si los seleccionas. El importe definitivo se calcula con los precios vigentes al crear la orden.</p></section>}
      {account&&loyaltyError&&<p className="text-sm text-amber-700">No pudimos consultar tus beneficios. Puedes continuar sin redimirlos y volver a intentarlo después.</p>}
      <div className="border border-border p-4 text-sm space-y-2" aria-label="Resumen estimado"><div className="flex justify-between"><span>Productos</span><span>{fmtCRC(cartTotal)}</span></div><div className="flex justify-between"><span>Envío {data.pickup?"(retiro)":shippingEstimate===0?"(sin costo)":""}</span><span>{fmtCRC(shippingEstimate)}</span></div>{redeemCredit&&loyalty&&<div className="flex justify-between text-primary"><span>Crédito de lealtad estimado</span><span>−{fmtCRC(Math.min(cartTotal,loyalty.creditAvailable))}</span></div>}<div className="flex justify-between font-semibold border-t border-border pt-2"><span>Total estimado</span><span>{fmtCRC(Math.max(0,cartTotal+shippingEstimate-(redeemCredit&&loyalty?Math.min(cartTotal,loyalty.creditAvailable):0)))}</span></div></div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-foreground/30 px-6 py-4 text-xs tracking-widest sm:tracking-[0.3em] uppercase hover:border-primary hover:text-primary transition-colors"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-[2] bg-primary text-primary-foreground px-4 sm:px-6 py-4 text-xs tracking-widest sm:tracking-[0.3em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 whitespace-normal leading-relaxed"
        >
          {submitting ? "Creando orden..." : "Crear orden de compra"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
