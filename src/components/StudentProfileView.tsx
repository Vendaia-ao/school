import React, { useState } from 'react';
import {
  Student,
  AcademicGrade,
  FinancialTransaction,
  AbsenceRecord,
  DocumentItem,
  TimelineEvent,
} from '../types';

interface StudentProfileViewProps {
  student: Student;
  grades: AcademicGrade[];
  financials: FinancialTransaction[];
  absences: AbsenceRecord[];
  documents: DocumentItem[];
  timelineEvents: TimelineEvent[];
  onBack: () => void;
  onEditStudent: (student: Student) => void;
  onShowToast: (msg: string) => void;
  onAddTimelineEvent: (event: Partial<TimelineEvent>) => void;
  onUpdateDocumentStatus: (docId: string, status: 'VALIDADO' | 'PENDENTE' | 'EXPIRADO') => void;
  onPayFinancial: (finId: string) => void;
  onJustifyAbsence: (absId: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  grades,
  financials,
  absences,
  documents,
  timelineEvents,
  onBack,
  onEditStudent,
  onShowToast,
  onAddTimelineEvent,
  onUpdateDocumentStatus,
  onPayFinancial,
  onJustifyAbsence,
}) => {
  const [activeTab, setActiveTab] = useState<'pessoais' | 'academico' | 'financeiro' | 'assiduidade' | 'documentos'>('pessoais');
  const [activeDocMenuId, setActiveDocMenuId] = useState<string | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [timelineSearch, setTimelineSearch] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState('');

  // Modal states within profile
  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade | null>(null);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [newDocType, setNewDocType] = useState('Certificado de Habilitações');

  const filteredTimeline = timelineEvents.filter((e) => {
    if (e.studentId && e.studentId !== student.id && e.studentId !== 'EST-2024-089') {
      // Show events matching student or default student
    }
    if (timelineFilter !== 'all' && e.categoria !== timelineFilter) return false;
    if (timelineSearch.trim()) {
      const q = timelineSearch.toLowerCase();
      return e.titulo.toLowerCase().includes(q) || e.descricao.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddTimelineEvent({
      studentId: student.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateCategory: 'Hoje',
      categoria: 'administrative',
      categoriaLabel: 'Administrativo',
      badgeBg: 'bg-surface-container-high',
      badgeText: 'text-on-surface-variant',
      icon: 'note_add',
      iconColor: 'text-outline',
      titulo: 'Nota Administrativa',
      descricao: newNoteText,
      autorName: 'Secretaria - Sara Silva',
      autorType: 'secretary',
    });

    setNewNoteText('');
    onShowToast('Nota registada na timeline do estudante.');
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-4">
      {/* Back Button & Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-secondary transition-colors cursor-pointer bg-surface-white border border-border-subtle px-3 py-1.5 rounded-lg shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Voltar à Lista de Estudantes
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors bg-surface-white border border-border-subtle px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Imprimir Ficha
          </button>
          <button
            onClick={() => onEditStudent(student)}
            className="flex items-center gap-1.5 text-xs font-semibold text-surface-white bg-primary hover:bg-opacity-90 transition-colors px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Editar Perfil
          </button>
          <button
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-1.5 rounded-lg shadow-sm cursor-pointer border ${
              isTimelineOpen
                ? 'bg-secondary text-surface-white border-secondary'
                : 'bg-surface-white text-on-surface-variant border-border-subtle hover:text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            {isTimelineOpen ? 'Ocultar Timeline' : 'Ver Timeline'}
          </button>
        </div>
      </div>

      {/* Student Banner Header */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.photoUrl}
                alt={student.nomeCompleto}
                className="w-20 h-20 rounded-full object-cover border-2 border-surface-white shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-success border-2 border-surface-white rounded-full"></span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-primary">{student.nomeCompleto}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> {student.estadoMatricula}
                </span>
                <span className="text-xs font-bold text-outline bg-surface-container-low px-2 py-0.5 rounded">
                  Nº {student.matricula}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">school</span>
                  {student.classe} - {student.turma} ({student.curso})
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
                  {student.emailEstudante}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">call</span>
                  {student.contactoEstudante}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Advisor & Average */}
          <div className="flex items-center gap-6 bg-surface-container-low/70 px-4 py-2.5 rounded-lg border border-border-subtle shrink-0">
            <div>
              <p className="text-[10px] text-outline uppercase font-bold tracking-wider">Tutor Académico</p>
              <p className="text-xs font-bold text-primary mt-0.5">{student.tutorAcademico}</p>
            </div>
            <div className="h-8 w-px bg-border-subtle"></div>
            <div>
              <p className="text-[10px] text-outline uppercase font-bold tracking-wider">Média Geral (GPA)</p>
              <p className="text-lg font-bold text-secondary mt-0.5">{student.mediaGeral} / 20</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Content (Tabs & Views) */}
        <div className={`${isTimelineOpen ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-4 transition-all duration-300`}>
          {/* Navigation Tabs Bar */}
          <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pessoais')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'pessoais'
                  ? 'bg-primary text-surface-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('academico')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'academico'
                  ? 'bg-primary text-surface-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              Histórico Académico
            </button>
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'financeiro'
                  ? 'bg-primary text-surface-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              Financeiro
            </button>
            <button
              onClick={() => setActiveTab('assiduidade')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'assiduidade'
                  ? 'bg-primary text-surface-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Assiduidade
            </button>
            <button
              onClick={() => setActiveTab('documentos')}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'documentos'
                  ? 'bg-primary text-surface-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">folder</span>
              Documentos
            </button>
          </div>

          {/* TAB 1: Dados Pessoais */}
          {activeTab === 'pessoais' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Informação Pessoal */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3">
                  <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">badge</span>
                    Informação Pessoal
                  </h3>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="text-secondary text-xs font-semibold hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Nome Completo:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.nomeCompleto}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Nome Social:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.nomeSocial || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Data de Nascimento:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.dataNascimento}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Nacionalidade:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.nacionalidade}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">NIF:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.nif}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Cartão de Cidadão:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.cartaoCidadao}</span>
                  </div>
                </div>
              </div>

              {/* Card Encarregado de Educação */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3">
                  <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">family_restroom</span>
                    Encarregado de Educação
                  </h3>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="text-secondary text-xs font-semibold hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Nome:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.encarregadoNome}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Parentesco:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.encarregadoParentesco}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Contacto Telefónico:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.encarregadoTelefone}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-outline font-medium">Email:</span>
                    <span className="col-span-2 font-semibold text-on-surface">{student.encarregadoEmail}</span>
                  </div>
                </div>
              </div>

              {/* Card Morada de Residência */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm md:col-span-2">
                <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3">
                  <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">home</span>
                    Morada de Residência
                  </h3>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="text-secondary text-xs font-semibold hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-outline font-medium">Endereço:</span>
                      <span className="col-span-2 font-semibold text-on-surface">{student.morada.endereco}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-outline font-medium">Código Postal:</span>
                      <span className="col-span-2 font-semibold text-on-surface">{student.morada.codigoPostal}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-outline font-medium">Localidade:</span>
                      <span className="col-span-2 font-semibold text-on-surface">{student.morada.localidade}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-outline font-medium">Concelho / Distrito:</span>
                      <span className="col-span-2 font-semibold text-on-surface">{student.morada.concelhoDistrito}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Histórico Académico */}
          {activeTab === 'academico' && (
            <div className="flex flex-col gap-4">
              {/* Academic KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Média Global (GPA)</p>
                    <p className="text-2xl font-bold text-primary mt-1">{student.mediaGeral} / 20</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[24px]">grade</span>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Créditos Obtidos</p>
                    <p className="text-2xl font-bold text-primary mt-1">{student.creditosECTS || 120} ECTS</p>
                  </div>
                  <span className="material-symbols-outlined text-info text-[24px]">workspace_premium</span>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Assiduidade</p>
                    <p className="text-2xl font-bold text-success mt-1">{student.taxaAssiduidade || 94}%</p>
                  </div>
                  <span className="material-symbols-outlined text-success text-[24px]">event_available</span>
                </div>
              </div>

              {/* Grades Table */}
              <div className="bg-surface-white border border-border-subtle rounded-xl overflow-hidden shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
                    Registo de Avaliações
                  </h3>
                  <span className="text-xs text-outline font-medium">Ano Letivo 23/24</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface border-b border-border-subtle font-semibold text-outline uppercase">
                        <th className="px-3 py-1.5">Disciplina</th>
                        <th className="px-3 py-1.5">Docente</th>
                        <th className="px-3 py-1.5 text-center">1º Período</th>
                        <th className="px-3 py-1.5 text-center">Nota Final</th>
                        <th className="px-3 py-1.5 text-center">Estado</th>
                        <th className="px-3 py-1.5 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {grades.map((g) => (
                        <tr key={g.id} className="hover:bg-surface-container transition-colors">
                          <td className="px-3 py-1.5 font-bold text-primary flex items-center gap-2">
                            <span className="material-symbols-outlined text-outline text-[18px]">{g.iconName}</span>
                            {g.disciplina}
                          </td>
                          <td className="px-3 py-1.5 text-on-surface-variant">{g.professor}</td>
                          <td className="px-3 py-1.5 text-center font-semibold">{g.nota1Per} Val.</td>
                          <td className="px-3 py-1.5 text-center font-bold text-primary text-sm">{g.notaFinal} Val.</td>
                          <td className="px-3 py-1.5 text-center">
                            {g.estado === 'Aprovado' ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                                Aprovado
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Condicional
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <button
                              onClick={() => setSelectedGrade(g)}
                              className="text-secondary font-semibold hover:underline"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Financeiro */}
          {activeTab === 'financeiro' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Saldo Atual</p>
                  <p className="text-2xl font-bold text-success mt-1">€ 0,00</p>
                  <p className="text-[10px] text-outline mt-1">Sem débitos em atraso</p>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Próximo Pagamento</p>
                  <p className="text-2xl font-bold text-primary mt-1">€ 450,00</p>
                  <p className="text-[10px] text-amber-600 font-medium mt-1">Vence em 10 de Outubro</p>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Total Liquidado (23/24)</p>
                  <p className="text-2xl font-bold text-info mt-1">€ 1.385,00</p>
                  <p className="text-[10px] text-outline mt-1">Propinas & Taxas</p>
                </div>
              </div>

              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">receipt_long</span>
                    Histórico de Lançamentos Financeiros
                  </h3>
                  <button
                    onClick={() => onShowToast('Referência Multibanco gerada para pagamento.')}
                    className="text-xs bg-secondary text-surface-white px-2.5 py-1 rounded font-semibold hover:bg-opacity-90"
                  >
                    + Gerar Referência MB
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface border-b border-border-subtle font-semibold text-outline uppercase">
                        <th className="px-3 py-1.5">Descrição</th>
                        <th className="px-3 py-1.5">Vencimento</th>
                        <th className="px-3 py-1.5 text-right">Valor</th>
                        <th className="px-3 py-1.5 text-center">Estado</th>
                        <th className="px-3 py-1.5 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {financials.map((f) => (
                        <tr key={f.id} className="hover:bg-surface-container transition-colors">
                          <td className="px-3 py-1.5 font-semibold text-primary">{f.descricao}</td>
                          <td className="px-3 py-1.5 text-on-surface-variant">{f.dataVencimento}</td>
                          <td className="px-3 py-1.5 text-right font-bold text-primary">€ {f.valor.toFixed(2)}</td>
                          <td className="px-3 py-1.5 text-center">
                            {f.estado === 'Pago' ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                                Pago
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Emitido
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            {f.estado === 'Emitido' ? (
                              <button
                                onClick={() => onPayFinancial(f.id)}
                                className="bg-success text-surface-white px-2 py-1 rounded text-[10px] font-bold hover:bg-opacity-90"
                              >
                                Pagar Agora
                              </button>
                            ) : (
                              <button
                                onClick={() => onShowToast(`Descarregando recibo em PDF para ${f.descricao}...`)}
                                className="text-secondary font-semibold hover:underline text-[11px]"
                              >
                                Recibo PDF
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Assiduidade */}
          {activeTab === 'assiduidade' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Total de Faltas</p>
                  <p className="text-2xl font-bold text-primary mt-1">12 Ausências</p>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Faltas Justificadas</p>
                  <p className="text-2xl font-bold text-success mt-1">10 (83%)</p>
                </div>
                <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Não Justificadas</p>
                  <p className="text-2xl font-bold text-error mt-1">2 (17%)</p>
                </div>
              </div>

              <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-primary text-sm flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary text-[18px]">rule</span>
                  Registo de Faltas e Ausências
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface border-b border-border-subtle font-semibold text-outline uppercase">
                        <th className="px-3 py-1.5">Data</th>
                        <th className="px-3 py-1.5">Disciplina</th>
                        <th className="px-3 py-1.5">Tipo</th>
                        <th className="px-3 py-1.5 text-center">Estado</th>
                        <th className="px-3 py-1.5 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {absences.map((a) => (
                        <tr key={a.id} className="hover:bg-surface-container transition-colors">
                          <td className="px-3 py-1.5 font-semibold">{a.data}</td>
                          <td className="px-3 py-1.5 text-primary font-medium">{a.disciplina}</td>
                          <td className="px-3 py-1.5 text-on-surface-variant">{a.tipo}</td>
                          <td className="px-3 py-1.5 text-center">
                            {a.estado === 'Justificada' ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                                Justificada
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                Não Justificada
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            {a.estado === 'Não Justificada' ? (
                              <button
                                onClick={() => onJustifyAbsence(a.id)}
                                className="bg-secondary text-surface-white px-2 py-1 rounded text-[10px] font-bold hover:bg-opacity-90"
                              >
                                Justificar
                              </button>
                            ) : (
                              <span className="text-outline text-[11px]">Validado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Documentos */}
          {activeTab === 'documentos' && (
            <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">folder</span>
                  Repositório de Documentos do Estudante
                </h3>
                <button
                  onClick={() => setShowUploadDocModal(true)}
                  className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  + Adicionar Novo Documento
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface border-b border-border-subtle font-semibold text-outline uppercase">
                      <th className="px-3 py-1.5">Tipo de Documento</th>
                      <th className="px-3 py-1.5">Data de Envio</th>
                      <th className="px-3 py-1.5">Validade</th>
                      <th className="px-3 py-1.5 text-center">Estado</th>
                      <th className="px-3 py-1.5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-surface-container transition-colors">
                        <td className="px-3 py-1.5 font-bold text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined text-outline text-[18px]">{doc.iconName}</span>
                          {doc.tipo}
                        </td>
                        <td className="px-3 py-1.5 text-on-surface-variant">{doc.dataUpload}</td>
                        <td className="px-3 py-1.5 text-on-surface-variant">{doc.validade}</td>
                        <td className="px-3 py-1.5 text-center">
                          {doc.estado === 'VALIDADO' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                              VALIDADO
                            </span>
                          ) : doc.estado === 'PENDENTE' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              PENDENTE
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              EXPIRADO
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-center relative">
                          <button
                            onClick={() => setActiveDocMenuId(activeDocMenuId === doc.id ? null : doc.id)}
                            className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-variant/50 cursor-pointer"
                            title="Opções"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>

                          {activeDocMenuId === doc.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setActiveDocMenuId(null)} />
                              <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                                <button
                                  onClick={() => {
                                    setActiveDocMenuId(null);
                                    onShowToast(`A visualizar ficheiro: ${doc.tipo}`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Ficheiro
                                </button>
                                {doc.estado !== 'VALIDADO' && (
                                  <button
                                    onClick={() => {
                                      setActiveDocMenuId(null);
                                      onUpdateDocumentStatus(doc.id, 'VALIDADO');
                                      onShowToast(`Documento ${doc.tipo} validado com sucesso!`);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-success"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Validar
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setActiveDocMenuId(null);
                                    setShowUploadDocModal(true);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-secondary"
                                >
                                  <span className="material-symbols-outlined text-[16px]">upload_file</span> Substituir
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDocMenuId(null);
                                    onShowToast(`Documento ${doc.tipo} descarregado.`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                                >
                                  <span className="material-symbols-outlined text-[16px]">download</span> Descarregar
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
        </div>

        {/* Right Collapsible Side Drawer: Histórico de Timeline */}
        {isTimelineOpen && (
          <aside className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3 sticky top-16 max-h-[calc(100vh-80px)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">history</span>
                <h2 className="font-bold text-primary text-sm">Histórico de Timeline</h2>
              </div>
              <button
                onClick={() => setIsTimelineOpen(false)}
                className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Timeline Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-medium">
              <button
                onClick={() => setTimelineFilter('all')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  timelineFilter === 'all'
                    ? 'bg-primary text-surface-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setTimelineFilter('finance')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  timelineFilter === 'finance'
                    ? 'bg-primary text-surface-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Financeiro
              </button>
              <button
                onClick={() => setTimelineFilter('academic')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  timelineFilter === 'academic'
                    ? 'bg-primary text-surface-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Académico
              </button>
              <button
                onClick={() => setTimelineFilter('documental')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  timelineFilter === 'documental'
                    ? 'bg-primary text-surface-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Documental
              </button>
            </div>

            {/* Search within Timeline */}
            <div className="flex items-center bg-surface border border-border-subtle rounded px-2 h-7">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1">search</span>
              <input
                type="text"
                value={timelineSearch}
                onChange={(e) => setTimelineSearch(e.target.value)}
                placeholder="Pesquisar evento..."
                className="w-full bg-transparent border-none text-xs outline-none"
              />
            </div>

            {/* Timeline Events Scroll Area */}
            <div className="flex-1 overflow-y-auto drawer-scroll space-y-4 pr-1 my-1 text-xs">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="relative pl-6 border-l-2 border-border-subtle pb-2">
                  <div className="absolute -left-[9px] top-0.5 bg-surface-white border-2 border-secondary rounded-full w-4 h-4 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeBg} ${item.badgeText}`}>
                      {item.categoriaLabel}
                    </span>
                    <span className="text-[10px] text-outline font-medium">
                      {item.dateCategory} às {item.timestamp}
                    </span>
                  </div>

                  <p className="font-bold text-primary flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[16px] ${item.iconColor}`}>{item.icon}</span>
                    {item.titulo}
                  </p>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-snug">{item.descricao}</p>

                  <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-border-subtle/50 text-[10px] text-outline">
                    {item.autorPhoto ? (
                      <img src={item.autorPhoto} alt="" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[12px]">account_circle</span>
                    )}
                    <span>{item.autorName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Quick Note Form */}
            <form onSubmit={handleAddTimelineNote} className="pt-2 border-t border-border-subtle flex gap-1">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Adicionar nota à timeline..."
                className="flex-1 border border-border-subtle rounded px-2 text-xs h-8 outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="bg-secondary text-surface-white px-3 rounded h-8 text-xs font-bold hover:bg-opacity-90 transition-colors"
              >
                Inserir
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Grade Details Modal */}
      {selectedGrade && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl shadow-2xl w-full max-w-md p-5 border border-border-subtle">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">{selectedGrade.iconName}</span>
                {selectedGrade.disciplina}
              </h3>
              <button onClick={() => setSelectedGrade(null)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <p>
                <strong>Professor Responsável:</strong> {selectedGrade.professor}
              </p>
              <p>
                <strong>Classificação 1º Período:</strong> {selectedGrade.nota1Per} / 20 Valores
              </p>
              <p>
                <strong>Nota Final Calculada:</strong> {selectedGrade.notaFinal} / 20 Valores
              </p>
              <p>
                <strong>Situação Pauta:</strong> {selectedGrade.estado}
              </p>
              <div className="p-3 bg-surface-container-low rounded border border-border-subtle">
                <p className="font-semibold text-primary mb-1">Observação do Conselho de Turma:</p>
                <p className="text-on-surface-variant text-[11px]">
                  O estudante demonstra excelente empenho e raciocínio lógico em sala de aula.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedGrade(null)}
                className="bg-primary text-surface-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl shadow-2xl w-full max-w-md p-5 border border-border-subtle">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-3">
              <h3 className="font-bold text-primary text-base">Adicionar Novo Documento</h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-outline font-bold mb-1">Tipo de Documento</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                >
                  <option value="Certificado de Habilitações">Certificado de Habilitações</option>
                  <option value="Cartão de Cidadão / Passaporte">Cartão de Cidadão / Passaporte</option>
                  <option value="Boletim de Vacinas">Boletim de Vacinas</option>
                  <option value="Fotografia Tipo Passe">Fotografia Tipo Passe</option>
                  <option value="Comprovativo de Morada">Comprovativo de Morada</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-border-subtle rounded-xl p-6 text-center hover:border-secondary transition-colors cursor-pointer bg-surface-container-low/50">
                <span className="material-symbols-outlined text-4xl text-outline mb-1">cloud_upload</span>
                <p className="font-bold text-primary">Arraste o ficheiro aqui ou clique para selecionar</p>
                <p className="text-[10px] text-outline mt-1">Formatos suportados: PDF, JPG, PNG (Máx. 10MB)</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowUploadDocModal(false)}
                className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowUploadDocModal(false);
                  onShowToast(`Documento "${newDocType}" adicionado com sucesso!`);
                }}
                className="bg-secondary text-surface-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90"
              >
                Guardar Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
