import { Recycle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Recycle className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">TextilCircular</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#ficha-tecnica" className="hover:text-primary transition-colors">Ficha Técnica</a>
          <a href="#checklist" className="hover:text-primary transition-colors">Checklist</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
