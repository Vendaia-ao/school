export type PermissionLevel = 'full' | 'read' | 'none';

export interface PermissionScreen {
  id: string;
  label: string;
  tabs: string[];
}

export interface PermissionModule {
  id: string;
  label: string;
  screens: PermissionScreen[];
}

export const PERMISSIONS_CATALOG: PermissionModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    screens: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        tabs: [],
      },
    ],
  },
  {
    id: 'academica',
    label: 'Gestão Académica',
    screens: [
      {
        id: 'estudantes',
        label: 'Estudantes',
        tabs: [],
      },
      {
        id: 'turmas',
        label: 'Turmas',
        tabs: [
          'Lista de Turmas',
          'Regras de Distribuição',
          'Horários Escolares',
          'Pautas & Avaliações',
          'Calendário Escolar',
        ],
      },
      {
        id: 'professores',
        label: 'Professores',
        tabs: [
          'Lista de Professores',
          'Atribuição de Turmas & Disciplinas',
          'Horários Docentes',
          'Assiduidade dos Docentes',
          'Avaliação de Desempenho',
        ],
      },
      {
        id: 'config_academicas',
        label: 'Configurações Académicas',
        tabs: [
          'Ano Letivo & Períodos',
          'Níveis de Ensino & Classes',
          'Cursos & Disciplinas',
          'Critérios de Aprovação',
        ],
      },
      {
        id: 'aluno_portal',
        label: 'Portal do Aluno',
        tabs: [
          'Notas & Avaliações',
          'Cartão Digital',
          'Assiduidade',
          'Horários & Calendário',
          'Faturas & Pagamentos',
          'Documentos & Certificados',
          'Requerimentos',
          'Vitrine / Anúncios',
        ],
      },
      {
        id: 'encarregado_portal',
        label: 'Portal do Encarregado',
        tabs: [
          'Notas & Aproveitamento',
          'Assiduidade & Faltas',
          'Pagamento de Propinas',
          'Contacto Direção & Professores',
        ],
      },
      {
        id: 'professor_portal',
        label: 'Portal do Professor',
        tabs: [
          'Lançamento de Notas',
          'Registo de Assiduidade',
          'Planos de Aula',
          'Materiais Didáticos',
          'Comunicação Família/Alunos',
        ],
      },
    ],
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca Digital',
    screens: [
      {
        id: 'biblioteca',
        label: 'Biblioteca',
        tabs: [],
      },
    ],
  },
  {
    id: 'servicos',
    label: 'Serviços Institucionais',
    screens: [
      {
        id: 'servicos_produtos',
        label: 'Gerir Serviços e Produtos',
        tabs: [
          'Catálogo de Serviços & Produtos',
          'Regras de Cobrança, Multas & Prazos',
          'Políticas de Descontos & Bolsas de Estudo',
        ],
      },
      {
        id: 'cantina',
        label: 'Gerir Cantina',
        tabs: [
          '1. Ponto de Venda (POS & Consumos)',
          '2. Ementa & Menus Semanais',
          '3. Catálogo & Stock',
          '4. Carteira Digital dos Alunos',
          '5. Caixa & Relatórios',
        ],
      },
    ],
  },
  {
    id: 'financeira',
    label: 'Gestão Financeira',
    screens: [
      {
        id: 'gestao_financeira',
        label: 'Gestão Financeira',
        tabs: [
          'Fluxo de Caixa',
          'Receitas',
          'Despesas',
          'Caixa',
          'Bancos',
          'Conciliação Bancária',
          'Bolsas',
          'Descontos',
          'Relatórios Financeiros',
        ],
      },
    ],
  },
  {
    id: 'rh',
    label: 'Recursos Humanos',
    screens: [
      {
        id: 'rh_colaboradores',
        label: 'Colaboradores',
        tabs: [
          'Colaboradores',
          'Contratos',
          'Departamentos',
          'Avaliações',
          'Formação',
          'Documentos',
          'Salários & Vencimentos',
          'Férias & Faltas',
          'Relatórios RH',
        ],
      },
    ],
  },
  {
    id: 'documental',
    label: 'Gestão Documental',
    screens: [
      {
        id: 'gestao_documental',
        label: 'Arquivo Documental',
        tabs: [
          'Arquivo Documental',
          'Categorias',
          'Consulta',
          'Histórico',
        ],
      },
    ],
  },
  {
    id: 'comunicacao',
    label: 'Comunicação Institucional',
    screens: [
      {
        id: 'comunicacao',
        label: 'Comunicação',
        tabs: [
          'Histórico de Envio',
          'Nova Mensagem',
          'Modelos (Templates)',
          'Canais & Integrações',
        ],
      },
      {
        id: 'cms',
        label: 'CMS (Website)',
        tabs: [
          'Páginas do Site',
          'Notícias & Conteúdo',
          'Aparência do Website',
          'Configurar Portal',
        ],
      },
    ],
  },
  {
    id: 'admin',
    label: 'Administração da Plataforma',
    screens: [
      {
        id: 'utilizadores_permissoes',
        label: 'Utilizadores e Permissões',
        tabs: [
          'Criar Utilizador',
          'Editar Utilizador',
          'Ativar / Desativar',
          'Gerir Dados Pessoais',
          'Alterar Palavra-passe',
          'Criar Grupo',
          'Editar Grupo',
          'Ativar / Desativar Grupo',
          'Permissões',
          'Auditoria',
          'Logs',
        ],
      },
      {
        id: 'config_instituicao',
        label: 'Configurações da Instituição',
        tabs: [
          'Dados Institucionais',
          'Templates de Documentos',
          'Idioma',
          'Segurança',
          'Backups',
          'Integrações',
          'APIs',
          'Configurações Gerais',
        ],
      },
    ],
  },
];

export const ALL_MODULE_IDS = PERMISSIONS_CATALOG.map((m) => m.id);
