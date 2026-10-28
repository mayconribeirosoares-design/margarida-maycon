export type GiftCategory = "Casa & cozinha" | "Quarto & banho" | "Eletros & rotina" | "Casa & organização" | "Mesa & servir" | "Cotas";

export type GiftCatalogItem = {
  slug: string;
  title: string;
  category: GiftCategory;
  description: string;
};

export const giftCatalog: GiftCatalogItem[] = [
  { slug: "maquina-de-lavar-roupa", title: "Máquina de lavar roupa bivolt ou 220V", category: "Eletros & rotina", description: "Para cuidar da rotina da nossa casa nova." },
  { slug: "lava-loucas", title: "Lava-louças bivolt ou 220V", category: "Eletros & rotina", description: "Mais praticidade para os nossos dias." },
  { slug: "microondas-de-embutir", title: "Micro-ondas de embutir bivolt ou 220V", category: "Eletros & rotina", description: "Um apoio especial para a cozinha." },
  { slug: "forno-eletrico-de-embutir", title: "Forno elétrico de embutir bivolt ou 220V", category: "Eletros & rotina", description: "Para preparar receitas e receber a família." },
  { slug: "purificador-depurador-coifa", title: "Purificador, depurador ou coifa de ar bivolt ou 220V", category: "Eletros & rotina", description: "Para deixar a cozinha mais confortável." },
  { slug: "batedeira", title: "Batedeira bivolt ou 220V", category: "Eletros & rotina", description: "Para preparar receitas com carinho." },
  { slug: "purificador-de-agua-electrolux", title: "Purificador de água Electrolux bivolt ou 220V", category: "Eletros & rotina", description: "Água fresca para a nossa casa." },
  { slug: "ferro-eletrico", title: "Ferro elétrico bivolt ou 220V", category: "Eletros & rotina", description: "Um item útil para a nossa rotina." },
  { slug: "liquidificador", title: "Liquidificador bivolt ou 220V", category: "Eletros & rotina", description: "Para sucos, receitas e momentos em família." },
  { slug: "ar-condicionado", title: "Ar-condicionado bivolt ou 220V", category: "Eletros & rotina", description: "Conforto para o nosso lar." },
  { slug: "mesa-e-cadeiras-6-lugares", title: "Jogo de mesa e cadeiras para 6 lugares", category: "Mesa & servir", description: "Para reunir quem amamos ao redor da mesa." },
  { slug: "tabua-e-faca-carnes", title: "Tábua grande de madeira e faca para cortar carnes", category: "Casa & cozinha", description: "Para os almoços e encontros em casa." },
  { slug: "faqueiro-inox", title: "Jogo de faqueiro inox", category: "Mesa & servir", description: "Talheres para compor a nossa mesa." },
  { slug: "panela-pressao-pequena-inducao", title: "Panela de pressão pequena para fogão de indução", category: "Casa & cozinha", description: "Praticidade para as receitas do dia a dia." },
  { slug: "panela-pressao-grande-inducao", title: "Panela de pressão grande para fogão de indução", category: "Casa & cozinha", description: "Para cozinhar e receber a família." },
  { slug: "jogo-panelas-antiaderente-inducao", title: "Jogo de panelas antiaderente para fogão de indução", category: "Casa & cozinha", description: "A base da cozinha do nosso novo lar." },
  { slug: "frigideira-grande-tampa-inducao", title: "Frigideira grande com tampa para fogão de indução", category: "Casa & cozinha", description: "Para preparar refeições especiais." },
  { slug: "frigideira-pequena-inducao", title: "Frigideira pequena para fogão de indução", category: "Casa & cozinha", description: "Um item versátil para a nossa cozinha." },
  { slug: "caneco-ceramico-inducao", title: "Caneco de alumínio com revestimento cerâmico ou antiaderente para indução", category: "Casa & cozinha", description: "Para cafés, molhos e preparos do dia a dia." },
  { slug: "panela-pudim-inducao", title: "Panela de pudim (banho-maria) para fogão de indução", category: "Casa & cozinha", description: "Para adoçar os nossos encontros." },
  { slug: "cuscuzeira-inducao", title: "Cuscuzeira para fogão de indução", category: "Casa & cozinha", description: "Para as manhãs e receitas da nossa casa." },
  { slug: "kit-tabua-frios", title: "Kit de tábuas para frios", category: "Mesa & servir", description: "Para receber com charme e carinho." },
  { slug: "kit-marinex-branca", title: "Kit de Marinex média e grande branca", category: "Casa & cozinha", description: "Para preparar e servir nossas receitas." },
  { slug: "travessa-marinex-com-tampa", title: "Travessa de Marinex média e grande com tampa", category: "Casa & cozinha", description: "Para levar as receitas à mesa." },
  { slug: "boleira-e-sobremesa-inox", title: "Boleira de vidro pendente e jogo de sobremesa inox", category: "Mesa & servir", description: "Para celebrar cada doce momento." },
  { slug: "aparelho-jantar-cha", title: "Jogo de pratos e xícaras com pires", category: "Mesa & servir", description: "Aparelho de jantar e chá para a nossa casa." },
  { slug: "kit-tapetes-banheiro-cozinha", title: "Kit de tapetes para banheiro e cozinha", category: "Quarto & banho", description: "Conforto e cuidado em cada cantinho." },
  { slug: "tacas-sobremesa-travessa", title: "Jogo de taças de sobremesa de vidro com travessa", category: "Mesa & servir", description: "Para servir sobremesas nos nossos encontros." },
  { slug: "copos-grandes-e-tacas-vinho", title: "Jogo de copos grandes e jogo de taças de vinho", category: "Mesa & servir", description: "Para brindar os novos capítulos." },
  { slug: "panos-prato-utensilios-silicone", title: "Panos de prato e conjunto de utensílios de silicone com cabo de madeira", category: "Casa & cozinha", description: "Kit com espátula, pegador, pincel, colheres e outros utensílios." },
  { slug: "toalhas-rosto-banho-casal", title: "Jogo de toalhas de rosto e banho para o casal", category: "Quarto & banho", description: "Conforto para os nossos momentos de descanso." },
  { slug: "roupao-masculino-feminino", title: "Roupão masculino e feminino", category: "Quarto & banho", description: "Para deixar a rotina ainda mais aconchegante." },
  { slug: "jogos-lencol-queen", title: "Dois jogos de lençol casal Queen", category: "Quarto & banho", description: "Para compor o nosso quarto novo." },
  { slug: "cobre-leito-queen", title: "Cobre-leito casal Queen", category: "Quarto & banho", description: "Para vestir a nossa cama com carinho." },
  { slug: "edredom-queen", title: "Edredom casal Queen", category: "Quarto & banho", description: "Aconchego para as noites de descanso." },
  { slug: "potes-vidro-porta-mantimentos", title: "Jogo de potes de vidro com tampa inox ou bambu", category: "Casa & organização", description: "Para organizar os mantimentos da nossa cozinha." },
  { slug: "kit-vasilhas-tupperware", title: "Kit ou jogo de vasilhas Tupperware", category: "Casa & organização", description: "Praticidade para guardar e organizar." },
  { slug: "tapete-sala", title: "Tapete para a sala", category: "Casa & organização", description: "Para deixar nosso lar mais acolhedor." },
  { slug: "jogo-facas-cortes", title: "Jogo de facas para cortes", category: "Casa & cozinha", description: "Kit com facas pequenas e grande para a cozinha." },
  { slug: "vale-pix", title: "Presente em dinheiro ou vale Pix", category: "Cotas", description: "O que Deus preparar será recebido com muito carinho." },
];
