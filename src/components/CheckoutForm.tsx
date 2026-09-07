import { useEffect, useState } from "react";
import { z } from "zod";
import { User, Package, Calendar, CheckCircle2, MessageCircle, Printer } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { customerApi, type OrderInvoice } from "@/lib/api";

const PROVINCIAS = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
];


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
  nombre: z.string().trim().min(2, "Nombre requerido").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  telefono: z.string().trim().min(8, "Teléfono inválido").max(20),
  recibeNombre: z.string().trim().min(2, "Requerido").max(100),
  recibeTel: z.string().trim().min(8, "Teléfono inválido").max(20),
  provincia: z.string().min(1, "Selecciona una provincia"),
  canton: z.string().trim().min(2, "Cantón requerido").max(80),
  distrito: z.string().trim().min(2, "Distrito requerido").max(80),
  direccion: z.string().trim().min(5, "Dirección exacta requerida").max(400),
  fecha: z.string().min(1, "Fecha requerida"),
  hora: z.string().min(1, "Selecciona una hora"),
  mensaje: z.string().max(300).optional(),
});

type FormData = z.infer<typeof schema>;

const initial: FormData = {
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

const inputCls =
  "w-full bg-background border border-border rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

const CheckoutForm = ({ onCancel }: { onCancel: () => void }) => {
  const { items, clear } = useCart();
  const { account, configured } = useAuth();
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<OrderInvoice | null>(null);

  useEffect(()=>{
    if(!account)return;
    setData(current=>({...current,nombre:current.nombre||account.name||"",email:current.email||account.username||""}));
    customerApi.dashboard(account).then(profile=>setData(current=>({...current,nombre:current.nombre||profile.name||"",email:current.email||profile.email||"",telefono:current.telefono||profile.phone||""}))).catch(()=>undefined);
  },[account]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

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
    setSubmitting(true);

    if (configured && !account) {
      toast({ title: "Inicia sesión para realizar tu pedido", description: "Así podrás acumular tus beneficios Golden Bloom.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const d = result.data;
    if (!account) { toast({ title:"Inicia sesión para guardar la solicitud", variant:"destructive" }); setSubmitting(false); return; }
    let created:OrderInvoice;
    try { created=await customerApi.createOrder(account,{items,delivery:d}); }
    catch(error){toast({title:"No pudimos registrar el pedido",description:error instanceof Error?error.message:undefined,variant:"destructive"});setSubmitting(false);return;}
    const fmtCRC = (n: number) => `₡ ${n.toLocaleString("es-CR")}`;
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
    lines.push(`Recibe: ${d.recibeNombre} (${d.recibeTel})`);
    lines.push(`Provincia: ${d.provincia}`);
    lines.push(`Cantón: ${d.canton}`);
    lines.push(`Distrito: ${d.distrito}`);
    lines.push(`Dirección: ${d.direccion}`);
    lines.push("");
    lines.push("*📅 Fecha y hora*");
    lines.push(`${d.fecha} · ${d.hora}`);
    lines.push("");
    lines.push("*🛒 Productos*");
    created.items.forEach((it) => {
      lines.push(`• ${it.name} x${it.quantity} — ${fmtCRC(it.lineSubtotal)}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${fmtCRC(created.subtotal)}`);
    lines.push(`IVA (${created.taxRate*100}%): ${fmtCRC(created.taxAmount)}`);
    lines.push(`*TOTAL: ${fmtCRC(created.total)}*`);
    if (d.mensaje && d.mensaje.trim().length > 0) {
      lines.push("");
      lines.push("*📝 Mensaje / notas*");
      lines.push(d.mensaje.trim());
    }

    sessionStorage.setItem("golden-bloom-order-whatsapp",lines.join("\n"));
    setInvoice(created);
    toast({title:"Solicitud creada",description:created.customerNotificationSent?"Enviamos una copia de la factura a tu correo.":"La factura fue creada, pero no pudimos enviar la copia por correo."});
    setSubmitting(false);
  };

  if(invoice){
    const finish=()=>{clear();setData(initial);setInvoice(null);onCancel();};
    const whatsapp=()=>window.open(`https://wa.me/${ORDER_WHATSAPP}?text=${encodeURIComponent(sessionStorage.getItem("golden-bloom-order-whatsapp")||"")}`,"_blank","noopener,noreferrer");
    return <section className="space-y-6" aria-label="Orden de compra">
      <div className="text-center"><CheckCircle2 className="mx-auto text-primary" size={42}/><p className="text-xs tracking-[.3em] uppercase text-primary mt-3">Solicitud recibida</p><h3 className="font-serif text-3xl mt-2">Orden de compra</h3><p className="font-mono text-sm mt-1">{invoice.invoiceNumber}</p><p className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleString("es-CR")}</p></div>
      <div className="border border-border bg-card p-5 space-y-4"><div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[10px] uppercase tracking-wider text-muted-foreground"><span>Detalle</span><span>Cant.</span><span>Importe</span></div>{invoice.items.map((item,index)=><div key={`${item.sku}-${index}`} className="grid grid-cols-[1fr_auto_auto] gap-3 border-t border-border pt-3 text-sm"><div><strong>{item.name}</strong><p className="text-xs text-muted-foreground">{item.sku} · {fmtCRC(item.unitPrice)} c/u</p>{item.configuration?.map(option=><p key={option.sku} className="text-xs text-muted-foreground mt-1">↳ {option.quantity} × {option.name} ({fmtCRC(option.unitPrice)} c/u)</p>)}</div><span>{item.quantity}</span><span className="tabular-nums">{fmtCRC(item.lineSubtotal)}</span></div>)}<dl className="border-t border-border pt-4 space-y-2 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{fmtCRC(invoice.subtotal)}</dd></div><div className="flex justify-between"><dt>IVA ({invoice.taxRate*100}%)</dt><dd>{fmtCRC(invoice.taxAmount)}</dd></div><div className="flex justify-between font-serif text-xl text-primary"><dt>Total</dt><dd>{fmtCRC(invoice.total)}</dd></div></dl></div>
      <p className={`text-xs border p-3 ${invoice.notificationSent&&invoice.customerNotificationSent?"border-primary/30":"border-amber-500/40"}`}>{invoice.notificationSent&&invoice.customerNotificationSent?"Enviamos la factura a tu correo y notificamos a los administradores.":invoice.customerNotificationSent?"Enviamos tu factura por correo; la solicitud también está guardada en el panel administrativo.":"La solicitud está guardada, pero no se pudo enviar la copia por correo."}</p>
      <div className="grid sm:grid-cols-2 gap-3"><button type="button" onClick={()=>window.print()} className="border border-foreground/30 px-4 py-3 text-xs uppercase tracking-wider inline-flex justify-center items-center gap-2"><Printer size={15}/> Imprimir / PDF</button><button type="button" onClick={whatsapp} className="border border-foreground/30 px-4 py-3 text-xs uppercase tracking-wider inline-flex justify-center items-center gap-2"><MessageCircle size={15}/> WhatsApp</button></div>
      <button type="button" onClick={finish} className="w-full bg-primary text-primary-foreground px-5 py-4 text-xs uppercase tracking-[.25em]">Finalizar</button>
    </section>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          onChange={(e) => set("provincia", e.target.value)}
        >
          <option value="">Provincia</option>
          {PROVINCIAS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
        <input
          className={inputCls}
          placeholder="Cantón"
          value={data.canton}
          onChange={(e) => set("canton", e.target.value)}
          maxLength={80}
        />
        {errors.canton && <p className="text-xs text-destructive">{errors.canton}</p>}
        <input
          className={inputCls}
          placeholder="Distrito"
          value={data.distrito}
          onChange={(e) => set("distrito", e.target.value)}
          maxLength={80}
        />
        {errors.distrito && <p className="text-xs text-destructive">{errors.distrito}</p>}
        <textarea
          className={inputCls + " min-h-[80px] resize-y"}
          placeholder="Dirección exacta"
          value={data.direccion}
          onChange={(e) => set("direccion", e.target.value)}
          maxLength={400}
        />
        {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
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
