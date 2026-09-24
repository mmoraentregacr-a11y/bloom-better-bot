import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, ChevronDown, CircleUserRound } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

type SubItem = { to: string; label: string };
type NavItem = { to?: string; label: string; children?: SubItem[] };

const navItems: NavItem[] = [
  { to: "/", label: "Inicio" },
  { to: "/crea-tu-ramo", label: "Crea tu ramo" },
  {
    label: "Ramos",
    children: [
      { to: "/grandes", label: "Ramos Grandes" },
      { to: "/pequenos", label: "Ramos Pequeños" },
      { to: "/cajas-jarrones", label: "Cajas y Jarrones" },
      { to: "/boda", label: "Boda" },
    ],
  },
  {
    label: "Regalos",
    children: [
      { to: "/regalos/dulces", label: "Dulces" },
      { to: "/regalos/peluches", label: "Peluches" },
      { to: "/regalos/globos", label: "Globos" },
    ],
  },
  // Menú estacional oculto temporalmente.
  // {
  //   label: "21 Septiembre",
  //   children: [
  //     { to: "/21-septiembre", label: "Flores amarillas" },
  //   ],
  // },
  { to: "/suscripcion", label: "Miembro Golden" },
];

const linkClass = (isActive: boolean) =>
  `text-sm tracking-wide uppercase transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/80"
  }`;

const DesktopDropdown = ({ item }: { item: NavItem }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const isActive = item.children?.some((c) => location.pathname.startsWith(c.to));

  const handleEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        className={`flex items-center gap-1 ${linkClass(!!isActive)}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 min-w-[220px] animate-fade-in">
          <div className="bg-background border border-border shadow-soft py-2">
            {item.children!.map((c) => (
              <NavLink
                key={c.to}
                to={c.to}
                className={({ isActive }) =>
                  `block px-5 py-2.5 text-sm tracking-wide transition-colors hover:bg-muted hover:text-primary ${isActive ? "text-primary" : "text-foreground/80"
                  }`
                }
              >
                {c.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-soft" : "bg-transparent"
        }`}
    >
      <div className="container flex items-center justify-between h-20">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.slice(0, -1).map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === "/"}
                className={({ isActive }) => linkClass(isActive)}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/cuenta" aria-label="Mi cuenta" className="p-2 text-foreground hover:text-primary transition-colors"><CircleUserRound size={20} /></Link>
          <Link
            to="/suscripcion"
            className="text-xs tracking-[0.2em] uppercase border border-primary text-primary px-5 py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Miembro Golden
          </Link>
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative p-2 text-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <Link to="/cuenta" aria-label="Mi cuenta" className="p-2 text-foreground hover:text-primary transition-colors"><CircleUserRound size={20} /></Link>
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative p-2 text-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            className="p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container py-6 flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-border/50 last:border-b-0">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileSection(openMobileSection === item.label ? null : item.label)
                    }
                    className="w-full flex items-center justify-between py-3 text-base tracking-wide uppercase text-foreground/80"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openMobileSection === item.label ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openMobileSection === item.label && (
                    <div className="pb-3 pl-4 flex flex-col gap-2">
                      {item.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          onClick={() => {
                            setOpen(false);
                            setOpenMobileSection(null);
                          }}
                          className={({ isActive }) =>
                            `text-sm py-1.5 ${isActive ? "text-primary" : "text-foreground/70"}`
                          }
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base tracking-wide uppercase py-3 border-b border-border/50 ${isActive ? "text-primary" : "text-foreground/80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
