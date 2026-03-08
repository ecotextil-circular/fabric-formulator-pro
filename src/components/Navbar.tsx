import { useState } from "react";
import { Recycle, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#ficha-tecnica", label: "Ficha Técnica" },
  { href: "#pdca", label: "PDCA" },
  { href: "#kanban", label: "Kanban" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#guias", label: "Guias" },
  { href: "#mapa-mental", label: "Mapa Mental" },
  { href: "#plano-acao", label: "Plano de Ação" },
  { href: "#colecao", label: "Coleção" },
  { href: "#checklist", label: "Checklist" },
  { href: "#conquistas", label: "Conquistas" },
  { href: "#ferramentas", label: "Ferramentas" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Recycle className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">TextilCircular</span>
        </div>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-3 text-xs font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors whitespace-nowrap">
              {link.label}
            </a>
          ))}
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-destructive ml-2">
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="xl:hidden p-2 text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1.5"
            >
              {link.label}
            </a>
          ))}
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground hover:text-destructive mt-2">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
