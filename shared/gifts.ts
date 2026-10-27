export type GiftCategory = "Casa & cozinha" | "Quarto & banho" | "Eletros & rotina" | "Casa & organização" | "Experiências" | "Cotas";

export type GiftCatalogItem = {
  slug: string;
  title: string;
  category: GiftCategory;
  description: string;
};

export const giftCatalog: GiftCatalogItem[] = [
  { slug: "jogo-de-panelas", title: "Jogo de panelas", category: "Casa & cozinha", description: "Para preparar as primeiras receitas da nossa casa." },
  { slug: "frigideira-antiaderente", title: "Frigideira antiaderente", category: "Casa & cozinha", description: "Um apoio especial para a cozinha do dia a dia." },
  { slug: "assadeira-conjunto", title: "Conjunto de assadeiras", category: "Casa & cozinha", description: "Para os almoços e encontros em família." },
  { slug: "jogo-de-facas", title: "Jogo de facas", category: "Casa & cozinha", description: "Peças essenciais para a nossa cozinha." },
  { slug: "jogo-de-talheres", title: "Jogo de talheres", category: "Casa & cozinha", description: "Para compor a mesa com carinho." },
  { slug: "jogo-de-jantar", title: "Jogo de jantar", category: "Casa & cozinha", description: "Para receber a família ao redor da mesa." },
  { slug: "jogo-de-copos", title: "Jogo de copos", category: "Casa & cozinha", description: "Para os dias comuns e as celebrações." },
  { slug: "jogo-de-tacas", title: "Jogo de taças", category: "Casa & cozinha", description: "Para brindar cada novo capítulo." },
  { slug: "cafeteira", title: "Cafeteira", category: "Casa & cozinha", description: "Para começar as manhãs juntos." },
  { slug: "liquidificador", title: "Liquidificador", category: "Casa & cozinha", description: "Um presente útil para a nossa rotina." },
  { slug: "air-fryer", title: "Air fryer", category: "Casa & cozinha", description: "Praticidade para a cozinha de casa nova." },
  { slug: "sanduicheira", title: "Sanduicheira", category: "Casa & cozinha", description: "Para lanches rápidos nos dias corridos." },
  { slug: "torradeira", title: "Torradeira", category: "Casa & cozinha", description: "Para deixar os cafés da manhã mais gostosos." },
  { slug: "micro-ondas", title: "Micro-ondas", category: "Eletros & rotina", description: "Praticidade para a nossa cozinha." },
  { slug: "forno-eletrico", title: "Forno elétrico", category: "Eletros & rotina", description: "Para preparar receitas e receber a família." },
  { slug: "panela-eletrica", title: "Panela elétrica", category: "Eletros & rotina", description: "Uma ajuda especial para a rotina da casa." },
  { slug: "ferro-de-passar", title: "Ferro de passar", category: "Eletros & rotina", description: "Para cuidar das nossas roupas com praticidade." },
  { slug: "aspirador-de-po", title: "Aspirador de pó", category: "Eletros & rotina", description: "Para manter o nosso lar sempre acolhedor." },
  { slug: "jogo-de-cama", title: "Jogo de cama", category: "Quarto & banho", description: "Peças em algodão para o nosso novo lar." },
  { slug: "edredom", title: "Edredom", category: "Quarto & banho", description: "Para deixar o quarto ainda mais aconchegante." },
  { slug: "kit-toalhas", title: "Kit de toalhas de banho", category: "Quarto & banho", description: "Um carinho útil para os dias de casa nova." },
  { slug: "tapete-casal", title: "Tapete para quarto", category: "Quarto & banho", description: "Para trazer calor e conforto ao nosso cantinho." },
  { slug: "kit-travesseiros", title: "Kit de travesseiros", category: "Quarto & banho", description: "Para noites tranquilas e confortáveis." },
  { slug: "protetor-de-colchao", title: "Protetor de colchão", category: "Quarto & banho", description: "Um cuidado especial para o nosso quarto." },
  { slug: "roupoes-de-banho", title: "Roupões de banho", category: "Quarto & banho", description: "Conforto para os momentos de descanso." },
  { slug: "jogo-de-panelas-premium", title: "Jogo de panelas premium", category: "Casa & cozinha", description: "Uma opção especial para quem quiser contribuir com a casa." },
  { slug: "kit-organizadores", title: "Kit de organizadores", category: "Casa & organização", description: "Para deixar cada cantinho da casa no seu lugar." },
  { slug: "kit-de-cabides", title: "Kit de cabides", category: "Casa & organização", description: "Para organizar o nosso novo armário." },
  { slug: "lixeira-com-pedal", title: "Lixeira com pedal", category: "Casa & organização", description: "Um item útil para a cozinha e os banheiros." },
  { slug: "varal-de-chao", title: "Varal de chão", category: "Casa & organização", description: "Para facilitar a rotina da nossa casa." },
  { slug: "cota-lua-de-mel", title: "Cota para a lua de mel", category: "Cotas", description: "Uma lembrança que seguirá com a gente na viagem." },
  { slug: "cota-montar-casa", title: "Cota para montar a casa", category: "Cotas", description: "Ajuda para escolher algo especial para o nosso lar." },
  { slug: "jantar-romantico", title: "Experiência de jantar", category: "Experiências", description: "Um momento a dois para guardar na memória." },
  { slug: "passeio-lua-de-mel", title: "Experiência para a lua de mel", category: "Experiências", description: "Uma aventura ou passeio para a nossa viagem." },
];
