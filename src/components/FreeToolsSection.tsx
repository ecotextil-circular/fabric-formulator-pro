import { ExternalLink, Palette, Scissors, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toolsHero from "@/assets/tools-hero.jpg";
import fichaHero from "@/assets/ficha-tools-hero.jpg";

interface ToolCard {
  title: string;
  emoji: string;
  description: string;
  url: string;
}

const designTools: ToolCard[] = [
  {
    title: "Canva",
    emoji: "🎨",
    description: "Crie logos, posts, catálogos, apresentações e artes profissionais de forma simples e gratuita. Ideal para designers e marcas que querem identidade visual sem complicação.",
    url: "https://www.canva.com",
  },
  {
    title: "Adobe Express",
    emoji: "✨",
    description: "Ferramentas rápidas para criar artes de impacto com templates modernos e gratuitos. Ótimo para banners, stories e materiais de marketing.",
    url: "https://www.adobe.com/express",
  },
  {
    title: "VistaCreate",
    emoji: "🌈",
    description: "Plataforma com milhares de modelos para redes sociais, branding e publicidade. Visual moderno e intuitivo para quem quer estética profissional.",
    url: "https://create.vista.com",
  },
  {
    title: "Pixlr",
    emoji: "🖌️",
    description: "Editor online semelhante ao Photoshop, totalmente gratuito. Perfeito para quem precisa ajustar imagens, recortar, editar fundo e criar artes detalhadas.",
    url: "https://pixlr.com",
  },
  {
    title: "Photopea",
    emoji: "🔧",
    description: "Ferramenta avançada que abre PSD, AI, XD e outros formatos profissionais — tudo online e grátis. Excelente para designers.",
    url: "https://www.photopea.com",
  },
  {
    title: "Fotor",
    emoji: "📸",
    description: "Criação rápida de logos, posts e materiais visuais com templates prontos. Interface simples e resultados profissionais.",
    url: "https://www.fotor.com",
  },
  {
    title: "Snappa",
    emoji: "📱",
    description: "Ótimo para criar conteúdos para redes sociais de forma rápida e prática com templates modernos e gratuitos.",
    url: "https://snappa.com",
  },
  {
    title: "Hatchful (Shopify)",
    emoji: "🪪",
    description: "Gerador gratuito de logos em poucos cliques. Ideal para quem precisa criar uma marca rapidamente com qualidade.",
    url: "https://hatchful.shopify.com",
  },
  {
    title: "Namecheap Logo Maker",
    emoji: "🔠",
    description: "Crie logos lindos e modernos com total liberdade de edição e download gratuito.",
    url: "https://www.namecheap.com/logo-maker/",
  },
  {
    title: "Looka",
    emoji: "💎",
    description: "Criação rápida de logos com inteligência artificial. Versão free limitada com resultados surpreendentes.",
    url: "https://looka.com",
  },
  {
    title: "Turbologo",
    emoji: "⚡",
    description: "Gere logos profissionais rapidamente com IA. Plano gratuito limitado com várias opções de personalização.",
    url: "https://turbologo.com",
  },
];

const fichaTecnicaTools: ToolCard[] = [
  {
    title: "Canva – Ficha Técnica",
    emoji: "📄",
    description: "Pesquise por 'ficha técnica moda' e personalize modelos gratuitos. Fácil, rápido e com visual profissional.",
    url: "https://www.canva.com",
  },
  {
    title: "Pretline",
    emoji: "🧷",
    description: "Templates simples e diretos para criar fichas técnicas de moda online. Ótimo para organizar materiais e processos.",
    url: "https://pretline.com",
  },
  {
    title: "DesignerTools",
    emoji: "🔍",
    description: "Modelos gratuitos de ficha técnica em Google Docs e Excel. Funciona bem para quem quer algo prático para preencher.",
    url: "https://www.designertools.io",
  },
  {
    title: "Techpacker",
    emoji: "📝",
    description: "Ferramenta profissional usada por grandes marcas para criar fichas técnicas completas e packs de produção. Plano básico limitado.",
    url: "https://techpacker.com",
  },
];

const ToolCardItem = ({ tool }: { tool: ToolCard }) => (
  <Card className="glass-card group hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{tool.emoji}</span>
        <CardTitle className="text-base font-semibold font-sans">{tool.title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-1 gap-4">
      <CardDescription className="text-sm leading-relaxed flex-1">
        {tool.description}
      </CardDescription>
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        asChild
      >
        <a href={tool.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
          Acessar Site
        </a>
      </Button>
    </CardContent>
  </Card>
);

const TabBanner = ({ image, alt, label, title, description, icon: Icon }: {
  image: string; alt: string; label: string; title: string; description: string; icon: React.ElementType;
}) => (
  <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
    <img src={image} alt={alt} className="w-full h-48 md:h-64 object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent flex items-center">
      <div className="px-8 md:px-12 max-w-xl">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-accent" />
          <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">{label}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">{title}</h3>
        <p className="text-primary-foreground/90 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const FreeToolsSection = () => {
  return (
    <section id="ferramentas" className="py-16 px-4 section-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Dicas de Ferramentas Gratuitas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Os melhores sites e aplicativos gratuitos para criar artes, logos, materiais visuais e fichas técnicas de moda.
          </p>
        </div>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="design" className="gap-2">
              <Palette className="w-4 h-4" />
              Artes & Logos
            </TabsTrigger>
            <TabsTrigger value="ficha" className="gap-2">
              <Scissors className="w-4 h-4" />
              Ficha Técnica
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design">
            <TabBanner
              image={toolsHero}
              alt="Ferramentas criativas para artes e logos"
              label="100% Gratuitas"
              title="Artes & Identidade Visual"
              description="Crie logos, posts, banners e materiais visuais profissionais com ferramentas gratuitas e intuitivas."
              icon={Sparkles}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {designTools.map((tool) => (
                <ToolCardItem key={tool.title} tool={tool} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ficha">
            <TabBanner
              image={fichaHero}
              alt="Ferramentas para fichas técnicas de moda"
              label="Moda & Produção"
              title="Fichas Técnicas de Moda"
              description="Ferramentas gratuitas para criar fichas técnicas profissionais, packs de produção e especificações de peças."
              icon={Scissors}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fichaTecnicaTools.map((tool) => (
                <ToolCardItem key={tool.title} tool={tool} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FreeToolsSection;
