import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { LayoutDashboard, LogIn, LogOut, Package } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import LoyaltyCard from "@/components/LoyaltyCard";
import { useAuth } from "@/context/AuthContext";
import { customerApi } from "@/lib/api";

const statusText = { pending: "Pendiente", paid: "Confirmado", cancelled: "Cancelado" } as const;
const crc = (value: number) => `₡ ${value.toLocaleString("es-CR")}`;

const Cuenta = () => {
  const { account, configured, ready, login, logout } = useAuth();
  const dashboard = useQuery({
    queryKey: ["customer-dashboard", account?.homeAccountId],
    queryFn: () => customerApi.dashboard(account!),
    enabled: Boolean(account),
  });

  if (!ready) return <PageLayout><main className="container pt-36 pb-24">Cargando…</main></PageLayout>;

  if (!account) {
    return (
      <PageLayout>
        <main className="container pt-36 pb-24 min-h-[70vh] grid place-items-center">
          <section className="max-w-xl text-center bg-card p-10 md:p-14 shadow-soft">
            <p className="text-xs tracking-[0.35em] uppercase text-primary">Mi cuenta</p>
            <h1 className="font-serif text-5xl mt-4">Bienvenido a Golden Bloom</h1>
            <p className="text-muted-foreground mt-5 leading-relaxed">Crea tu cuenta o inicia sesión con tu correo para guardar pedidos y acumular beneficios.</p>
            {!configured && <p className="mt-6 text-sm border border-primary/30 bg-primary/5 p-4">La experiencia está lista; falta conectar las credenciales de Microsoft Entra en Azure.</p>}
            <button onClick={() => login()} disabled={!configured} className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase disabled:opacity-40">
              <LogIn size={16} /> Crear cuenta o ingresar
            </button>
          </section>
        </main>
      </PageLayout>
    );
  }

  if (dashboard.data?.isAdmin) {
    return <Navigate to="/admin/pedidos" replace />;
  }

  return (
    <PageLayout>
      <main className="container pt-32 pb-24">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div><p className="text-xs tracking-[0.35em] uppercase text-primary">Mi cuenta</p><h1 className="font-serif text-5xl mt-2">Hola, {dashboard.data?.name || account.name || "cliente"}</h1><p className="text-muted-foreground mt-2">{account.username}</p></div>
          <div className="flex items-center gap-5">{dashboard.data?.isAdmin&&<Link to="/admin/pedidos" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary"><LayoutDashboard size={15}/> Panel administrativo</Link>}<button onClick={() => logout()} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"><LogOut size={15} /> Cerrar sesión</button></div>
        </header>

        {dashboard.isLoading && <p className="py-16 text-center text-muted-foreground">Cargando tu progreso…</p>}
        {dashboard.isError && <section className="border border-destructive/30 p-6 text-center"><p>No pudimos cargar tu cuenta.</p><button onClick={() => dashboard.refetch()} className="text-primary mt-2">Intentar nuevamente</button></section>}
        {dashboard.data && <>
          <LoyaltyCard loyalty={dashboard.data.loyalty} />
          <section className="mt-14">
            <div className="flex items-end justify-between mb-6"><div><p className="text-xs tracking-[0.3em] uppercase text-primary">Actividad</p><h2 className="font-serif text-3xl mt-1">Mis pedidos</h2></div><Link to="/productos" className="text-xs uppercase tracking-wider border-b border-primary">Comprar</Link></div>
            {dashboard.data.orders.length === 0 ? <div className="bg-card p-10 text-center text-muted-foreground"><Package className="mx-auto mb-3 text-primary" /><p>Aún no tienes pedidos.</p></div> : <div className="divide-y divide-border bg-card shadow-soft">{dashboard.data.orders.map(order => <article key={order.id} className="p-5 flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium">Pedido #{order.id.slice(-6).toUpperCase()}</p><p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("es-CR")} · {order.itemCount} productos</p></div><div className="text-right"><p>{crc(order.total)}</p><p className="text-xs uppercase tracking-wider text-primary">{statusText[order.status]}</p></div></article>)}</div>}
          </section>
        </>}
      </main>
    </PageLayout>
  );
};

export default Cuenta;
