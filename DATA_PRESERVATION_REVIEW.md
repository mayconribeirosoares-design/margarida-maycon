# Revisão de preservação das confirmações

A tabela `rsvps` recebeu a coluna anulável `archivedAt` por meio da migração `0002_nifty_eddie_brock.sql`, aplicada ao banco do projeto. A operação que antes removia uma linha passou a atualizar `archivedAt`, preservando o registro; a restauração volta esse campo para `NULL`. A listagem pública do painel consulta apenas registros ativos, enquanto o histórico consulta registros arquivados.

O Portal dos Noivos possui ações separadas para arquivar, restaurar e exportar o histórico. A exportação histórica usa um nome de arquivo próprio e a mesma codificação CSV compatível com planilhas.

Os testes unitários cobrem as procedures protegidas, o ciclo de arquivamento/restauração no contrato do router e a geração/download do CSV histórico. Como a suíte Vitest não deve alterar o banco de produção, a persistência de baixo nível é exercitada por mocks controlados; a execução real da migração foi verificada separadamente pelo executor SQL do projeto. Recomenda-se manter também cópias CSV periódicas fora do projeto.
