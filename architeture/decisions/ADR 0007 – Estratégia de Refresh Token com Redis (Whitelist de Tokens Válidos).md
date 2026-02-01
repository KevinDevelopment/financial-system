# ADR 0007 – Estratégia de Refresh Token com Redis (Whitelist de Tokens Válidos)

## Contexto
A aplicação utiliza autenticação baseada em **JWT**, com:

- **Access Token** de curta duração  
- **Refresh Token** para renovação da sessão

Tokens refresh podem ser utilizados para gerar novos access tokens.  

Fluxos totalmente stateless sem mecanismo de revogação apresentam riscos de segurança:

- Vazamento de tokens  
- Logout explícito do usuário  
- Encerramento forçado de sessões  

Ao mesmo tempo, validar refresh token no banco a cada renovação gera **alta carga de leitura**, limitando escalabilidade.  

Surge, portanto, o trade-off entre **segurança**, **performance** e **escalabilidade**.

---

## Decisão

A estratégia adotada será **cachear tokens válidos no Redis** (“whitelist”) e manter consistência parcial no banco:

1. **Geração de refresh token**  
   - Ao criar um refresh token, ele é armazenado no **Redis** como válido, com TTL igual à expiração do token.  
   - Persistência no **banco** também ocorre, garantindo consistência e rastreabilidade.

2. **Fluxo de refresh**  
   - O token enviado pelo usuário é consultado primeiro no **Redis**:  
     - Se **presente**, é considerado válido → gera novo access token  
     - Se **ausente**, consulta ao **banco** para verificar existência e expiração:  
       - Se válido → adiciona ao Redis e continua  
       - Se revogado ou inexistente → acesso negado

3. **Logout / revogação de token**  
   - Remover o token do Redis imediatamente  
   - Marcar como revogado no banco, se necessário, para consistência

4. **Access token**  
   - Continua sendo validado apenas por assinatura e expiração, sem consultar Redis ou banco

---

## Justificativa

- **Segurança**: revogação imediata ao remover do Redis + validação no banco garante consistência  
- **Performance**: consultas rápidas ao Redis para tokens válidos  
- **Escalabilidade**: banco só é acessado quando o token não estiver no cache  
- **Arquitetura limpa**: domínio desacoplado de detalhes de infraestrutura  
- **Padrões de mercado**: estratégia combinada cache + persistência é comum em sistemas distribuídos

---

## Alternativas Consideradas

### 1. Blacklist de tokens revogados 
- Consultas ao banco podem ser necessárias para consistência  
- Reduz leitura do banco em tokens válidos, mas cada refresh ainda pode bater no banco se quisermos garantir validade histórica  

### 2. Refresh token totalmente stateless, sem revogação
- Rejeitada  
- Não permite logout efetivo nem mitigação de vazamento de token

### 3. Revogar todos os tokens do usuário no logout
- Rejeitada  
- Impede múltiplas sessões simultâneas (web + mobile)

### 4. Armazenar todos os refresh tokens ativos no banco
- Rejeitada  
- Complexidade e volume de leitura elevados

---

## Consequências

### Positivas
- Logout imediato e seguro  
- Suporte a múltiplas sessões simultâneas  
- Menor carga no banco, já que Redis serve como cache primário  
- Escalável e compatível com arquiteturas distribuídas

### Negativas / Trade-offs
- Consome mais memória no Redis (todos os tokens válidos)  
- Requer lógica de inserção e remoção no Redis  
- Dependência do Redis  
- Access tokens permanecem válidos até expiração

---

## Status
**Aprovado**  
Revisitar caso novos requisitos de segurança ou volume alterem os trade-offs.
