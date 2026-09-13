import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, Package, Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { accessToken, apiBaseUrl } from "@/lib/azure";
import { toast } from "@/hooks/use-toast";

type Option = { id:string; sku:string; group:"flower"|"wrap"|"addon"; name:string; color:string|null; price:number; min:number; max:number; displayOrder:number; active:boolean };
type Draft = Omit<Option,"id">;
const empty: Draft = { sku:"", group:"flower", name:"", color:"", price:0, min:0, max:100, displayOrder:0, active:true };
const labels = { flower:"Flor", wrap:"Envoltura", addon:"Complemento" };
const field = "w-full border border-border bg-background px-3 py-3 text-sm";

export default function AdminBuilderOptions() {
  const { account, ready, login } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const options = useQuery({ queryKey:["admin-builder-options"], enabled:Boolean(account), retry:false, queryFn:async()=>{
    const token=await accessToken(account!);
    const response=await fetch(`${apiBaseUrl}/admin-builder-options`,{headers:{"X-Golden-Bloom-Authorization":`Bearer ${token}`}});
    const body=await response.json().catch(()=>null);
    if(!response.ok) throw new Error(body?.message||"No se pudieron cargar las opciones.");
    return body as Option[];
  }});
  const select = (option:Option) => { const {id,...data}=option; setDraft(data); setEditing(id); window.scrollTo({top:0,behavior:"smooth"}); };
  const reset = () => { setDraft(empty); setEditing(null); };
  const save = async (event:FormEvent) => {
    event.preventDefault(); if(!account) return;
    setSaving(true);
    try {
      const token=await accessToken(account);
      const response=await fetch(`${apiBaseUrl}/admin-builder-options${editing?`/${editing}`:""}`,{
        method:editing?"PATCH":"POST", headers:{"Content-Type":"application/json","X-Golden-Bloom-Authorization":`Bearer ${token}`}, body:JSON.stringify(draft),
      });
      const body=await response.json().catch(()=>null);
      if(!response.ok) throw new Error(body?.message||"No se pudo guardar la opción.");
      toast({title:editing?"Opción actualizada":"Opción creada"}); reset();
      await Promise.all([queryClient.invalidateQueries({queryKey:["admin-builder-options"]}),queryClient.invalidateQueries({queryKey:["builder-options"]}),queryClient.invalidateQueries({queryKey:["inventory"]})]);
    } catch(error) { toast({title:"No se pudo guardar",description:error instanceof Error?error.message:undefined,variant:"destructive"}); }
    finally { setSaving(false); }
  };
  const filtered=options.data?.filter(o=>`${o.sku} ${o.name} ${o.color||""}`.toLowerCase().includes(search.toLowerCase()))||[];
  return <PageLayout><main className="container pt-32 pb-24 min-h-[70vh]">
    <header className="mb-8 flex flex-wrap justify-between gap-5 items-end"><div><p className="text-xs tracking-[.35em] uppercase text-primary">Administración</p><h1 className="font-serif text-5xl mt-2">Opciones de Crea tu ramo</h1><p className="text-muted-foreground mt-3">Agrega y modifica flores, envolturas y complementos de BuilderOptions.</p></div><nav className="flex gap-4 text-xs uppercase tracking-wider"><Link className="inline-flex items-center gap-2 text-primary" to="/admin/pedidos"><ClipboardList size={16}/> Pedidos</Link><Link className="inline-flex items-center gap-2 text-primary" to="/admin/inventario"><Package size={16}/> Inventario</Link></nav></header>
    {!ready?<p>Cargando…</p>:!account?<button onClick={()=>void login()} className="bg-primary text-primary-foreground px-8 py-4 text-xs uppercase">Ingresar como administrador</button>:options.isError?<p className="border border-destructive/30 p-5">{options.error.message}</p>:<div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-7 items-start">
      <section><input aria-label="Buscar opción" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre, color o SKU…" className={`${field} mb-4`}/><div className="bg-card border border-border divide-y divide-border">{options.isLoading?<p className="p-6">Cargando opciones…</p>:filtered.length===0?<p className="p-6 text-muted-foreground">No hay opciones con ese filtro.</p>:filtered.map(option=><article key={option.id} className="p-4 flex flex-wrap justify-between gap-3 items-center"><div><p className="font-medium">{option.name}{option.color?` · ${option.color}`:""}</p><p className="text-xs text-muted-foreground">{option.sku} · {labels[option.group]} · máximo {option.max} · orden {option.displayOrder}{!option.active?" · Oculto":""}</p></div><div className="flex items-center gap-4"><span className="font-serif text-xl">₡ {Number(option.price).toLocaleString("es-CR")}</span><button type="button" onClick={()=>select(option)} className="border border-primary text-primary px-4 py-2 text-xs uppercase">Editar</button></div></article>)}</div></section>
      <form onSubmit={save} className="bg-card border border-border p-6 space-y-4 lg:sticky lg:top-28"><div className="flex justify-between items-center"><h2 className="font-serif text-3xl">{editing?"Editar opción":"Nueva opción"}</h2>{editing&&<button type="button" onClick={reset} className="text-xs text-primary">Cancelar</button>}</div>
        <label className="block text-xs">SKU<input required value={draft.sku} disabled={Boolean(editing)} onChange={e=>setDraft({...draft,sku:e.target.value.toUpperCase()})} pattern="[A-Za-z0-9_-]{2,100}" maxLength={100} className={`${field} mt-1 disabled:opacity-60`}/></label>
        <label className="block text-xs">Grupo<select value={draft.group} onChange={e=>setDraft({...draft,group:e.target.value as Draft["group"]})} className={`${field} mt-1`}><option value="flower">Flor</option><option value="wrap">Envoltura</option><option value="addon">Complemento</option></select></label>
        <label className="block text-xs">Nombre<input required maxLength={160} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} className={`${field} mt-1`}/></label>
        <label className="block text-xs">Color, marca o variante<input maxLength={100} value={draft.color||""} onChange={e=>setDraft({...draft,color:e.target.value})} className={`${field} mt-1`}/></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs">Precio (₡)<input required type="number" min="0" max="10000000" step="0.01" value={draft.price} onChange={e=>setDraft({...draft,price:Number(e.target.value)})} className={`${field} mt-1`}/></label><label className="text-xs">Orden<input required type="number" min="0" max="100000" step="1" value={draft.displayOrder} onChange={e=>setDraft({...draft,displayOrder:Number(e.target.value)})} className={`${field} mt-1`}/></label><label className="text-xs">Cantidad mínima<input required type="number" min="0" max="1000" step="1" value={draft.min} onChange={e=>setDraft({...draft,min:Number(e.target.value)})} className={`${field} mt-1`}/></label><label className="text-xs">Cantidad máxima<input required type="number" min="1" max="1000" step="1" value={draft.max} onChange={e=>setDraft({...draft,max:Number(e.target.value)})} className={`${field} mt-1`}/></label></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={e=>setDraft({...draft,active:e.target.checked})}/> Visible en el constructor</label><p className="text-xs text-muted-foreground">El SKU no se puede cambiar después de crear la opción. El precio de las flores adicionales se rige por el tamaño del ramo; aquí se cobra el precio de complementos.</p><button disabled={saving} className="w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-4 text-xs uppercase tracking-wider disabled:opacity-50"><Plus size={15}/>{saving?"Guardando…":editing?"Guardar cambios":"Crear opción"}</button>
      </form></div>}
  </main></PageLayout>;
}
