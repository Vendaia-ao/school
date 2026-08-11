# ARQUITETURA FUNCIONAL DA VENDAIA SCHOOL®

> **Versão:** 1.0  
> **Status:** Documento Oficial de Arquitetura  
> **Ecossistema:** Vendaia School® Platform

---

## 1. Conceitos Fundamentais

### 1.1 Arquitetura do Sistema
A arquitetura é a estrutura macro da plataforma/projeto. Ela responde à pergunta: **"Como a Plataforma/Projeto está organizada?"**

```
Plataforma / Projeto Vendaia School®
├── Website Institucional  -> instituicao.com
├── Vendaia School          -> app.vendaiaschool.com
└── Vendaia OS             -> admin.vendaiaschool.com
```

### 1.2 Aplicação
Uma aplicação é cada um dos contextos da arquitetura que trata de um objetivo específico dentro da Plataforma/Projeto:
1. **Website Institucional** (`instituicao.com`): Portal público e institucional da instituição de ensino.
2. **Vendaia School** (`app.vendaiaschool.com`): Aplicação operacional da comunidade escolar (Alunos, Encarregados, Professores, Gestão Académica, Financeira e Administrativa).
3. **Vendaia OS** (`admin.vendaiaschool.com`): Painel de administração macro do ecossistema SaaS, licenciamento, suprimento e suporte às instituições.

### 1.3 Módulo
Um módulo é uma área funcional da aplicação que responde à pergunta: **"Que problema este conjunto de funcionalidades resolve?"**
- Ex: *Gestão Académica, Gestão Financeira, Biblioteca Digital, Recursos Humanos, Comunicação, etc.*

### 1.4 Funcionalidade & Vocabulário (Casos de Uso)
- **`Gerir...`**: CRUD ou administração de uma entidade.
- **`Emitir...`**: Geração de documentos oficiais (certificados, declarações, diplomas, cartões).
- **`Gerar...`**: Produção de relatórios, análises ou pautas.
- **`Configurar...`**: Alteração de parâmetros operacionais do sistema.

---

## 2. Aplicação 1 — Website Institucional (`instituicao.com`)

### Estrutura Resumida
- **Home**
- **A Instituição**: Apresentação, Estatutos, Factos e Números, História, Informação Oficial, Organização, I&D, Localização
- **Departamentos**: Engenharia Civil, Engenharia Electrotécnica, etc.
- **Serviços**: Biblioteca, Serviços Académicos, Notícias
- **Estudar Aqui**: Oferta Formativa, Formas de Ingresso
- **Alunos**: Alunos da Instituição, Calendário Escolar, Horários, Mapa de Exames
- **Contactos & Secretaria Online**

> *Nota: As funcionalidades de gestão deste módulo são executadas através da Aplicação 2 (Vendaia School - CMS).*

---

## 3. Aplicação 2 — Vendaia School (`app.vendaiaschool.com`)

### Módulo 1 — Dashboards
- **Tela 1 — Dashboard**: Indicadores operacionais em tempo real, KPIs pedagógicos, financeiros e de assiduidade.

### Módulo 2 — Gestão Académica
- **Tela 1 — Estudantes**: Inscrição, Matrícula, Renovação/Reconfirmação, Suspensão, Cancelamento, Histórico Escolar, Documentos, Certificados, Credenciais automáticas (Estudante/Encarregado), Cartão do Estudante (1ª e 2ª via).
- **Tela 2 — Turmas**: Criação de turmas, distribuição automática conforme regras/capacidade/período, disciplinas, horários, calendário, avaliações, pautas.
- **Tela 3 — Professores**: Cadastro, atribuição de turmas/disciplinas, horários, carga letiva, avaliação de desempenho, assiduidade docente.
- **Tela 4 — Configurações Académicas**: Ano letivo, níveis de ensino, classes, cursos, disciplinas, períodos, critérios de aprovação, capacidade máxima de turmas, parâmetros gerais.
- **Tela 5 — Portal do Aluno**: Alteração obrigatória de palavra-passe no 1º acesso, perfil, cartão digital, notas, assiduidade, horários, vitrine, mensagens, documentos, biblioteca digital, faturas, recibos, pagamentos online, requerimentos.
- **Tela 6 — Portal do Encarregado**: Visão multi-estudante (se tiver >2 educandos, seleção de perfil), cartão digital, notas, assiduidade, horários, vitrine, mensagens, faturas, recibos, pagamentos online, requerimentos.
- **Tela 7 — Portal do Professor**: Turmas, horários, plano de aula, assiduidade, lançamento de notas, vitrine, comunicação, materiais didáticos.

### Módulo 3 — Biblioteca Digital
- **Tela 1 — Biblioteca**: Catálogo, pesquisa, gestão do acervo, relatórios, configurações.

### Módulo 4 — Serviços Institucionais
- **Tela 1 — Gerir Serviços e Produtos**: Inscrições, matrículas, propinas, emolumentos, certificados, declarações, 2ª via de cartão, transporte escolar, atividades extracurriculares, uniformes, livros, materiais, definição de preços, regras de cobrança, serviços recorrentes/ocasionais.
- **Tela 2 — Gerir Cantina**: Produtos, categorias, menus, vendas (POS), consumos, carteira digital, caixa, stock, relatórios.

### Módulo 5 — Gestão Financeira
- **Tela 1 — Tesouraria / Facturação**: Pesquisa de estudante, emissão automática de cobranças, documentos comerciais, pagamentos totais/parciais/em atraso, liquidação de dívidas, multas/juros automáticos, histórico financeiro, impressão e envio de recibos.
- **Tela 2 — Gestão Financeira**: Receitas, despesas, caixa, contas bancárias, conciliação bancária, bolsas, descontos, relatórios financeiros, fluxo de caixa.

### Módulo 6 — Recursos Humanos
- **Tela 1 — Colaboradores**: Cadastro, contratos, funções, departamentos, avaliações, formação, documentos, salários, subsídios, horas extras, descontos, férias, faltas, processamento salarial, folhas de pagamento, relatórios.

### Módulo 7 — Gestão Documental
- **Tela 1 — Arquivo Documental**: Gestão documental, consulta, categorias, histórico.

### Módulo 8 — Comunicação Institucional
- **Tela 1 — Comunicação**: Notificações automáticas, mensagens internas direcionadas por filtros (estudantes, encarregados, professores, funcionários).
- **Tela 2 — Gestão do CMS**: Edição da aparência do website institucional e configuração do portal.

### Módulo 9 — Administração da Plataforma
- **Tela 1 — Utilizadores e Permissões**: Perfis, grupos, permissões detalhadas, auditoria e logs.
- **Tela 2 — Configurações da Instituição**: Dados institucionais, templates de documentos, idioma, segurança, backups, integrações, APIs.

---

## 4. Aplicação 3 — Vendaia OS (`admin.vendaiaschool.com`)

- **Módulo 1 — Programa de Transformação Digital**: CRM, Diagnósticos, Relatórios e Planos Estratégicos, Cronogramas de implementação.
- **Módulo 2 — Suporte**: Tickets, Chamados, Base de Conhecimento, Assistência Técnica.
- **Módulo 3 — Formação**: Sessões, Materiais, Certificações, Calendário.
- **Módulo 4 — Produto**: Gestão de Módulos, Roadmap, Releases, Funcionalidades, Atualizações.
- **Módulo 5 — Monitorização**: Saúde da plataforma, Performance (Supabase/Vercel/Cloudflare), Logs, Adoção.

---

## 5. Arquitetura Técnica & Serviços Recorrentes

### Providers & Infraestrutura
- **Base de Dados & Autenticação**: Supabase
- **Storage (Documentos, Livros, Imagens)**: Cloudflare R2
- **Monitorização & Cache**: Supabase, Cloudflare (DNS/Cache/Tráfego), Vercel

### Camadas de Serviço Reutilizáveis (Service Pattern)
*Regra Arquitetural: Nenhuma integração deve ser feita diretamente dentro dos componentes React.*

```
Componentes UI (React) 
      │
      ▼
Camadas de Serviço (Services)
 ├── AcademicService / StudentRepository
 ├── AuthService
 ├── StorageService (Cloudflare R2 + Compressão/Validação de ficheiros)
 ├── EmailService / NotificationService (OneSignal)
 └── AnalyticsService (Cloudflare + Supabase + Vercel)
      │
      ▼
Persistência & Multi-tenant (Supabase db + institution_id)
```

---

## 6. Estado Atual & Roadmap de Expansão (Módulo de Estudantes)

### Consolidated (Implementado)
- Wizard de Inscrição Completo
- Geração de Credenciais Automáticas (Tela de Sucesso)
- Geração de Cartão do Estudante (Ação em Massa e Individual)
- Upload de Documentos no Wizard

### Parcial / Em Refinamento
- Perfil do Estudante (Abas para Histórico, Financeiro, Documentos)

### Próximas Implementações Prioritárias
1. **Central de Renovação e Matrícula (Bulk/Individual)**: Interface focada na transição de ano letivo.
2. **Gestão Documental e Certificados**: Validade de documentos entregues e emissão de certificados oficiais.
3. **Histórico Escolar Analítico**: Visão completa das notas por disciplina, média global e percurso por ciclo.
4. **Fluxo de Suspensão e Cancelamento (Offboarding)**: Registo de saídas, motivos e liquidação/estorno financeiro.
5. **Quiosque de Cartão (2ª Via)**: Emissão rápida de 2ª via com lançamento automático de emolumento.
