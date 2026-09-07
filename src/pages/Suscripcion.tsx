import { Crown, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import heroImg from "@/assets/hero-bouquet.jpg";
import { useAuth } from "@/context/AuthContext";

const Suscripcion = () => {
  const { account, configured, login } = useAuth();
  const navigate = useNavigate();

  const subscribe = async () => {
    if (account) {
      navigate("/cuenta");
      return;
    }
    await login();
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <p className="flex items-center gap-3 text-xs tracking-[0.4em] uppercase text-primary">
              <Crown size={14} /> Club exclusivo
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              Miembro <br />
              <span className="italic text-gradient-gold">Golden Bloom</span>
            </h1>
            <div className="w-16 h-px bg-primary" />
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Únete al círculo de nuestros clientes más queridos. Beneficios únicos,
              atenciones especiales y un mundo de flores diseñado solo para ti.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-gold opacity-20 blur-3xl" />
            <img src={heroImg} alt="Membresía Golden Bloom" className="relative w-full aspect-[4/5] object-cover shadow-elegant" />
          </div>
        </div>
      </section>

      {/* Planes */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <p className="text-xs tracking-[0.4em] uppercase text-primary">Beneficios</p>
          <h2 className="font-serif text-5xl">
            Nuestro <span className="italic text-gradient-gold">plan de lealtad</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Plan lealtad */}
          <article className="p-10 bg-card shadow-soft hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Crown size={18} />
              </div>
              <h3 className="font-serif text-3xl">Plan lealtad Golden Bloom</h3>
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Obtienes</p>
            <ul className="space-y-3 text-foreground/90 leading-relaxed">
              <li>• 10% de descuento en tu primera compra.</li>
              <li>• Al completar tu quinta compra recibes 1 envío gratis.</li>
              <li>• En tu décima compra recibe un 10% de descuento de la suma de tus 10 compras anteriores.</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-6 italic">
              Nota: Deben aplicarse en el periodo 1 ene 2026 al 31 dic 2026.
            </p>
          </article>

        </div>
      </section>

      {/* Acceso */}
      <section className="bg-gradient-cream py-24">
        <div className="container max-w-2xl">
          <div className="text-center mb-12 space-y-4">
            <p className="text-xs tracking-[0.4em] uppercase text-primary">Suscríbete</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Únete a <span className="italic text-gradient-gold">Golden Bloom</span>
            </h2>
          </div>

          <div className="bg-card p-8 md:p-10 shadow-soft text-center">
            <p className="text-muted-foreground leading-relaxed">Crea tu cuenta o inicia sesión para activar automáticamente tu tarjeta de lealtad y acumular cada pedido confirmado.</p>
            <button
              type="button"
              onClick={() => void subscribe()}
              disabled={!configured}
              className="mt-8 inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <LogIn size={16} /> {account ? "Ver mi tarjeta" : "Suscribirse"}
            </button>
            {!configured && <p className="mt-4 text-sm text-destructive">El inicio de sesión de Azure todavía no está configurado.</p>}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Suscripcion;
