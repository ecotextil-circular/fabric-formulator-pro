import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FichaTecnicaForm from "@/components/FichaTecnicaForm";
import PDCASection from "@/components/PDCASection";
import KanbanSection from "@/components/KanbanSection";
import WasteCalculator from "@/components/WasteCalculator";
import DashboardSection from "@/components/DashboardSection";
import GuidesSection from "@/components/GuidesSection";
import ActionPlanSection from "@/components/ActionPlanSection";
import SustainableCollectionSection from "@/components/SustainableCollectionSection";
import ChecklistSection from "@/components/ChecklistSection";
import AchievementsSection from "@/components/AchievementsSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Recycle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <ScrollReveal>
          <FichaTecnicaForm />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <PDCASection />
        </ScrollReveal>
        <ScrollReveal>
          <KanbanSection />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <WasteCalculator />
        </ScrollReveal>
        <ScrollReveal>
          <DashboardSection />
        </ScrollReveal>
        <ScrollReveal direction="left">
          <GuidesSection />
        </ScrollReveal>
        <ScrollReveal>
          <ActionPlanSection />
        </ScrollReveal>
        <ScrollReveal direction="right">
          <SustainableCollectionSection />
        </ScrollReveal>
        <ScrollReveal>
          <ChecklistSection />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <AchievementsSection />
        </ScrollReveal>
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
