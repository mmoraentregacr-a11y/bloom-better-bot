import { Gift, Truck, Percent } from "lucide-react";
import BrandMark from "./BrandMark";
import type { LoyaltySummary } from "@/types/customer";

const crc = (value: number) => `₡ ${value.toLocaleString("es-CR")}`;

const LoyaltyCard = ({ loyalty }: { loyalty: LoyaltySummary }) => {
  const stamps = Math.min(loyalty.completedPurchases, 10);
  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground p-7 md:p-10 shadow-elegant">
      <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full border border-primary/20" />
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9">
        <div>
          <p className="text-[10px] tracking-[0.38em] uppercase text-primary">Cliente frecuente</p>
          <h2 className="font-serif text-4xl mt-2">Tu tarjeta Golden Bloom</h2>
        </div>
        <p className="text-sm text-secondary-foreground/65">{stamps} de 10 compras</p>
      </div>

      <div className="relative grid grid-cols-5 gap-3 md:gap-5" aria-label={`${stamps} de 10 compras completadas`}>
        {Array.from({ length: 10 }, (_, index) => {
          const complete = index < stamps;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className={`aspect-square w-full max-w-[78px] rounded-full border flex items-center justify-center transition-all ${complete ? "bg-primary border-primary text-primary-foreground shadow-gold" : "border-primary/45 text-primary/25"}`}>
                {complete ? <BrandMark className="w-[72%] h-[72%]" /> : <span className="text-xs tabular-nums">{index + 1}</span>}
              </div>
              {index === 4 && <span className="text-[9px] uppercase tracking-wider text-primary">10%</span>}
              {index === 7 && <span className="text-[9px] uppercase tracking-wider text-primary">Envío</span>}
              {index === 9 && <span className="text-[9px] uppercase tracking-wider text-primary">10%</span>}
            </div>
          );
        })}
      </div>

      <div className="relative grid sm:grid-cols-3 gap-3 mt-9 pt-6 border-t border-primary/25">
        <div className="flex gap-3 items-center"><Percent className="text-primary" size={20} /><div><p className="text-xs uppercase tracking-wider">Compra 5</p><p className="text-sm text-secondary-foreground/65">{loyalty.discountAvailable ? "10% de descuento disponible" : "10% en una próxima compra"}</p></div></div>
        <div className="flex gap-3 items-center"><Truck className="text-primary" size={20} /><div><p className="text-xs uppercase tracking-wider">Compra 8</p><p className="text-sm text-secondary-foreground/65">{loyalty.freeShippingAvailable ? "Envío gratis disponible" : "Un envío gratis"}</p></div></div>
        <div className="flex gap-3 items-center"><Gift className="text-primary" size={20} /><div><p className="text-xs uppercase tracking-wider">Compra 10</p><p className="text-sm text-secondary-foreground/65">{loyalty.creditAvailable > 0 ? `${crc(loyalty.creditAvailable)} disponibles` : "Crédito del 10% acumulado"}</p></div></div>
      </div>
    </section>
  );
};

export default LoyaltyCard;
