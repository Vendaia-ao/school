import React, { useState } from 'react';
import { ActiveView } from '../types';
import { UserCheck, UserPlus, Clock, CheckCircle2, Star, Award, BookOpen } from 'lucide-react';

interface ProfessoresViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface Professor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  disciplinas: string[];
  turmasAtribuidas: string[];
  cargaHorariaSemanal: number; // e.g. 24h
  assiduidadePerc: number; // e.g. 98%
  desempenhoNota: number; // e.g. 4.8 / 5.0
  estado: 'Ativo' | 'Licença' | 'Inativo';
}

export const ProfessoresView: React.FC<ProfessoresViewProps> = ({ onSelectView, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'lista' | 'atribuicao' | 'horarios' | 'assiduidade' | 'desempenho'>('lista');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Professor | null>(null);
  const [deletingProf, setDeletingProf] = useState<Professor | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form fields
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formDisciplinas, setFormDisciplinas] = useState('');
  const [formTurmas, setFormTurmas] = useState('10A-CIEN, 11A-INF');
  const [formCarga, setFormCarga] = useState(24);

  const openCreateModal = () => {
    setEditingProf(null);
    setFormNome('');
    setFormEmail('');
    setFormTelefone('');
    setFormDisciplinas('');
    setFormTurmas('10A-CIEN, 11A-INF');
    setFormCarga(24);
    setIsModalOpen(true);
  };

  const openEditModal = (prof: Professor) => {
    setEditingProf(prof);
    setFormNome(prof.nome);
    setFormEmail(prof.email);
    setFormTelefone(prof.telefone);
    setFormDisciplinas(prof.disciplinas.join(', '));
    setFormTurmas(prof.turmasAtribuidas.join(', '));
    setFormCarga(prof.cargaHorariaSemanal);
    setIsModalOpen(true);
  };

  const handleSaveProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    const discArr = formDisciplinas.split(',').map((d) => d.trim()).filter(Boolean);
    const turmArr = formTurmas.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingProf) {
      setProfessores(
        professores.map((p) =>
          p.id === editingProf.id
            ? {
                ...p,
                nome: formNome,
                email: formEmail,
                telefone: formTelefone,
                disciplinas: discArr.length > 0 ? discArr : p.disciplinas,
                turmasAtribuidas: turmArr.length > 0 ? turmArr : p.turmasAtribuidas,
                cargaHorariaSemanal: Number(formCarga),
              }
            : p
        )
      );
      onShowToast(`Docente ${formNome} atualizado com sucesso!`);
    } else {
      const newProf: Professor = {
        id: `prof-${Date.now()}`,
        nome: formNome,
        email: formEmail,
        telefone: formTelefone,
        disciplinas: discArr.length > 0 ? discArr : ['Geral'],
        turmasAtribuidas: turmArr.length > 0 ? turmArr : ['10A-CIEN'],
        cargaHorariaSemanal: Number(formCarga),
        assiduidadePerc: 100.0,
        desempenhoNota: 5.0,
        estado: 'Ativo',
      };
      setProfessores([...professores, newProf]);
      onShowToast(`Docente ${formNome} cadastrado com sucesso!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProfConfirm = () => {
    if (!deletingProf) return;
    setProfessores(professores.filter((p) => p.id !== deletingProf.id));
    onShowToast(`Docente ${deletingProf.nome} removido do sistema.`);
    setDeletingProf(null);
  };

  const [professores, setProfessores] = useState<Professor[]>([
    {
      id: 'prof-01',
      nome: 'Domingos Henriques',
      email: 'Domingoshenriques1@ispozango.com',
      telefone: '+244 923 456 789',
      disciplinas: ['Matemática I', 'Matemática II'],
      turmasAtribuidas: ['10A-CIEN', '11A-INF', '12A-GEST'],
      cargaHorariaSemanal: 26,
      assiduidadePerc: 99.2,
      desempenhoNota: 4.9,
      estado: 'Ativo',
    },
    {
      id: 'prof-02',
      nome: 'Dra. Maria Eunice',
      email: 'eunice.maria@vendaia.edu.pt',
      telefone: '+244 912 345 678',
      disciplinas: ['Química', 'Biologia'],
      turmasAtribuidas: ['10A-CIEN', '10B-HUM'],
      cargaHorariaSemanal: 22,
      assiduidadePerc: 97.5,
      desempenhoNota: 4.8,
      estado: 'Ativo',
    },
    {
      id: 'prof-03',
      nome: 'Prof. António Costa',
      email: 'antonio.costa@vendaia.edu.pt',
      telefone: '+244 934 567 890',
      disciplinas: ['Física', 'Informática Aplicada'],
      turmasAtribuidas: ['10A-CIEN', '11A-INF'],
      cargaHorariaSemanal: 20,
      assiduidadePerc: 95.0,
      desempenhoNota: 4.6,
      estado: 'Ativo',
    },
    {
      id: 'prof-04',
      nome: 'Prof.ª Teresa Bento',
      email: 'teresa.bento@vendaia.edu.pt',
      telefone: '+244 945 678 901',
      disciplinas: ['Língua Portuguesa', 'Literatura'],
      turmasAtribuidas: ['10B-HUM', '12A-GEST'],
      cargaHorariaSemanal: 24,
      assiduidadePerc: 98.8,
      desempenhoNota: 4.9,
      estado: 'Ativo',
    },
  ]);

  const filteredProfessores = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.disciplinas.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          Gestão de Professores
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[1.75]" />
          Cadastrar Professor
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-info flex items-center justify-center">
            <UserCheck className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Total Docentes</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{professores.length} Ativos</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-success flex items-center justify-center">
            <Clock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Carga Horária Média</p>
            <p className="font-headline-sm text-lg font-bold text-primary">23 hrs/semana</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-warning flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Assiduidade Geral</p>
            <p className="font-headline-sm text-lg font-bold text-primary">97.6%</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-secondary flex items-center justify-center">
            <Star className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Avaliação Média</p>
            <p className="font-headline-sm text-lg font-bold text-primary">4.8 / 5.0</p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lista')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'lista'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">group</span>
          Lista de Professores
        </button>

        <button
          onClick={() => setActiveTab('atribuicao')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'atribuicao'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">assignment_ind</span>
          Atribuição de Turmas
        </button>

        <button
          onClick={() => setActiveTab('horarios')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'horarios'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          Horários Docentes
        </button>

        <button
          onClick={() => setActiveTab('assiduidade')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'assiduidade'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">event_available</span>
          Assiduidade
        </button>

        <button
          onClick={() => setActiveTab('desempenho')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'desempenho'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">grade</span>
          Desempenho
        </button>
      </div>

      {/* Tab 1: Lista de Professores */}
      {activeTab === 'lista' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-border-subtle">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Pesquisar docente por nome, e-mail ou disciplina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-low border border-border-subtle rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Docente</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Contacto / E-mail</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Disciplinas Lecionadas</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Turmas Atribuídas</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Carga Letiva</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Assiduidade</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Estado</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredProfessores.map((prof) => (
                  <tr key={prof.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-3 py-1.5 font-bold text-primary">{prof.nome}</td>
                    <td className="px-3 py-1.5 text-on-surface-variant text-xs">
                      <div>{prof.email}</div>
                      <div className="text-outline text-[11px]">{prof.telefone}</div>
                    </td>
                    <td className="px-3 py-1.5">
                      <div className="flex flex-wrap gap-1">
                        {prof.disciplinas.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-on-surface-variant font-bold">
                      {prof.turmasAtribuidas.join(', ')}
                    </td>
                    <td className="px-3 py-1.5 text-center font-bold text-secondary">{prof.cargaHorariaSemanal}h/sem</td>
                    <td className="px-3 py-1.5 text-center font-bold text-success">{prof.assiduidadePerc}%</td>
                    <td className="px-3 py-1.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                        {prof.estado}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-center relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === prof.id ? null : prof.id)}
                        className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-variant/50 cursor-pointer"
                        title="Opções"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>

                      {activeMenuId === prof.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                openEditModal(prof);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span> Editar Docente
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setActiveTab('atribuicao');
                                onShowToast(`Gerindo atribuição de turmas para ${prof.nome}`);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                            >
                              <span className="material-symbols-outlined text-[16px]">assignment</span> Atribuir Turmas
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeletingProf(prof);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-error"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span> Remover Docente
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Atribuição de Turmas e Disciplinas */}
      {activeTab === 'atribuicao' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-4">
          <h2 className="font-title-lg text-lg font-bold text-primary">Atribuição da Carga Letiva Ano 2026/2027</h2>
          <p className="text-xs text-on-surface-variant">
            Distribua turmas e disciplinas para garantir o cumprimento dos limites de tempos letivos por semana.
          </p>

          <div className="space-y-3">
            {professores.map((p) => (
              <div key={p.id} className="border border-border-subtle rounded-xl p-3 bg-surface-container-low/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-primary">{p.nome}</h3>
                  <p className="text-xs text-on-surface-variant">Disciplinas: {p.disciplinas.join(', ')}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg">
                    {p.cargaHorariaSemanal} Tempos Letivos
                  </span>

                  <button
                    onClick={() => onShowToast(`Atribuindo nova turma a ${p.nome}...`)}
                    className="bg-primary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90 cursor-pointer"
                  >
                    + Atribuir Turma
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Horários Docentes */}
      {activeTab === 'horarios' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <h2 className="font-title-lg text-lg font-bold text-primary">Consulta de Horário de Docentes</h2>
          <p className="text-xs text-on-surface-variant">Selecione o professor para emitir o seu mapa de tempo individual.</p>
          <div className="p-4 border border-border-subtle rounded-xl text-xs bg-surface-container-low/20">
            <span className="font-bold text-primary">Professor Selecionado: Domingos Henriques (Matemática I e II)</span>
            <p className="mt-2 text-on-surface-variant">Horário válido de Segunda a Sexta das 07:30 às 12:30.</p>
          </div>
        </div>
      )}

      {/* Tab 4: Assiduidade */}
      {activeTab === 'assiduidade' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-title-lg text-lg font-bold text-primary">Registo de Presenças e Ausências Docentes</h2>
            <button
              onClick={() => onShowToast('Lançando falta comunicada de docente...')}
              className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Registar Falta / Subscrição
            </button>
          </div>

          <div className="border border-border-subtle rounded-xl p-3 text-xs bg-surface-container-low/30">
            <p className="font-bold text-primary mb-1">Resumo de Ausências do Mês de Agosto:</p>
            <p className="text-on-surface-variant">0 Faltas Injustificadas | 2 Faltas Justificadas por Licença Médica.</p>
          </div>
        </div>
      )}

      {/* Tab 5: Desempenho */}
      {activeTab === 'desempenho' && (
        <div className="bg-surface-white border border-border-subtle rounded-b-xl p-5 shadow-sm space-y-3">
          <h2 className="font-title-lg text-lg font-bold text-primary">Avaliação de Desempenho Pedagógico</h2>
          <p className="text-xs text-on-surface-variant">
            Resultados dos questionários de satisfação dos alunos e inspeção pedagógica pela Direção.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {professores.map((p) => (
              <div key={p.id} className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-primary">{p.nome}</p>
                  <p className="text-outline">{p.disciplinas.join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-secondary">{p.desempenhoNota} / 5.0</span>
                  <p className="text-[10px] text-success font-bold">Excelente</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Cadastro / Edição Professor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-md w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
              <h3 className="font-bold text-primary text-base">
                {editingProf ? `Editar Docente: ${editingProf.nome}` : 'Cadastrar Novo Docente'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfessor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Miguel Ângelo"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">E-mail Institucional:</label>
                <input
                  type="email"
                  placeholder="miguel.angelo@vendaia.edu.pt"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Contacto Telefónico:</label>
                <input
                  type="text"
                  placeholder="+244 923 000 000"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Disciplinas (separadas por vírgula):</label>
                <input
                  type="text"
                  placeholder="Ex: Matemática, Física, Informática"
                  value={formDisciplinas}
                  onChange={(e) => setFormDisciplinas(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Turmas Atribuídas:</label>
                  <input
                    type="text"
                    placeholder="Ex: 10A-CIEN, 11A-INF"
                    value={formTurmas}
                    onChange={(e) => setFormTurmas(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Carga Horária (h/sem):</label>
                  <input
                    type="number"
                    value={formCarga}
                    onChange={(e) => setFormCarga(Number(e.target.value))}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-border-subtle rounded-lg font-bold text-on-surface-variant cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-secondary text-surface-white rounded-lg font-bold hover:bg-secondary/90 cursor-pointer transition-all"
                >
                  {editingProf ? 'Guardar Alterações' : 'Salvar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação de Docente */}
      {deletingProf && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl max-w-sm w-full p-5 space-y-4 border border-border-subtle shadow-xl">
            <h3 className="font-bold text-error text-base">Eliminar Docente</h3>
            <p className="text-xs text-on-surface-variant">
              Tem a certeza que deseja remover o docente <strong className="text-primary">{deletingProf.nome}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProf(null)}
                className="px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-bold text-on-surface-variant cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProfConfirm}
                className="px-4 py-1.5 bg-error text-surface-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer transition-all"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
