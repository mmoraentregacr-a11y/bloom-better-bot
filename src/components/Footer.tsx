import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground mt-32">
    <div className="container py-20 grid md:grid-cols-4 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h3 className="font-serif text-3xl">
          Golden <span className="italic text-gold-light">Bloom</span>
        </h3>
        <p className="text-secondary-foreground/70 max-w-md leading-relaxed">
          Floristería boutique en Costa Rica. Cada arreglo es una obra única,
          confeccionada a mano para iluminar tus momentos más importantes.
        </p>
        <div className="flex gap-4">
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light mb-5">Colecciones</h4>
        <ul className="space-y-3 text-sm text-secondary-foreground/80">
          <li><Link to="/grandes" className="hover:text-gold-light">Ramos Grandes</Link></li>
          <li><Link to="/pequenos" className="hover:text-gold-light">Ramos Pequeños</Link></li>
          <li><Link to="/boda" className="hover:text-gold-light">Boda</Link></li>
          <li><Link to="/regalos" className="hover:text-gold-light">Regalos</Link></li>
          {/* <li><Link to="/perfumes" className="hover:text-gold-light">Perfumes</Link></li> */}
        </ul>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.3em] uppercase text-gold-light mb-5">Contacto</h4>
        <ul className="space-y-3 text-sm text-secondary-foreground/80">
          <li className="flex items-start gap-2"><Phone size={14} className="mt-1" /> +506 8968 6661</li>
          <li className="flex items-start gap-2"><MapPin size={14} className="mt-1" /> San José, Costa Rica</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-secondary-foreground/10">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-secondary-foreground/50">
        <p>© {new Date().getFullYear()} Golden Bloom. Todos los derechos reservados.</p>
        <p>Hecho con flores en Costa Rica 🌸</p>
      </div>
    </div>
  </footer>
);

export default Footer;
