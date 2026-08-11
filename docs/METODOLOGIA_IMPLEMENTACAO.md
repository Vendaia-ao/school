# METODOLOGIA OFICIAL DE IMPLEMENTAÇÃO DO VENDAIA SCHOOL®

> **Versão:** 1.0  
> **Status:** Norma Obrigatória de Desenvolvimento  
> **Escopo:** Front-End, UX/UI, Arquitetura de Módulos e Fluxos da Plataforma Vendaia School®

---

## 1. Diretrizes Principais

1. **Fase Atual**: Construção e Validação do FRONT-END (UI/UX, Navegação, Formulários e Fluxos Completos).
2. **Backend/Persistência**: Dados mockados em camada de serviço (`Service Pattern`). Sem conexão direta ao Supabase ou banco de dados real nesta fase.
3. **Multi-AI / Controle de Versão**:
   - NÃO fazer reset do projeto.
   - NÃO fazer force push no Git.
   - NÃO apagar nem substituir funcionalidades existentes sem verificação prévia.
   - Preservar alterações efetuadas por outras ferramentas/desenvolvedores.
4. **Referências Visuais Oficiais**:
   - **Arquitetura Geral de Páginas (3 Bandas)**: `StudentsView.tsx` (Gestão de Estudantes)
   - **Navegação em Abas (Pill Tabs & Hover)**: `StudentProfileView.tsx` (Perfil do Estudante)
   - **Cards de Indicadores (KPIs sem container de fundo no ícone)**: `TurmasView.tsx` (Gestão de Turmas)

---

## 2. Sequência de Execução por Módulo (5 Fases)

Sempre que a instrução `"Vamos avançar com o módulo X"` for acionada, a execução respeitará estritamente as seguintes fases:

```
┌────────────────────────────────────────────────────────┐
│ FASE 1 — ANÁLISE DO MÓDULO                             │
│ Identificar objetivos, utilizadores, entidades e mapa  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ FASE 2 — MODELAÇÃO DOS CASOS DE USO                    │
│ Descrever atores, pré-condições, fluxos e validações   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ FASE 3 — VARREDURA DO FRONT-END EXISTENTE              │
│ Comparar Casos de Uso VS Código Atual (Sem alterar)    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ FASE 4 — PLANO DE IMPLEMENTAÇÃO                        │
│ Mapear Gaps, Ordem Lógica, Telas e Componentes        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ FASE 5 — IMPLEMENTAÇÃO INCREMENTAL & TESTES            │
│ Executar plano, preservar código, validar build        │
└────────────────────────────────────────────────────────┘
```

---

### FASE 1 — Análise do Módulo
- Mapeamento completo: objetivo, utilizadores/perfis, entidades, casos de uso, operações principais, telas, subtelas, formulários, tabelas, filtros, pesquisas, ações, estados, permissões e dependências entre módulos.
- *Entregável*: Mapa Funcional Completo do Módulo.

### FASE 2 — Casos de Uso
- Detalhamento de cada funcionalidade:
  - Ator responsável
  - Pré-condições & Tela de Entrada
  - Dados necessários & Validações
  - Estados de Sucesso, Erro, Vazio, Cancelamento, Edição e Exclusão/Inativação
  - Próxima etapa do fluxo
- *Entregável*: Especificação Detalhada dos Casos de Uso.

### FASE 3 — Varredura do Front-end Existente
- Auditoria do código existente (`Caso de Uso Necessário` vs `Implementação Atual`).
- Identificação de funcionalidades completas, incompletas, telas inexistentes, fluxos quebrados, problemas visuais ou de responsividade.
- *Regra*: **NENHUM CÓDIGO É ALTERADO NESTA FASE**.

### FASE 4 — Plano de Implementação
- Organização do plano por: `MÓDULO -> TELA -> SUBTELA -> COMPONENTE -> FUNCIONALIDADE -> FLUXO`.
- Definição da ordem lógica de prioridade de desenvolvimento.
- *Regra*: **Apresentar o plano e aguardar validação antes de codificar**.

### FASE 5 — Implementação Incremental & Validação
- Desenvolvimento por incrementos (Tela por Tela / Fluxo por Fluxo).
- Preservação da lógica existente e garantia de compatibilidade de build (`npm run build`).
- Manutenção da separação de camadas: `Componente Visual -> Camada de Serviço -> Dados Mockados`.

---

## 3. Critérios de Conclusão de Módulo

Um módulo só é considerado **CONCLUÍDO** quando:
- Todos os casos de uso principais estiverem cobertos e operacionais no Front-End.
- Telas, subtelas e navegação funcionarem sem quebras de fluxo.
- Formulários possuírem validações, estados de carregamento (loading), vazio e erro.
- Permissões por perfil forem respeitadas.
- Dados mockados representarem adequadamente os cenários reais.
- A interface for 100% consistente com os padrões visuais de referência.
- O build (`npm run build`) for executado com **0 erros**.
