# ADR 0003 – Escolha do ORM do Projeto (Prisma)

## Contexto
O projeto precisa de um ORM confiável, maduro e bem documentado, que facilite manutenção a longo prazo e forneça migrations consistentes.  
As opções avaliadas foram **Prisma** e **Drizzle ORM**.  
O **TypeORM** não será considerado devido à sua menor evolução e risco de estagnação.

Precisamos escolher um ORM que:
- seja estável por muitos anos,
- tenha comunidade forte,
- ofereça migrations sólidas,
- facilite desenvolvimento,
- reduza riscos técnicos futuros.

## Decisão
Escolher o **Prisma** como ORM principal do projeto.

## Justificativa
- **Maturidade e estabilidade**: amplamente usado em produção, mantido ativamente e com roadmap claro.
- **Excelente documentação**: reduz curva de aprendizado e acelera desenvolvimento.
- **Migrations confiáveis**: robustas e fáceis de versionar.
- **Comunidade grande**: mais exemplos, tutoriais e suporte.
- **Baixo risco de obsolescência**: Prisma está em crescimento e não apresenta sinais de abandono.
- O projeto **não exige um nível extremo de micro-otimização** de consultas agora; portanto, o benefício da maturidade pesa mais que o controle total de SQL.

## Alternativas Consideradas

### 1. Drizzle ORM
**Prós:**  
- Joins mais fáceis e expressividade próxima ao SQL.  
- Queries geralmente mais otimizadas.  

**Contras:**  
- Menos maduro e menos testado em cenários grandes.  
- Documentação menos completa.  
- Comunidade menor e API em evolução mais rápida (mais risco).  

### 2. TypeORM
Rejeitado.  
- Evolução reduzida e desenvolvimento lento.  
- Risco real de precisar trocar o ORM no futuro, trazendo grande impacto técnico.  

## Consequências

### Positivas
- Tecnologia estável, madura e consistente.  
- Menor risco de problemas de manutenção ou abandono.  
- Migrations eficientes e previsíveis.  
- Maior facilidade de adoção por outros desenvolvedores.  
- Desenvolvimento mais rápido com DX (Developer Experience) excelente.

### Negativas / Trade-offs
- Menos controle fino sobre SQL.  
- Joins podem exigir mais esforço.  
- Algumas queries podem não ser tão otimizadas quanto no Drizzle.

## Status
**Aprovado**  
Revisitar apenas se o projeto exigir forte otimização de consultas no futuro.
