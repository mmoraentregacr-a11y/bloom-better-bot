import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flower2, Gift, Minus, PackageOpen, Plus, ShoppingBag } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { customerApi } from "@/lib/api";
import { azureConfigured } from "@/lib/azure";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";

type Selection = Record<string, number>;
type BuilderOption = { id:string; sku:string; group:"flower"|"wrap"|"addon"; name:string; color?:string; price:number; min:number; max:number };
type PickerDraft = { type: string; optionId: string; quantity: number };
type BouquetSize = "small" | "medium" | "large";
const sizes: Record<BouquetSize, { label: string; flowers: number; price: number }> = {
  small: { label: "Pequeño", flowers: 3, price: 5500 },
  medium: { label: "Mediano", flowers: 6, price: 12000 },
  large: { label: "Grande", flowers: 12, price: 22000 },
};
const crc = (value: number) => `₡ ${value.toLocaleString("es-CR")}`;
const previewOptions: BuilderOption[] = [
  { id:"rosa-roja",sku:"FLR-ROSA-ROJA",group:"flower",name:"Rosa",color:"Roja",price:1500,min:0,max:100 },
  { id:"rosa-rosa",sku:"FLR-ROSA-ROSA",group:"flower",name:"Rosa",color:"Rosa",price:1500,min:0,max:100 },
  { id:"rosa-blanca",sku:"FLR-ROSA-BLANCA",group:"flower",name:"Rosa",color:"Blanca",price:1500,min:0,max:100 },
  { id:"rosa-amarilla",sku:"FLR-ROSA-AMARILLA",group:"flower",name:"Rosa",color:"Amarilla",price:1500,min:0,max:100 },
  { id:"gerbera-rosa",sku:"FLR-GERBERA-ROSA",group:"flower",name:"Gerbera",color:"Rosa",price:1400,min:0,max:100 },
  { id:"gerbera-blanca",sku:"FLR-GERBERA-BLANCA",group:"flower",name:"Gerbera",color:"Blanca",price:1400,min:0,max:100 },
  { id:"gerbera-amarilla",sku:"FLR-GERBERA-AMARILLA",group:"flower",name:"Gerbera",color:"Amarilla",price:1400,min:0,max:100 },
  { id:"clavel-rojo",sku:"FLR-CLAVEL-ROJO",group:"flower",name:"Clavel",color:"Rojo",price:900,min:0,max:100 },
  { id:"clavel-blanco",sku:"FLR-CLAVEL-BLANCO",group:"flower",name:"Clavel",color:"Blanco",price:900,min:0,max:100 },
  { id:"clavel-rosa",sku:"FLR-CLAVEL-ROSA",group:"flower",name:"Clavel",color:"Rosa",price:900,min:0,max:100 },
  { id:"girasol-amarillo",sku:"FLR-GIRASOL-AMARILLO",group:"flower",name:"Girasol",color:"Amarillo",price:2200,min:0,max:30 },
  { id:"kor-rosa",sku:"WRP-KOR-ROSA",group:"wrap" as const,name:"Papel coreano",color:"Rosa",price:0,min:0,max:1 },
  { id:"kor-blanco",sku:"WRP-KOR-BLANCO",group:"wrap" as const,name:"Papel coreano",color:"Blanco",price:0,min:0,max:1 },
  { id:"kor-negro",sku:"WRP-KOR-NEGRO",group:"wrap" as const,name:"Papel coreano",color:"Negro",price:0,min:0,max:1 },
  { id:"kor-rojo",sku:"WRP-KOR-ROJO",group:"wrap" as const,name:"Papel coreano",color:"Rojo",price:0,min:0,max:1 },
  { id:"kor-lila",sku:"WRP-KOR-LILA",group:"wrap" as const,name:"Papel coreano",color:"Lila",price:0,min:0,max:1 },
  { id:"globo-rojo",sku:"ADD-GLOBO-ROJO",group:"addon",name:"Globo",color:"Rojo",price:3500,min:0,max:5 },
  { id:"globo-rosa",sku:"ADD-GLOBO-ROSA",group:"addon",name:"Globo",color:"Rosa",price:3500,min:0,max:5 },
  { id:"globo-dorado",sku:"ADD-GLOBO-DORADO",group:"addon",name:"Globo",color:"Dorado",price:3500,min:0,max:5 },
  { id:"peluche-mediano",sku:"ADD-PELUCHE-MED",group:"addon",name:"Peluche",color:"Oso mediano",price:7500,min:0,max:5 },
  { id:"peluche-grande",sku:"ADD-PELUCHE-GDE",group:"addon",name:"Peluche",color:"Oso grande",price:12000,min:0,max:5 },
  { id:"ferrero-4",sku:"ADD-CHO-FERRERO-4",group:"addon",name:"Chocolates",color:"Ferrero Rocher · 4 unidades",price:3500,min:0,max:5 },
  { id:"ferrero-8",sku:"ADD-CHO-FERRERO-8",group:"addon",name:"Chocolates",color:"Ferrero Rocher · 8 unidades",price:5500,min:0,max:5 },
  { id:"hershey",sku:"ADD-CHO-HERSHEY",group:"addon",name:"Chocolates",color:"Hershey's",price:3000,min:0,max:5 },
  { id:"kitkat",sku:"ADD-CHO-KITKAT",group:"addon",name:"Chocolates",color:"KitKat",price:2500,min:0,max:5 },
];

const CreaTuRamo = () => {
  const { addItem } = useCart();
  const [selection, setSelection] = useState<Selection>({});
  const [size, setSize] = useState<BouquetSize>("small");
  const [drafts, setDrafts] = useState<Record<"flower"|"addon", PickerDraft>>({ flower:{type:"",optionId:"",quantity:1}, addon:{type:"",optionId:"",quantity:1} });
  const options = useQuery({ queryKey: ["builder-options"], queryFn: customerApi.builderOptions, enabled: azureConfigured });
  const availableOptions = azureConfigured ? options.data : previewOptions;
  const selected = useMemo(() => availableOptions?.filter(o => (selection[o.id] || 0) > 0) || [], [availableOptions, selection]);
  const flowerCount = selected.filter(o => o.group === "flower").reduce((sum, option) => sum + selection[option.id], 0);
  const extraFlowers = Math.max(0, flowerCount - sizes[size].flowers);
  const detailsTotal = selected.filter(o => o.group === "addon" || o.group === "wrap").reduce((sum, option) => sum + option.price * selection[option.id], 0);
  const total = sizes[size].price + extraFlowers * 2000 + detailsTotal;

  const change = (id: string, value: number, max: number, group: string) => setSelection(current => {
    const next = { ...current };
    if (group === "wrap") availableOptions?.filter(o => o.group === "wrap").forEach(o => delete next[o.id]);
    const safe = Math.max(0, Math.min(max, value));
    if (safe) next[id] = safe; else delete next[id];
    return next;
  });

  const addBouquet = () => {
    if (flowerCount < sizes[size].flowers) return toast({ title: `El ramo ${sizes[size].label.toLowerCase()} necesita al menos ${sizes[size].flowers} flores`, variant: "destructive" });
    const configuration = selected.map(o => ({ optionId: o.id, sku: o.sku, name: o.color ? `${o.name} ${o.color}` : o.name, quantity: selection[o.id] }));
    const signature = `${size}|${configuration.map(i => `${i.sku}:${i.quantity}`).join("|")}`;
    addItem({ id: `custom-${btoa(signature).replace(/[^a-z0-9]/gi, "").slice(0, 32)}`, sku: "CUSTOM-BOUQUET", name: `Ramo personalizado ${sizes[size].label.toLowerCase()}`, price: total, image: "/placeholder.svg", configuration, bouquetSize: size });
    toast({ title: "Ramo agregado", description: "Guardamos cada detalle de tu diseño." });
  };

  const quickSection = (group: "flower"|"addon", title:string, icon:React.ReactNode, help:string) => {
    const groupOptions = availableOptions?.filter(o=>o.group===group) || [];
    const types = Array.from(new Set(groupOptions.map(o=>o.name)));
    const draft = drafts[group];
    const variants = groupOptions.filter(o=>o.name===draft.type);
    const chosen = groupOptions.find(o=>o.id===draft.optionId);
    const selectedInGroup = selected.filter(o=>o.group===group);
    const updateDraft = (patch:Partial<PickerDraft>) => setDrafts(current=>({...current,[group]:{...current[group],...patch}}));
    const chooseType = (type:string) => { const first=groupOptions.find(o=>o.name===type); updateDraft({type,optionId:first?.id||"",quantity:1}); };
    const addDraft = () => { if(!chosen)return; change(chosen.id,(selection[chosen.id]||0)+draft.quantity,chosen.max,group); };
    return <section className="bg-card p-6 md:p-8 shadow-soft"><div className="flex gap-3 items-start mb-6"><span className="text-primary mt-1">{icon}</span><div><h2 className="font-serif text-3xl">{title}</h2><p className="text-sm text-muted-foreground">{help}</p></div></div>
      <div className="grid sm:grid-cols-[1fr_1.5fr_auto_auto] gap-3 items-end">
        <label className="text-xs text-muted-foreground">Producto<select value={draft.type} onChange={e=>chooseType(e.target.value)} className="mt-1 w-full bg-background border border-border px-3 py-3 text-sm"><option value="">Seleccionar…</option>{types.map(type=><option key={type}>{type}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Color, marca o estilo<select value={draft.optionId} onChange={e=>updateDraft({optionId:e.target.value})} disabled={!draft.type} className="mt-1 w-full bg-background border border-border px-3 py-3 text-sm disabled:opacity-50"><option value="">Seleccionar…</option>{variants.map(o=><option key={o.id} value={o.id}>{o.color||"Estándar"}{group === "addon" ? ` · ${crc(o.price)}` : ""}</option>)}</select></label>
        <label className="text-xs text-muted-foreground">Cantidad<input type="number" min="1" max={chosen?.max||1} value={draft.quantity} onChange={e=>updateDraft({quantity:Math.max(1,Number(e.target.value))})} className="mt-1 w-20 bg-background border border-border px-3 py-3 text-sm" /></label>
        <button type="button" onClick={addDraft} disabled={!chosen} className="h-[46px] bg-secondary text-secondary-foreground px-5 text-xs uppercase tracking-wider disabled:opacity-40">Agregar</button>
      </div>
      {selectedInGroup.length>0&&<div className="mt-6 pt-4 border-t border-border space-y-3">{selectedInGroup.map(o=><div key={o.id} className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium">{o.name} · {o.color}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{o.sku}{group === "addon" ? ` · ${crc(o.price)} c/u` : " · incluido en el cupo o ₡ 2.000 si es adicional"}</p></div><div className="flex items-center border border-border"><button onClick={()=>change(o.id,selection[o.id]-1,o.max,group)} className="p-2"><Minus size={14}/></button><span className="w-9 text-center">{selection[o.id]}</span><button onClick={()=>change(o.id,selection[o.id]+1,o.max,group)} className="p-2"><Plus size={14}/></button></div></div>)}</div>}
    </section>;
  };

  const wrapColors: Record<string, string> = {
    Rosa: "#e8a6b8",
    Blanco: "#fffdf8",
    Negro: "#171717",
    Rojo: "#b92832",
    Lila: "#b7a0cf",
  };
  const wraps = availableOptions?.filter(o => o.group === "wrap" && o.name === "Papel coreano") || [];
  const selectedWrap = wraps.find(o => selection[o.id]);
  const wrapSection = <section className="bg-card p-6 md:p-8 shadow-soft">
    <div className="flex gap-3 items-start"><span className="text-primary mt-1"><PackageOpen /></span><div><h2 className="font-serif text-3xl">Papel coreano</h2><p className="text-sm text-muted-foreground">Selecciona el color de la envoltura.</p></div></div>
    <div className="mt-7 flex flex-wrap gap-5">
      {wraps.map(option => {
        const active = Boolean(selection[option.id]);
        return <button key={option.id} type="button" onClick={() => change(option.id, active ? 0 : 1, 1, "wrap")} className="group flex flex-col items-center gap-2 min-w-14" aria-label={`Seleccionar papel coreano ${option.color}`} aria-pressed={active}>
          <span className={`w-9 h-9 rounded-full border-2 shadow-sm transition-all ${active ? "ring-2 ring-primary ring-offset-4 ring-offset-card scale-105" : "border-border group-hover:scale-105"}`} style={{ backgroundColor: wrapColors[option.color || ""] || "#d8c3a5" }} />
          <span className={`text-xs ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{option.color}</span>
        </button>;
      })}
    </div>
    <div className="mt-7 pt-5 border-t border-border"><p className="text-sm">{selectedWrap ? `Color seleccionado: ${selectedWrap.color}` : "Ningún color seleccionado"}</p>{selectedWrap && <p className="text-[10px] text-muted-foreground uppercase tracking-wider">SKU {selectedWrap.sku}</p>}</div>
  </section>;

  return <PageLayout><main className="pt-32 pb-24"><header className="container text-center max-w-3xl mb-12"><p className="text-xs tracking-[.4em] uppercase text-primary">Diseñado por ti</p><h1 className="font-serif text-5xl md:text-7xl mt-3">Crea tu ramo</h1><p className="text-muted-foreground mt-5">Elige el tamaño y combina tus flores. Cada flor adicional cuesta ₡ 2.000.</p></header>
    <div className="container grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-6"><section className="bg-card p-6 md:p-8 shadow-soft"><h2 className="font-serif text-3xl mb-5">Elige el tamaño</h2><div className="grid sm:grid-cols-3 gap-3">{(Object.keys(sizes) as BouquetSize[]).map(key => <button key={key} type="button" onClick={() => setSize(key)} aria-pressed={size === key} className={`border p-4 text-left ${size === key ? "border-primary bg-primary/10" : "border-border"}`}><strong className="block font-serif text-xl">{sizes[key].label}</strong><span className="block text-sm mt-1">{sizes[key].flowers} flores</span><span className="block text-primary mt-2">{crc(sizes[key].price)}</span></button>)}</div></section>{options.isLoading ? <p>Cargando opciones…</p> : options.isError ? <p className="border border-destructive/30 p-5">No pudimos cargar el constructor. Intenta nuevamente.</p> : <>{quickSection("flower","Elige tus flores",<Flower2/>,`Selecciona al menos ${sizes[size].flowers} flores. Cada flor adicional cuesta ₡ 2.000.`)}{wrapSection}{quickSection("addon","Agrega detalles",<Gift/>,"Selecciona globos, peluches o chocolates por marca y estilo.")}</>}</div>
      <aside className="lg:sticky lg:top-28 bg-secondary text-secondary-foreground p-7 shadow-elegant"><p className="text-xs tracking-[.3em] uppercase text-primary">Tu creación</p><h2 className="font-serif text-3xl mt-2">Ramo {sizes[size].label.toLowerCase()}</h2><div className="my-6 space-y-3 min-h-24"><div className="flex justify-between gap-3 text-sm"><span>Base · {sizes[size].flowers} flores</span><span>{crc(sizes[size].price)}</span></div>{selected.map(o => <div key={o.id} className="flex justify-between gap-3 text-sm"><span>{selection[o.id]} × {o.color ? `${o.name} ${o.color}` : o.name}</span>{o.group !== "flower" && <span>{crc(o.price * selection[o.id])}</span>}</div>)}{extraFlowers > 0 && <div className="flex justify-between gap-3 text-sm"><span>{extraFlowers} flores adicionales × ₡ 2.000</span><span>{crc(extraFlowers * 2000)}</span></div>}{flowerCount < sizes[size].flowers && <p className="text-sm text-secondary-foreground/60">Faltan {sizes[size].flowers - flowerCount} flores para completar el ramo.</p>}</div><div className="border-t border-primary/30 pt-5 flex items-baseline justify-between"><span className="text-xs uppercase tracking-wider">Total</span><strong className="font-serif text-3xl text-primary">{crc(total)}</strong></div><button onClick={addBouquet} disabled={!availableOptions || flowerCount < sizes[size].flowers} className="w-full mt-6 bg-primary text-primary-foreground py-4 text-xs tracking-[.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-40"><ShoppingBag size={15}/> Agregar al carrito</button></aside>
    </div>
  </main></PageLayout>;
};

export default CreaTuRamo;
