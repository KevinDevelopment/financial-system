# ADR 0006 – Armazenamento de Refresh Tokens no Banco de Dados

## Contexto

O sistema utiliza **JWT** para autenticação, com separação clara entre:

- **Access Token** (curta duração — ex.: ~15 minutos)
- **Refresh Token** (longa duração — ex.: dias ou semanas)

Os **access tokens** são **stateless** e não são persistidos no backend.  
Essa abordagem reduz carga no servidor e simplifica o fluxo de autenticação.

Entretanto, o uso de **refresh tokens totalmente stateless** (sem persistência)
apresenta limitações relevantes do ponto de vista de segurança e controle:

- Impossibilidade de **revogar sessões** ativamente
- Logout apenas “local” (client-side)
- Maior impacto em caso de **vazamento de token**
- Ausência de controle por dispositivo ou sessão
- Dificuldade em atender requisitos de segurança e compliance

Diante disso, precisamos decidir se os **refresh tokens** devem permanecer
totalmente stateless ou ser **persistidos no banco de dados**.

---

## Decisão

Adotaremos a estratégia de **armazenar refresh tokens no banco de dados**.

### Estratégia adotada

- **Access Token**
  - Curta duração (ex.: ~15 minutos)
  - Stateless
  - Não persistido no banco
- **Refresh Token**
  - Longa duração
  - Persistido no banco de dados
  - Associado a:
    - usuário
    - organização
    - dispositivo ou sessão
    - data de expiração

### Regras operacionais

- Cada refresh token possui, no mínimo:
  - `id`
  - `user_id`
  - `organization_id`
  - `expires_at`
  - `revoked_at` (opcional)
- Refresh tokens **expirados ou revogados** são rejeitados.
- Implementar **rotação obrigatória de refresh token**:
  - Ao utilizar um refresh token, ele é invalidado.
  - Um novo refresh token é emitido e persistido.
- Logout revoga ou remove o refresh token associado à sessão.
- Tokens expirados são removidos periodicamente (job/cron).

---

## Motivação

A decisão prioriza **segurança, controle de sessão e auditabilidade**,
sem comprometer a experiência do usuário.

### Benefícios principais

- **Revogação imediata de sessões**
  - Logout real
  - Bloqueio de tokens comprometidos
- **Redução do impacto de vazamento**
  - Refresh tokens podem ser invalidados
- **Controle por dispositivo ou sessão**
  - Encerramento seletivo de sessões
- **Rotação segura**
  - Minimiza reutilização de tokens roubados
- **Alinhamento com sistemas corporativos e financeiros**

Essa abordagem é amplamente adotada por **bancos, SaaS corporativos
e plataformas financeiras**.

---

## Alternativas Consideradas

### Refresh Token totalmente stateless

**Vantagens**
- Backend totalmente stateless
- Nenhum armazenamento adicional

**Desvantagens**
- Não permite logout real
- Não permite revogação
- Maior impacto em caso de vazamento
- Pouco controle de sessões
- Fraco alinhamento com requisitos de segurança

**Decisão:** rejeitada.

---

### Sessão tradicional baseada em cookies

**Vantagens**
- Modelo simples e conhecido

**Desvantagens**
- Menor compatibilidade com APIs e mobile
- Escalabilidade mais complexa
- Menos flexível para múltiplos clientes

**Decisão:** rejeitada.

---

## Consequências

### Positivas

- Maior segurança geral do sistema
- Controle explícito de sessões
- Logout e revogação confiáveis
- Boa experiência do usuário com access tokens curtos

### Negativas / Trade-offs

- Perda do **stateless puro**
- Necessidade de:
  - consulta ao banco no fluxo de refresh
  - armazenamento adicional
  - rotina de limpeza
- Crescimento da tabela de refresh tokens ao longo do tempo

Esses custos são considerados **aceitáveis e controláveis**
diante dos ganhos de segurança.

---

## Considerações Operacionais

- O crescimento da tabela é limitado pelo número de sessões ativas.
- Tokens expirados são removidos periodicamente.
- O custo de armazenamento é baixo.
- A verificação ocorre apenas no fluxo de refresh, não em todas as requisições.

---

## Alinhamento Arquitetural

Esta decisão:

- Está alinhada com o princípio **PACELC**:
  - priorizamos **consistência e segurança** no fluxo de autenticação.
- Complementa o uso de access tokens de curta duração.
- Mantém o **domínio isolado** de detalhes de autenticação,
  tratados exclusivamente na camada de aplicação.

---

## Status

**Aprovado.**

Implementar inicialmente com:
- access token de curta duração
- refresh token persistido
- rotação obrigatória
- limpeza automática

Reavaliar após métricas de uso e auditorias de segurança.
