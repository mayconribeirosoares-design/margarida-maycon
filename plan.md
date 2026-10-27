# Plano — Convite Margarida & Maycon

## Escopo
Reaproveitar o projeto recebido em ZIP para entregar um site de convite de casamento elegante, responsivo e funcional, com abertura em envelope, apresentação do casal, data e local, contagem regressiva, RSVP, lista de presentes e área administrativa já prevista.

## Implementação
- Manter React + Vite + Express/tRPC + Drizzle já presentes no projeto fornecido.
- Reutilizar as páginas `Home`, `Gifts` e `Admin`, ajustando caminhos de assets e o visual para o convite.
- Servir o manifesto estático `public/manus-routes.json` com as rotas `/`, `/presentes` e `/admin`.
- Usar o banco gerenciado para RSVP e reservas de presentes através dos routers tRPC já existentes.
- Manter o catálogo inicial reproduzível com `pnpm db:seed`, usando inserção idempotente.
- Preservar a navegação em página única para o convite e rotas separadas para presentes e administração.

## Estrutura
- `client/src/pages/Home.tsx`: experiência principal do convite, abertura, informações, galeria e confirmação.
- `client/src/pages/Gifts.tsx`: lista e reserva de presentes.
- `client/src/pages/Admin.tsx`: visão administrativa das confirmações.
- `client/src/index.css`: identidade visual responsiva.
- `server/` e `shared/`: APIs, regras de negócio e persistência.
- `client/public/assets/`: imagens editoriais usadas no convite.

## Design

### Opções consideradas
- **Romance botânico editorial** (0,07): papel marfim, sálvia, terracota suave e serifas de convite clássico.
- **Minimalismo mediterrâneo** (0,06): areia, azul acinzentado, composição solar e tipografia arejada.
- **Jardim noturno contemporâneo** (0,05): verde profundo, cobre e contraste dramático.

### Direção escolhida: Romance botânico editorial
- **Movimento:** papelaria artesanal de casamento com fotografia editorial e botânica delicada.
- **Princípios:** intimidade, respiro, textura de papel e contraste entre serifas românticas e sans discreta.
- **Cor:** marfim cria acolhimento; sálvia comunica natureza e calma; terracota funciona como assinatura calorosa.
- **Layout:** fluxo vertical de convite impresso, com envelope inicial, arco fotográfico, divisores e blocos assimétricos.
- **Assinaturas visuais:** selo circular com monograma, arcos botânicos e pétalas em movimento após a abertura.
- **Interação:** cada ação parece uma pequena gentileza do convite; abrir, confirmar e reservar usam microfeedbacks suaves.
- **Animação:** revelação vertical curta, queda lenta de pétalas, hover com elevação mínima; respeitar `prefers-reduced-motion`.
- **Tipografia:** Playfair Display para nomes/títulos; DM Sans/Jost para labels, campos e ações.
- **Essência:** um convite digital íntimo para transformar informação em antecipação; delicado, autoral, acolhedor.
- **Voz:** calorosa e direta, sem linguagem promocional. Exemplos: “Com alegria, convidamos você” e “Sua presença é o nosso maior presente.”
- **Marca:** monograma “M & M” dentro de selo redondo, acompanhado do nome em serif itálica.
- **Cor assinatura:** sálvia `#71856d`, usada em selo, CTAs e elementos de orientação.
