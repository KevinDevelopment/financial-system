# ADR 0001 – Estratégia de Validações Externas e Múltiplas Consultas ao Banco

## Contexto
Ao criar uma Organização, é necessário garantir que o nome, o CNPJ e o endereço não estejam previamente cadastrados.  
Essas verificações dependem de consultas ao banco de dados.

Dentro da arquitetura adotada (DDD + Clean Architecture), as validações internas devem ficar na Entidade ou em Value Objects, enquanto validações externas (dependentes de infraestrutura) devem ficar no Caso de Uso.

Isso levanta a discussão: **validar múltiplas duplicidades significa fazer várias consultas ao banco. Esse trade-off é aceitável?**

## Decisão
O Caso de Uso fará **consultas independentes ao repositório**, chamando métodos como:

- `existsByName(name)`
- `existsByCNPJ(cnpj)`

Cada método executará uma query simples para verificar duplicidade.  
Após todas as validações, o Caso de Uso chamará `create()` no repositório.

## Justificativa
- **Alinha-se ao DDD e Clean Architecture**:  
  Entidades continuam puras e sem dependência do banco; o caso de uso orquestra regras externas.
- **Clareza e coesão**:  
  Cada método faz exatamente uma coisa.
- **Baixo custo operacional**:  
  Consultas de existência (`SELECT 1 ... LIMIT 1`) são rápidas e de impacto mínimo.
- **Testabilidade**:  
  Fica simples isolar e testar cada verificação.
- **Evolutividade**:  
  Permite otimizações futuras sem acoplar o domínio à infraestrutura.

## Alternativas Consideradas

### 1. Criar um "Validator Service" especializado
Rejeitado.  
Introduziria uma camada extra e desnecessária, duplicando responsabilidades.

### 2. Colocar todas as validações dentro da entidade
Rejeitado.  
Entidades não devem dependender de acesso a banco.

### 3. Executar uma única query agregada (ex: `checkConflicts`)
Aceitável como otimização futura, mas não necessária agora.  
Consultas separadas seguem princípios de clareza e clean code.

## Consequências

### Positivas
- Arquitetura consistente com DDD e Clean Architecture.
- Código mais simples, isolado e testável.
- Permite evoluções e otimizações posteriores.

### Negativas / Trade-offs
- Maior número de consultas ao banco (trade-off aceito).
- Pode exigir otimização futura em cenários de alto volume.

## Status
**Aprovado**  
Revisitar caso problemas reais de performance sejam identificados.


