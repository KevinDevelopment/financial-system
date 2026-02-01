# ADR 0007 – Estratégia de Refresh Token Stateless com Revogação via Redis (Blacklist)

## Contexto
A aplicação utiliza autenticação baseada em **JWT**, com:
- **Access Token** de curta duração
- **Refresh Token** para renovação da sessão

O refresh token pode ser utilizado a cada ~15 minutos para gerar um novo access token.  
Validar o refresh token no banco de dados a cada renovação implicaria em **alta carga de leitura**, tornando a solução inviável em cenários de escala.

Por outro lado, um refresh token totalmente stateless, sem mecanismo de revogação, gera riscos de segurança em casos como:
- Vazamento de token
- Logout explícito do usuário
- Encerramento forçado de sessões

Surge então o trade-off entre **segurança**, **performance** e **escalabilidade**.

## Decisão
A estratégia adotada será:

- **Refresh tokens serão JWT stateless**
- **Não haverá consulta ao banco durante o fluxo de refresh**
- Tokens **revogados** serão registrados em uma **blacklist no Redis**
- No logout:
  - O refresh token recebido será marcado como revogado no Redis
  - Será aplicado um **TTL** igual ao tempo restante de validade do token
- No fluxo de refresh:
  - O sistema verificará se o token consta na blacklist do Redis
  - Se estiver, o acesso será negado
  - Caso contrário, um novo access token será gerado
- O **access token** continuará sendo validado apenas por assinatura e expiração

## Justificativa
- **Performance e escalabilidade**:  
  Evita consultas frequentes ao banco a cada renovação de token.
- **Segurança balanceada**:  
  Permite invalidação imediata de sessões sem comprometer o fluxo stateless.
- **Custo reduzido**:  
  Redis é mais barato e adequado para leituras rápidas e dados temporários.
- **Arquitetura limpa**:  
  O domínio permanece desacoplado de detalhes de infraestrutura.
- **Aderência a padrões de mercado**:  
  Estratégia amplamente adotada em sistemas distribuídos e APIs de alta escala.

## Alternativas Consideradas

### 1. Validar refresh token no banco a cada uso
Rejeitada.  
Causa alto custo operacional e limita a escalabilidade do sistema.

### 2. Refresh token totalmente stateless, sem revogação
Rejeitada.  
Não permite logout efetivo nem mitigação de vazamento de token.

### 3. Revogar todos os tokens do usuário no logout
Rejeitada.  
Impediria múltiplas sessões simultâneas (ex: web + mobile), requisito funcional do sistema.

### 4. Armazenar todos os refresh tokens ativos no banco
Rejeitada.  
Introduz complexidade desnecessária e alto volume de leitura.

## Consequências

### Positivas
- Redução significativa de carga no banco
- Logout efetivo e imediato
- Suporte a múltiplas sessões simultâneas
- Arquitetura preparada para escalar

### Negativas / Trade-offs
- Dependência de Redis
- Access tokens permanecem válidos até a expiração
- Complexidade ligeiramente maior na infraestrutura

## Status
**Aprovado**  
Revisitar caso novos requisitos de segurança ou volume alterem os trade-offs.
