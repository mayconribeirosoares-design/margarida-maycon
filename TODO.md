# TODO — Convite Margarida & Maycon

- [x] **Importar a base fornecida e preservar o conteúdo do convite**
  - Reutilizar o projeto enviado em ZIP, mantendo as páginas e a lógica existentes para o convite, presentes e administração.
  - Preservar a identidade visual, os textos do casal, a data de 19 de dezembro de 2026, o local Recanto Colonial em Guanambi/BA e os contatos configurados.

- [x] **Entregar a experiência principal do convite responsiva**
  - A página inicial deve apresentar abertura em envelope, casal, data, horário, local, contagem regressiva, galeria e navegação clara.
  - O layout deve funcionar em celulares e desktops, com boa legibilidade e suporte a redução de movimento.

- [x] **Disponibilizar confirmação de presença (RSVP)**
  - O convidado deve informar nome, escolher “Sim, vou!” ou “Não poderei ir”, opcionalmente informar WhatsApp/mensagem e registrar a resposta.
  - O convite deve oferecer, sem obrigatoriedade, aviso aos noivos por WhatsApp.

- [x] **Disponibilizar lista de presentes**
  - A rota `/presentes` deve listar os itens por categoria e permitir reservar um item com nome e WhatsApp opcional.
  - Um presente reservado deve deixar de aparecer como disponível para os próximos convidados.

- [x] **Manter a área administrativa**
  - A rota `/admin` deve permanecer acessível pelo código existente e exibir as confirmações e estatísticas suportadas pela aplicação.

- [x] **Preparar visualização e publicação Manus**
  - Servir `manus-routes.json` com `/`, `/presentes` e `/admin`.
  - Executar verificações TypeScript/build e iniciar o servidor na porta configurada para Preview.

- [ ] **Configurar acesso privado dos noivos no ambiente Manus**
  - Definir `COUPLE_SECOND_EMAIL`, `COUPLE_ACCESS_PIN` e `JWT_SECRET` como secrets do ambiente, sem versioná-los no código.
  - Depois dessa configuração, o login direto por e-mail/PIN e a sessão protegida da área `/admin` estarão prontos para uso.
