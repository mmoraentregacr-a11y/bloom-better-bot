import { Fragment, useDeferredValue, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronUp, Clock3, PackageCheck, Search, ShoppingBag, XCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { accessToken, apiBaseUrl } from "@/lib/azure";
import { toast } from "@/hooks/use-toast";

type OrderItem = { sku:string; name:string; quantity:number; unit_price:number; configuration_json?:string };
type AdminOrder = { id:string; invoice_number?:string; created_at:string; subtotal?:number; tax_rate?:number; tax_amount?:number; total:number; status:"pending"|"paid"|"cancelled"; name:string; email:string; phone?:string; purchase_count:number; delivery:Record<string,string>; items:OrderItem[] };
type AdminResponse = { orders:AdminOrder[]; stats:{total:number;pending:number;paid:number;cancelled:number} };
const crc = (value:number) => `₡ ${Number(value).toLocaleString("es-CR")}`;
const statusLabel = { pending:"Pendiente", paid:"Confirmado", cancelled:"Cancelado" };

const AdminPedidos = () => {
  const { account, ready, login } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [expanded, setExpanded] = useState<string|null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const orders = useQuery({
    queryKey:["admin-orders",deferredSearch,status], enabled:Boolean(account),
    queryFn:async()=>{const token=await accessToken(account!);const params=new URLSearchParams({status});if(deferredSearch)params.set("search",deferredSearch);const response=await fetch(`${apiBaseUrl}/admin/orders?${params}`,{headers:{Authorization:`Bearer ${token}`}});if(!response.ok)throw new Error(response.status===403?"Tu cuenta no tiene permisos de administración.":"No se pudieron cargar los pedidos.");return response.json() as Promise<AdminResponse>;},
  });

  const confirm = async(id:string) => {
    if(!account || !window.confirm("¿Confirmar este pedido como pagado? Esta acción sumará un sello al cliente.")) return;
    const token=await accessToken(account); const response=await fetch(`${apiBaseUrl}/admin/orders/${id}/confirm`,{method:"POST",headers:{Authorization:`Bearer ${token}`}}); const body=await response.json().catch(()=>({}));
    if(!response.ok) return toast({title:"No se pudo confirmar",description:body.message,variant:"destructive"});
    toast({title:"Compra confirmada",description:`El cliente ahora tiene ${body.purchaseCount} de 10 sellos.`});
    await queryClient.invalidateQueries({queryKey:["admin-orders"]});
  };

  const stats=orders.data?.stats;
  return <PageLayout><main className="container pt-32 pb-24 min-h-[70vh]">
    <header className="mb-9"><p className="text-xs tracking-[.35em] uppercase text-primary">Administración</p><h1 className="font-serif text-5xl mt-2">Solicitudes de clientes</h1><p className="text-muted-foreground mt-3">Busca pedidos, revisa sus detalles y confirma las compras pagadas.</p></header>
    {!ready?<p>Cargando…</p>:!account?<button onClick={()=>login()} className="bg-primary text-primary-foreground px-8 py-4 uppercase text-xs tracking-wider">Ingresar como administrador</button>:<>
      {stats&&<section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">{[["Solicitudes",stats.total,ShoppingBag],["Pendientes",stats.pending,Clock3],["Confirmadas",stats.paid,PackageCheck],["Canceladas",stats.cancelled,XCircle]].map(([label,value,Icon])=><div key={String(label)} className="bg-card border border-border p-5 flex items-center gap-3"><Icon className="text-primary" size={20}/><div><p className="text-2xl font-serif">{Number(value)}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">{String(label)}</p></div></div>)}</section>}
      <section className="bg-card border border-border p-4 mb-6 grid sm:grid-cols-[1fr_190px] gap-3"><label className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nombre, correo, pedido o SKU…" className="w-full bg-background border border-border py-3 pl-10 pr-3 text-sm"/></label><select value={status} onChange={e=>setStatus(e.target.value)} className="bg-background border border-border px-3 py-3 text-sm"><option value="all">Todos los estados</option><option value="pending">Pendientes</option><option value="paid">Confirmados</option><option value="cancelled">Cancelados</option></select></section>
      {orders.isError?<p className="border border-destructive/30 p-5">{orders.error.message}</p>:orders.isLoading?<p className="py-12 text-center text-muted-foreground">Cargando solicitudes…</p>:orders.data?.orders.length===0?<p className="bg-card p-10 text-center text-muted-foreground">No encontramos solicitudes con esos filtros.</p>:<div className="space-y-4">{orders.data?.orders.map(order=>{const open=expanded===order.id;return <article key={order.id} className="bg-card border border-border shadow-soft">
        <div className="p-5 grid md:grid-cols-[1fr_auto_auto] gap-5 items-center"><button onClick={()=>setExpanded(open?null:order.id)} className="text-left flex items-start gap-3"><span className="mt-1 text-primary">{open?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</span><span><strong className="block">{order.name}</strong><span className="block text-sm text-muted-foreground">{order.email}{order.phone?` · ${order.phone}`:""}</span><span className="block text-xs text-muted-foreground mt-1">#{order.invoice_number||order.id} · {new Date(order.created_at).toLocaleString("es-CR")}</span></span></button><div className="md:text-right"><p className="font-serif text-2xl">{crc(order.total)}</p><p className={`text-xs uppercase tracking-wider ${order.status==="pending"?"text-amber-700":"text-primary"}`}>{statusLabel[order.status]}</p><p className="text-xs text-muted-foreground">{order.purchase_count} de 10 sellos</p></div>{order.status==="pending"?<button onClick={()=>confirm(order.id)} className="bg-secondary text-secondary-foreground px-5 py-3 text-xs uppercase tracking-wider hover:bg-primary inline-flex items-center justify-center gap-2"><Check size={15}/> Confirmar compra</button>:<span className="text-xs text-muted-foreground text-center">Procesado</span>}</div>
        {open&&<div className="border-t border-border p-5 grid md:grid-cols-2 gap-8 bg-background/40"><div><h3 className="font-serif text-xl mb-3">Productos</h3><div className="space-y-3">{order.items.map((item,index)=>{let options:Array<{sku:string;name:string;quantity:number;unitPrice:number}>=[];try{options=item.configuration_json?JSON.parse(item.configuration_json):[];}catch{options=[];}return <div key={`${item.sku}-${index}`} className="flex justify-between gap-4 text-sm"><div><p>{item.quantity} × {item.name}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">SKU {item.sku}</p>{options.map(option=><p key={option.sku} className="text-xs text-muted-foreground mt-1">↳ {option.quantity} × {option.name}</p>)}</div><span>{crc(item.unit_price*item.quantity)}</span></div>})}</div><dl className="border-t border-border mt-4 pt-4 text-sm space-y-2"><div className="flex justify-between"><dt>Subtotal</dt><dd>{crc(order.subtotal??order.total)}</dd></div><div className="flex justify-between"><dt>IVA ({Number(order.tax_rate||0)*100}%)</dt><dd>{crc(order.tax_amount||0)}</dd></div><div className="flex justify-between font-medium"><dt>Total</dt><dd>{crc(order.total)}</dd></div></dl></div><div><h3 className="font-serif text-xl mb-3">Entrega</h3><dl className="text-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">{Object.entries(order.delivery).filter(([,value])=>value).map(([key,value])=><Fragment key={key}><dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g," $1")}</dt><dd>{value}</dd></Fragment>)}</dl></div></div>}
      </article>})}</div>}
    </>}
  </main></PageLayout>;
};

export default AdminPedidos;
