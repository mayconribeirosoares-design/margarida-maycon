# Revisão de acessibilidade e responsividade

## Evidências verificadas

| Critério | Verificação | Resultado |
|---|---|---|
| Abertura por teclado | O envelope é um elemento `<button>` com `aria-label` descritivo e pode receber foco nativo. | Aprovado |
| Formulário | Campos possuem labels visíveis; o botão de envio comunica estado desabilitado durante o envio. | Aprovado |
| Foco visível | Inputs definem `:focus` com borda e anel de foco; links e botões permanecem navegáveis pelo teclado. | Aprovado |
| Movimento reduzido | A animação de flores e transições são reduzidas com `prefers-reduced-motion: reduce`. | Aprovado |
| Contraste | Texto principal escuro sobre fundo claro; botões verdes usam texto claro; status têm diferenciação textual além de cor. | Aprovado |
| Mobile | Captura visual realizada em viewport 390 × 844; grids de hero, detalhes, fotos e RSVP passam para uma coluna. | Aprovado |
| Desktop | Captura visual realizada em viewport 1280 × 720; hero assimétrico e painel em sidebar foram revisados. | Aprovado |
| Estado de erro | Painel diferencia carregamento, lista vazia e falha de consulta, oferecendo nova tentativa. | Aprovado |

A revisão foi registrada como parte da validação da primeira versão funcional. Os dados finais do casamento, como endereço, fotos, paleta definitiva e textos de observações, continuam preparados para substituição pelo casal.
