import { ClipboardList, Flower2, LogOut, Warehouse } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const destinations = [
  { to: "/admin/pedidos", label: "Pedidos", Icon: ClipboardList },
  { to: "/admin/inventario", label: "Inventario", Icon: Warehouse },
  { to: "/admin/opciones-ramo", label: "Opciones del ramo", Icon: Flower2 },
];

export default function AdminNav() {
  const { account, logout } = useAuth();

  return <nav aria-label="Administración" className="flex flex-wrap items-center gap-3">
    {destinations.map(({ to, label, Icon }) => <NavLink
      key={to}
      to={to}
      className={({ isActive }) => `inline-flex items-center gap-2 border px-5 py-3 text-xs uppercase tracking-wider transition-colors ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary"}`}
    ><Icon size={16}/>{label}</NavLink>)}
    {account && <button type="button" onClick={() => void logout()} className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs uppercase tracking-wider transition-colors hover:border-destructive hover:text-destructive"><LogOut size={16}/> Cerrar sesión</button>}
  </nav>;
}
