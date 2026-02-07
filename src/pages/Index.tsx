import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FichaTecnicaForm from "@/components/FichaTecnicaForm";
import ChecklistSection from "@/components/ChecklistSection";
import { Recycle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FichaTecnicaForm />
        <ChecklistSection />
      </main>
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Recycle className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">TextilCircular</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Economia circular na indústria têxtil — Reduzir, reutilizar, inovar.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
