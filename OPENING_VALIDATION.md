# Validação da abertura do convite

A abertura atual permanece implementada em `client/src/pages/Home.tsx` no botão `.envelope-button`. O acionamento primário ocorre por clique e toque, pois o botão usa o evento `onClick`; em dispositivos de toque, o navegador traduz o toque em ativação de botão sem exigir WhatsApp, login ou outro passo adicional.

A ativação por teclado ocorre no mesmo botão por `onKeyDown`, usando `isEnvelopeActivationKey`. Após o refinamento do lacre, o fluxo foi revalidado com Enter e Espaço; ambos mantêm a abertura do mesmo botão sem depender do clique no buquê. A suíte em `server/invitation.test.ts` verifica explicitamente `Enter`, espaço (`" "`) e `Spacebar`, além de rejeitar `Escape`. O navegador também mantém o comportamento nativo de foco e ativação do elemento semântico `button`.

A validação visual foi feita no estado aberto pela rota `/#opened`, que inicializa `isEnvelopeOpen` como verdadeiro. O estado aberto foi revisado em **390×844** e **1280×720** após a substituição do buquê e das pétalas. A página mostrou a foto principal, o monograma editorial, o contador e o início das seções do convite sem sobreposição indevida. As pétalas agora são elementos `.petal` com formas CSS assimétricas, gradientes e nervura translúcida, em vez de caracteres Unicode.

A preferência `prefers-reduced-motion` continua respeitada: o campo de pétalas é ocultado nessa condição e as transições do buquê são desativadas quando aplicável. Após o reinício do servidor, o log mais recente confirmou o carregamento normal do servidor e não repetiu a falha antiga de importação de `deleteRsvp`; a implementação vigente usa `archiveRsvp`.
