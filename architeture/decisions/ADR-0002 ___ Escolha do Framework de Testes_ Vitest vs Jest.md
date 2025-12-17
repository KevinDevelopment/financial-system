# ADR 0002 – Escolha do Framework de Testes: Vitest vs Jest

## Contexto
O projeto utiliza **Node.js com TypeScript** e exige uma suíte de testes rápida, moderna e fácil de manter.  
As opções consideradas foram **Jest** e **Vitest**, ambos populares no ecossistema JavaScript.  
O objetivo é selecionar o framework que ofereça melhor performance, compatibilidade com TypeScript e simplicidade de configuração.

## Decisão
O framework escolhido para testes é o **Vitest**.

## Justificativa
- **Performance muito superior**  
  O Vitest é baseado no Vite/esbuild, o que garante inicialização e execução extremamente rápidas, gerando feedback imediato durante o desenvolvimento.

- **Suporte nativo a TypeScript e ESM**  
  Diferente do Jest, o Vitest não requer transpilers extras como Babel ou ts-jest.  
  Isso reduz configuração e acelera o ambiente de testes.

- **DX (Developer Experience) moderna**  
  Modo watch eficiente, mensagens claras, mocks nativos, snapshot testing e integração suave com ferramentas modernas.

- **Menos configuração, mais produtividade**  
  O setup é simples e direto.  
  O Jest exige mais ajustes para funcionar bem com ESM, TypeScript e módulos modernos.

- **Compatível com o ecossistema atual**  
  Mesmo o projeto não usando Vite, o Vitest é alinhado às ferramentas modernas, garantindo longevidade e fácil integração futura.

## Alternativas Consideradas

### 1. Jest (rejeitado)
- Mais lento para iniciar e executar testes.
- Integração com TypeScript é mais trabalhosa.
- Comunidade ainda grande, mas evolução do projeto mais lenta.
- Bom para projetos legados, porém menos alinhado a stacks modernas.

### 2. Mocha (rejeitado)
- Mocha **é para JavaScript/Node.js**, não Java.  
- Rejeitado porque:
  - Precisa de muitas configurações extras (assertions, mocks, coverage).
  - Não oferece funcionalidades integradas como mocks e snapshots.
  - Menos produtivo em comparação ao Vitest.

## Consequências

### Positivas
- Testes muito mais rápidos.
- Menos configuração e menos dependências.
- Excelente suporte ao TypeScript.
- Experiência de desenvolvimento mais fluida.

### Negativas / Trade-offs
- Ecosistema um pouco mais novo que Jest (mas já estável).
- Alguns exemplos de libs ainda usam Jest, exigindo pequenas adaptações.

## Status
**Aprovado**
