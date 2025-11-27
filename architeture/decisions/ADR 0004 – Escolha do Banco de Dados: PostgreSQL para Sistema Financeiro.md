# ADR 0004 – Escolha do Banco de Dados: PostgreSQL para Sistema Financeiro

## Contexto
Estamos construindo um **sistema financeiro**, onde erros de cálculo ou saldos incorretos são inaceitáveis.  
Por isso, a prioridade absoluta é **consistência**: o dado gravado deve estar sempre correto.

Também teremos **réplicas de leitura** para aliviar carga e melhorar desempenho.  
Precisamos decidir qual banco usar, considerando consistência, simplicidade operacional e possibilidade de evolução.

## Decisão
Adotaremos **PostgreSQL** como banco principal do sistema.

### Topologia inicial
- **1 servidor primário (escrita)**
- **2 réplicas (somente leitura)**
  - **1 síncrona** — garante que a escrita só é confirmada após a réplica receber o dado.
  - **1 assíncrona** — usada para melhorar a capacidade de leitura.

### Regras operacionais
- Utilizar a replicação nativa do Postgres (baseada no WAL).
- Começar com failover manual documentado; automatizar posteriormente (ex.: Patroni).
- Utilizar tipos **numeric/decimal** ou valores em centavos para lidar com dinheiro.
- Realizar backups regulares e manter capacidade de restauração ponto-a-ponto.
- Monitorar pelo menos:
  - atraso das réplicas,
  - latência de escrita,
  - queries lentas,
  - transações por segundo.

## Motivação
- O PostgreSQL entrega **consistência forte** e transações ACID, essenciais para um sistema financeiro.
- Possui **maturidade**, ferramentas de backup, replicação e monitoramento amplamente testadas.
- Permite crescer de forma controlada:
  - réplicas para leitura,
  - particionamento para tabelas grandes,
  - sharding com extensões como Citus, caso seja necessário no futuro.
- Alinha-se com nossa decisão relacionada ao **CAP/PACELC**: priorizamos **consistência** ao invés de disponibilidade em cenários de falha de rede.

## Alternativas Consideradas
- **CockroachDB / YugabyteDB**  
  Modernos e distribuídos, mas exigem maior complexidade operacional. Deixados para futuro estudo.
- **Amazon Aurora (Postgres compatível)**  
  Boa opção gerenciada, porém mais cara e com lock-in. Adiado para decisão futura.
- **Bancos NoSQL (Cassandra, DynamoDB)**  
  Favorecem disponibilidade/latência mas sacrificam consistência.  
  **Inadequados para dados financeiros.**

## Consequências

### Positivas
- Dados financeiros consistentes e confiáveis.
- Arquitetura simples para começar, com caminhos claros de evolução.
- Comunidade grande e ferramentas maduras.

### Negativas / Trade-offs
- Em casos de partição de rede, o sistema pode ficar temporariamente indisponível.
- A réplica síncrona aumenta um pouco a latência de escrita.
- Requer disciplina operacional para monitoramento e rotina de backups.

## Status
**Aprovado.**  
Primeiro implementar em staging, validar métricas, e depois seguir para produção.
