import heroBg from "@/assets/hero-bg.jpg";
import { Scissors, Recycle, FileText } from "lucide-react";

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("ficha-tecnica")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Tecidos sustentáveis"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6 opacity-0 animate-fade-in">
          <Recycle className="w-8 h-8 text-accent" />
          <Scissors className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 opacity-0 animate-fade-in font-display" style={{ animationDelay: "0.2s" }}>
          Ficha Técnica Têxtil
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 font-body opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Monte fichas técnicas completas para suas peças com economia circular e sustentabilidade
        </p>
        <button
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:brightness-105 transition-all opacity-0 animate-slide-up shadow-lg"
          style={{ animationDelay: "0.6s" }}
        >
          <FileText className="w-5 h-5" />
          Criar Ficha Técnica
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
