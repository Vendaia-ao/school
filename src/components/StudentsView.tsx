import React, { useState, useMemo } from 'react';
import { CreditCard, Award, GraduationCap, FileText } from 'lucide-react';
import { Student, StudentFilters } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onToggleStatus: (studentId: string) => void;
  onOpenBatchAction: (actionType: 'card' | 'declaration' | 'status' | 'notify') => void;
  onShowToast: (message: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStudent,
  onToggleStatus,
  onOpenBatchAction,
  onShowToast,
}) => {
  // Filter state
  const [filters, setFilters] = useState<StudentFilters>({
    anoLetivo: '23/24',
    dataInicio: '',
    dataFim: '',
    classe: 'Todas',
    curso: 'Todos',
    estado: 'Todos',
    financeiro: 'Todos',
    docPendente: '',
    searchQuery: '',
    rowsPerPage: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = s.nomeCompleto.toLowerCase().includes(q);
        const matchMatricula = s.matricula.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
        const matchContact = s.contactoEstudante.includes(q) || s.encarregadoTelefone.includes(q);
        if (!matchName && !matchMatricula && !matchContact) return false;
      }

      // Classe
      if (filters.classe !== 'Todas' && s.classe !== filters.classe) return false;

      // Curso
      if (filters.curso !== 'Todos' && s.curso !== filters.curso) return false;

      // Estado
      if (filters.estado !== 'Todos' && s.estadoMatricula !== filters.estado) return false;

      // Financeiro
      if (filters.financeiro !== 'Todos' && s.situacaoFinanceira !== filters.financeiro) return false;

      // Doc Pendente
      if (filters.docPendente) {
        if (filters.docPendente === 'ok' && s.documentacaoPendente !== 'ok') return false;
        if (filters.docPendente === 'bi' && s.documentacaoPendente !== 'bi') return false;
        if (filters.docPendente === 'cert' && s.documentacaoPendente !== 'cert') return false;
        if (filters.docPendente === 'foto' && s.documentacaoPendente !== 'foto') return false;
      }

      return true;
    });
  }, [students, filters]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / filters.rowsPerPage));
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * filters.rowsPerPage;
    return filteredStudents.slice(start, start + filters.rowsPerPage);
  }, [filteredStudents, currentPage, filters.rowsPerPage]);

  // Row selection
  const isAllSelected = currentStudents.length > 0 && currentStudents.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentStudents.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Contacto copiado: ${text}`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Nº Matrícula,Nome Completo,Classe,Turma,Curso,Encarregado,Contacto,Estado,Financeiro']
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.matricula},"${s.nomeCompleto}",${s.classe},${s.turma},"${s.curso}","${s.encarregadoNome}",${s.contactoEstudante},${s.estadoMatricula},${s.situacaoFinanceira}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estudantes_vendaia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Lista de estudantes exportada com sucesso (CSV)');
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* Top Summary Panel (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1: Total Students */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Total Estudantes
            </span>
            <span className="text-2xl font-bold text-primary leading-none">1.432</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +12
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">Este mês</span>
          </div>
        </div>

        {/* Card 2: Status da Matrícula */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Matrícula</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-bold text-[12px]">
                  96% <span className="text-[10px] font-medium text-outline ml-0.5">Ativos</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>1.375 Ativos</span>
              <span className="text-error/70">57 Inativos</span>
            </div>
          </div>
        </div>

        {/* Card 3: Situação Financeira */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Financeiro</span>
              <div className="flex items-center gap-2">
                <span className="text-info font-bold text-[12px]">
                  88% <span className="text-[10px] font-medium text-outline ml-0.5">Regular</span>
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-info h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span>1.260 Regular</span>
              <span className="text-amber-600/80">172 Pendente</span>
            </div>
          </div>
        </div>

        {/* Card 4: Emissões Pendentes */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-2.5 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">
              Emissões Pendentes
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-error leading-none">42</span>
              <span className="text-[10px] text-outline font-medium">por emitir</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => onShowToast('Notificações de emissão pendente enviadas para todos os alunos.')}
              className="px-2 py-0.5 rounded bg-error/10 text-error hover:bg-error/20 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3 h-3" /> Emitir Tudo
            </button>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
              <span title="Cartões de Estudante" className="flex items-center gap-0.5 text-error font-bold">
                <CreditCard className="w-3 h-3" /> 14
              </span>
              <span className="text-outline/40">·</span>
              <span title="Certificados" className="flex items-center gap-0.5 text-amber-600 font-bold">
                <Award className="w-3 h-3" /> 5
              </span>
              <span className="text-outline/40">·</span>
              <span title="Declarações" className="flex items-center gap-0.5 text-info font-bold">
                <GraduationCap className="w-3 h-3" /> 8
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-surface-white border border-outline-variant/30 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-sm p-3">
        <div className="flex flex-col w-full gap-1.5">
          {/* Dropdowns Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={filters.anoLetivo}
              onChange={(e) => setFilters({ ...filters, anoLetivo: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="23/24">Ano Letivo: 23/24</option>
              <option value="22/23">Ano Letivo: 22/23</option>
              <option value="21/22">Ano Letivo: 21/22</option>
            </select>

            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                placeholder="Início"
                className="appearance-none bg-surface border border-border-subtle rounded-md px-2 text-xs focus:outline-none focus:border-secondary w-28 py-0.5"
              />
              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                placeholder="Fim"
                className="appearance-none bg-surface border border-border-subtle rounded-md px-2 text-xs focus:outline-none focus:border-secondary w-28 py-0.5"
              />
            </div>

            <select
              value={filters.classe}
              onChange={(e) => setFilters({ ...filters, classe: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="Todas">Classe: Todas</option>
              <option value="10º Ano">10º Ano</option>
              <option value="11º Ano">11º Ano</option>
              <option value="12º Ano">12º Ano</option>
            </select>

            <select
              value={filters.curso}
              onChange={(e) => setFilters({ ...filters, curso: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="Todos">Curso: Todos</option>
              <option value="Ciências Físicas">Ciências Físicas</option>
              <option value="Ciências e Tecnologias">Ciências e Tecnologias</option>
              <option value="Economia">Economia</option>
              <option value="Artes Visuais">Artes Visuais</option>
              <option value="Engenharia Informática">Engenharia Informática</option>
            </select>

            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <select
              value={filters.financeiro}
              onChange={(e) => setFilters({ ...filters, financeiro: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="Todos">Financeiro: Todos</option>
              <option value="Regularizada">Regularizada</option>
              <option value="Pendente">Pendente</option>
              <option value="Dívida">Dívida</option>
            </select>

            <select
              value={filters.docPendente}
              onChange={(e) => setFilters({ ...filters, docPendente: e.target.value })}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-0.5"
            >
              <option value="">Documentação Pendente</option>
              <option value="bi">BI/Passaporte</option>
              <option value="cert">Certificado de Habilitações</option>
              <option value="foto">Fotografia</option>
              <option value="ok">Tudo Regularizado</option>
            </select>
          </div>

          {/* Search Input & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center bg-surface border border-border-subtle rounded-md px-2 h-7 focus-within:border-secondary transition-colors">
              <span className="material-symbols-outlined text-[16px] text-outline mr-1.5">search</span>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Pesquisar Nome, Nº de Matrícula ou Contacto..."
                className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 outline-none placeholder-outline"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenAddModal}
                className="bg-secondary text-surface-white px-2.5 h-7 rounded hover:bg-opacity-90 transition-colors shadow-sm flex items-center justify-center gap-1 font-semibold text-xs cursor-pointer"
                title="Nova Inscrição"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="whitespace-nowrap">Nova Inscrição</span>
              </button>

              <div className="flex items-center border border-border-subtle rounded overflow-hidden">
                <button
                  onClick={() => onShowToast('Função de Importação iniciada.')}
                  className="bg-surface text-on-surface-variant px-2.5 h-7 hover:bg-surface-container transition-colors flex items-center justify-center gap-1 font-medium text-xs border-r border-border-subtle"
                  title="Importar"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span className="whitespace-nowrap">Importar</span>
                </button>
                <button
                  onClick={() => onShowToast('Gerando relatório de estudantes...')}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center border-r border-border-subtle"
                  title="Ver Relatório"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center border-r border-border-subtle"
                  title="Exportar"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center border-r border-border-subtle"
                  title="Imprimir"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      anoLetivo: '23/24',
                      dataInicio: '',
                      dataFim: '',
                      classe: 'Todas',
                      curso: 'Todos',
                      estado: 'Todos',
                      financeiro: 'Todos',
                      docPendente: '',
                      searchQuery: '',
                      rowsPerPage: 10,
                    });
                    onShowToast('Filtros e dados atualizados com sucesso.');
                  }}
                  className="bg-surface text-on-surface-variant w-7 h-7 hover:bg-surface-container transition-colors flex items-center justify-center"
                  title="Atualizar"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>

              <div className="w-px h-5 bg-border-subtle mx-0.5"></div>

              <div className="flex items-center gap-1.5">
                <select
                  value={filters.rowsPerPage}
                  onChange={(e) => {
                    setFilters({ ...filters, rowsPerPage: Number(e.target.value) });
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-surface border border-border-subtle rounded-md pl-1.5 pr-6 text-xs focus:outline-none focus:border-secondary h-7 py-0.5"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-white border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-border-subtle">
                <th className="px-4 py-1.5 bg-surface-container-low w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                  />
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Nº de Matrícula
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Nome Completo
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Classe
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Turma
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Curso
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Encarregado
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Contacto
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Estado
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase py-1.5 bg-surface-container-low">
                  Financeiro
                </th>
                <th className="px-4 font-semibold text-xs text-outline uppercase text-center w-16 py-1.5 bg-surface-container-low">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-on-surface-variant font-medium">
                    Nenhum estudante encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-surface-container transition-colors group ${
                        isSelected ? 'bg-secondary/5' : 'even:bg-surface-container-low/50'
                      }`}
                    >
                      <td className="px-4 py-1.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(student.id)}
                          className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer"
                        />
                      </td>
                      <td className="px-4 font-medium text-on-surface-variant py-1.5 font-label-md">
                        {student.matricula}
                      </td>
                      <td className="px-4 font-medium text-on-surface py-1.5 font-label-md">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="hover:text-secondary text-left font-semibold hover:underline"
                        >
                          {student.nomeCompleto}
                        </button>
                      </td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.classe}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.turma}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.curso}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">{student.encarregadoNome}</td>
                      <td className="px-4 text-on-surface-variant py-1.5 font-label-md">
                        <span
                          className="has-tooltip cursor-pointer hover:text-primary"
                          onClick={() => copyToClipboard(student.contactoEstudante)}
                        >
                          {student.contactoEstudante}
                          <span className="tooltip">Clique p/ copiar</span>
                        </span>
                      </td>
                      <td className="px-4 py-1.5 font-label-md">
                        {student.estadoMatricula === 'Ativo' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-red-800 bg-red-100 text-[11px] font-semibold tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-1.5 font-label-md">
                        {student.situacaoFinanceira === 'Regularizada' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-green-800 bg-green-100 text-[11px] font-semibold tracking-tight">
                            Regularizada
                          </span>
                        ) : student.situacaoFinanceira === 'Pendente' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-amber-800 bg-amber-100 text-xs font-medium">
                            Pendente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-red-800 bg-red-100 text-[11px] font-semibold tracking-tight">
                            Dívida
                          </span>
                        )}
                      </td>
                      <td className="px-4 text-center py-1.5 font-label-md relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                          className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/50"
                          title="Opções"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>

                        {activeMenuId === student.id && (
                          <div className="absolute right-2 top-10 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onSelectStudent(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Perfil
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenEditModal(student);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span> Editar Dados
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onToggleStatus(student.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px]">published_with_changes</span> Alterar Estado
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteStudent(student.id);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-error/10 text-error rounded flex items-center gap-2 font-medium"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span> Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-2 border-t border-border-subtle flex items-center justify-between bg-surface-white text-xs">
          <p className="text-on-surface-variant">
            Mostrando {filteredStudents.length === 0 ? 0 : (currentPage - 1) * filters.rowsPerPage + 1}–
            {Math.min(currentPage * filters.rowsPerPage, filteredStudents.length)} de {filteredStudents.length} estudantes
          </p>
          <div className="flex gap-1 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-2 py-1 border border-border-subtle rounded text-outline hover:bg-surface-container-low disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 border rounded font-medium cursor-pointer ${
                  currentPage === page
                    ? 'border-secondary text-surface-white bg-secondary'
                    : 'border-border-subtle text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2 py-1 border border-border-subtle rounded text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Bar for Selected Students */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary-container text-on-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-on-primary-container/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 border-r border-on-primary-container/20 pr-6">
            <span className="bg-secondary text-surface-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold">
              {selectedIds.length}
            </span>
            <span className="text-xs font-medium">Estudantes Selecionados</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenBatchAction('card')}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              Emitir Cartão
            </button>
            <button
              onClick={() => onOpenBatchAction('declaration')}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Emitir Declaração
            </button>
            <button
              onClick={() => onOpenBatchAction('status')}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
              Alterar Estado
            </button>
            <button
              onClick={() => onOpenBatchAction('notify')}
              className="flex items-center gap-1.5 hover:text-secondary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">notification_important</span>
              Notificar Pendências
            </button>
          </div>

          <div className="border-l border-on-primary-container/20 pl-2">
            <button
              onClick={() => setSelectedIds([])}
              className="p-1 hover:bg-on-primary-container/20 rounded-full transition-colors"
              title="Cancelar Seleção"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
