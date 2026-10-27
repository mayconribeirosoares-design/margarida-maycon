# Revisão da abertura do convite

A foto principal foi substituída pelo ativo `casal-vestido-branco_5a954d15.png`, correspondente à imagem enviada pelo casal com Margarida usando vestido branco e Maycon ao lado.

A tela inicial apresenta um envelope em camadas, monograma **M & M**, buquê rosado e a instrução “Toque no buquê para abrir”. O acionamento é feito por um elemento nativo `<button>`, portanto pode ser ativado por toque, clique ou teclado. Após o acionamento, o buquê se desloca e desaparece, a aba do envelope gira e a tela revela o convite com a foto principal.

A validação visual foi realizada no estado fechado em desktop e mobile e no estado aberto em desktop. A página aberta mantém o cronômetro, as pétalas rosadas, o RSVP, o calendário, as rotas e a Área dos Noivos. Em `prefers-reduced-motion: reduce`, as animações não essenciais são desativadas e as pétalas são ocultadas, mantendo o conteúdo e a ação de abertura disponíveis.
