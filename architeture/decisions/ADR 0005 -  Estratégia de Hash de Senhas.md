# ADR 0002 – Estratégia de Hash de Senhas: Argon2 vs Bcrypt

## Contexto
O sistema em desenvolvimento lida com **dados sensíveis**, incluindo informações pessoais de usuários e valores financeiros (ainda que fictícios no ambiente atual).

Dentro da arquitetura adotada (**DDD + Clean Architecture**), o hash de senha é tratado como uma **preocupação técnica**, delegada a um serviço externo ao domínio, injetado no Caso de Uso.

Surge então a decisão sobre **qual algoritmo de hash de senha utilizar**, considerando segurança, maturidade do ecossistema e trade-offs de performance.

As principais opções analisadas foram:
- `bcrypt`
- `argon2`

## Decisão
Foi decidido utilizar **Argon2** como algoritmo padrão para hash de senhas, através de um serviço abstraído por uma interface (`PasswordHasher`), permitindo futura substituição sem impacto no domínio ou nos casos de uso.

## Justificativa

### Segurança
- **Argon2** é o vencedor do *Password Hashing Competition (PHC)*.
- Projetado para ser **resistente a ataques com GPU e ASIC**, comuns em cenários modernos.
- Utiliza abordagem *memory-hard*, dificultando ataques paralelos em larga escala.
- Permite controle granular sobre:
  - Uso de memória
  - Custo computacional (CPU)
  - Paralelismo

Esses fatores tornam o Argon2 mais adequado para sistemas que lidam com dados sensíveis e precisam se proteger contra ameaças atuais.

### Arquitetura
- O algoritmo de hash é encapsulado em um **serviço de aplicação** (`PasswordHasher`).
- O domínio recebe apenas o **hash resultante**, mantendo-se puro e independente de tecnologia.
- A implementação concreta (Argon2) reside na camada de infraestrutura.

### Evolutividade
- Caso seja necessário trocar o algoritmo futuramente (ex: bcrypt, scrypt ou outro), basta alterar a implementação da interface, sem impactos nos casos de uso ou no domínio.

## Alternativas Consideradas

### 1. Bcrypt
**Vantagens**
- Amplamente adotado e bem suportado.
- Simples de configurar.
- Boa resistência a ataques de força bruta tradicionais.

**Desvantagens**
- Menos eficiente contra ataques modernos com GPU.
- Não possui controle explícito de uso de memória.
- Algoritmo mais antigo em comparação ao Argon2.

**Decisão**: Rejeitado em favor de uma solução mais moderna e segura.

---

### 2. Delegar hash ao banco de dados
**Desvantagens**
- Forte acoplamento à infraestrutura.
- Dificulta testes.
- Viola princípios de Clean Architecture.

**Decisão**: Rejeitado.

---

### 3. Criar lógica de hash dentro da entidade de domínio
**Desvantagens**
- Domínio passaria a conhecer detalhes técnicos de criptografia.
- Viola o princípio de isolamento do domínio.

**Decisão**: Rejeitado.

## Consequências

### Positivas
- Maior nível de segurança contra ataques modernos.
- Arquitetura alinhada com DDD e Clean Architecture.
- Facilidade de testes (mock do `PasswordHasher`).
- Possibilidade de ajuste fino de parâmetros de segurança.

### Negativas / Trade-offs
- Maior consumo de CPU e memória em comparação ao bcrypt.
- Ecossistema ainda menor que o bcrypt, embora estável e amplamente adotado.
- Pode exigir ajustes de configuração em ambientes de alta carga.

Esses trade-offs são considerados aceitáveis diante do contexto do sistema e da prioridade em segurança.

## Status
**Aprovado**

Revisitar a decisão caso:
- O volume de usuários cresça significativamente.
- Haja restrições severas de infraestrutura.
- Novos algoritmos ou recomendações de segurança surjam.
