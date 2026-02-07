import { Card } from "@/components/ui/card";
import { Sparkles, Palette, Scissors, Leaf, ShoppingBag, Lightbulb, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Lightbulb,
    title: "1. Pesquise Tendências Sustentáveis",
    description: "Estude tendências de moda consciente: tecidos orgânicos, tingimento natural, zero waste design. Defina o conceito da coleção alinhado à sustentabilidade.",
  },
  {
    icon: Palette,
    title: "2. Escolha a Paleta de Cores",
    description: "Opte por cores que usem tingimentos naturais ou de baixo impacto. Paletas terrosas, tons pastel e cores naturais reduzem o uso de químicos.",
  },
  {
    icon: Leaf,
    title: "3. Selecione Materiais Sustentáveis",
    description: "Priorize: algodão orgânico, linho, cânhamo, Tencel/Lyocell, poliéster reciclado (PET), viscose ecológica. Verifique certificações (GOTS, OEKO-TEX).",
  },
  {
    icon: Scissors,
    title: "4. Modelagem Zero Waste",
    description: "Utilize técnicas de modelagem que maximizem o aproveitamento do tecido. Encaixes de moldes otimizados podem reduzir o desperdício de corte em até 15%.",
  },
  {
    icon: ShoppingBag,
    title: "5. Produção Consciente",
    description: "Produza em pequenas tiragens para evitar excedentes. Use embalagens biodegradáveis ou recicláveis. Documente o processo para transparência com o consumidor.",
  },
  {
    icon: Sparkles,
    title: "6. Comunique sua História",
    description: "Conte a história da coleção: de onde veio o material, quem fez, qual o impacto positivo. Etiquetas com QR code podem dar acesso à rastreabilidade completa.",
  },
];

const PIECES_IDEAS = [
  { name: "Bolsa de Retalhos", material: "Retalhos variados", difficulty: "Fácil" },
  { name: "Scrunchie Eco", material: "Sobras de tecido", difficulty: "Fácil" },
  { name: "Patchwork Almofada", material: "Retalhos de algodão", difficulty: "Médio" },
  { name: "Tiara Artesanal", material: "Tiras de tecido", difficulty: "Fácil" },
  { name: "Ecobag Estampada", material: "Tecido reciclado", difficulty: "Fácil" },
  { name: "Kimono Upcycled", material: "Camisas reutilizadas", difficulty: "Médio" },
  { name: "Saia Patchwork", material: "Retalhos jeans", difficulty: "Avançado" },
  { name: "Porta-copos Têxtil", material: "Sobras de malha", difficulty: "Fácil" },
];

const SustainableCollectionSection = () => {
  return (
    <section id="colecao" className="py-16 px-4 section-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Criação Sustentável
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Como Criar uma Coleção Sustentável
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Passo a passo para desenvolver uma coleção de moda com princípios de economia circular.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card key={i} className="glass-card p-5 rounded-xl hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold font-display text-foreground text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Pieces Ideas */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold font-display text-foreground mb-2">
            Peças que Você Pode Criar
          </h3>
          <p className="text-muted-foreground text-sm">
            Ideias de peças e acessórios sustentáveis usando retalhos e materiais reaproveitados.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PIECES_IDEAS.map((piece, i) => (
            <Card key={i} className="glass-card p-4 rounded-xl hover:shadow-md transition-all text-center">
              <h5 className="font-semibold text-foreground text-sm mb-1">{piece.name}</h5>
              <p className="text-xs text-muted-foreground mb-2">{piece.material}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                piece.difficulty === "Fácil" ? "bg-olive/10 text-olive" :
                piece.difficulty === "Médio" ? "bg-accent/30 text-foreground" :
                "bg-primary/10 text-primary"
              }`}>
                {piece.difficulty}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainableCollectionSection;
