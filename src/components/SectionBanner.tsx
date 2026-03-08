import bannerFicha from "@/assets/banner-ficha.jpg";
import bannerPdca from "@/assets/banner-pdca.jpg";
import bannerKanban from "@/assets/banner-kanban.jpg";
import bannerCalculadora from "@/assets/banner-calculadora.jpg";
import bannerDashboard from "@/assets/banner-dashboard.jpg";
import bannerGuias from "@/assets/banner-guias.jpg";
import bannerMindmap from "@/assets/banner-mindmap.jpg";
import bannerPlano from "@/assets/banner-plano.jpg";
import bannerColecao from "@/assets/banner-colecao.jpg";
import bannerChecklist from "@/assets/banner-checklist.jpg";
import bannerConquistas from "@/assets/banner-conquistas.jpg";

interface SectionBannerProps {
  image: string;
  title: string;
  subtitle: string;
  emoji: string;
}

const SectionBanner = ({ image, title, subtitle, emoji }: SectionBannerProps) => (
  <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg">
    <img src={image} alt={title} className="w-full h-44 md:h-56 object-cover" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-transparent flex items-center">
      <div className="px-6 md:px-10 max-w-lg">
        <span className="text-2xl md:text-3xl mb-1 block">{emoji}</span>
        <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1 font-display">{title}</h3>
        <p className="text-primary-foreground/85 text-xs md:text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

export const SECTION_BANNERS = {
  ficha: { image: bannerFicha, title: "Ficha Técnica", subtitle: "Crie fichas técnicas profissionais para suas peças de moda sustentável.", emoji: "📐" },
  pdca: { image: bannerPdca, title: "Ciclo PDCA", subtitle: "Planeje, execute, verifique e aja para melhorar continuamente seus processos.", emoji: "🔄" },
  kanban: { image: bannerKanban, title: "Quadro Kanban", subtitle: "Organize suas tarefas de forma visual e acompanhe o progresso em tempo real.", emoji: "📋" },
  calculadora: { image: bannerCalculadora, title: "Calculadora de Resíduos", subtitle: "Calcule o desperdício têxtil e descubra quanto pode economizar.", emoji: "🧮" },
  dashboard: { image: bannerDashboard, title: "Dashboard", subtitle: "Visualize indicadores de sustentabilidade e acompanhe suas métricas.", emoji: "📊" },
  guias: { image: bannerGuias, title: "Guias Educativos", subtitle: "Aprenda sobre economia circular e práticas sustentáveis na indústria têxtil.", emoji: "📚" },
  mindmap: { image: bannerMindmap, title: "Mapa Mental", subtitle: "Visualize conceitos e conexões para planejar estratégias circulares.", emoji: "🧠" },
  plano: { image: bannerPlano, title: "Plano de Ação", subtitle: "Defina responsáveis, prazos e prioridades para suas ações sustentáveis.", emoji: "🎯" },
  colecao: { image: bannerColecao, title: "Coleção Sustentável", subtitle: "Crie coleções de moda circular com paletas de cores e materiais eco.", emoji: "👗" },
  checklist: { image: bannerChecklist, title: "Checklist", subtitle: "Verifique se sua empresa está aplicando práticas de economia circular.", emoji: "✅" },
  conquistas: { image: bannerConquistas, title: "Conquistas", subtitle: "Acompanhe suas conquistas e celebre cada passo rumo à sustentabilidade.", emoji: "🏆" },
};

export default SectionBanner;
