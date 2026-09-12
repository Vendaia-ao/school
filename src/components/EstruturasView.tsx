import React, { useState } from 'react';
import { ActiveView, Structure, StructureType } from '../types';
import { useAccess } from '../context/AccessContext';
import {
  Building2,
  Plus,
  Search,
  CreditCard as Edit3,
  Power,
  Users,
  GraduationCap,
  MapPin,
  X,
  TriangleAlert as AlertTriangle,
  School,
  Landmark,
  BookOpen,
  Briefcase,
  Layers,
} from 'lucide-react';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

const tipoOptions: { value: StructureType; label: string; icon: React.ReactNode }[] = [
  { value: 'college', label: 'Colégio', icon: <School className="w-4 h-4 text-secondary" /> },
  { value: 'campus', label: 'Campus Universitário', icon: <Landmark className="w-4 h-4 text-primary" /> },
  { value: 'faculty', label: 'Faculdade', icon: <BookOpen className="w-4 h-4 text-info" /> },
  { value: 'polo', label: 'Polo de Formação', icon: <MapPin className="w-4 h-4 text-success" /> },
  { value: 'center', label: 'Centro de Estudos', icon: <Briefcase className="w-4 h-4 text-warning" /> },
  { value: 'unit', label: 'Unidade Operacional', icon: <Layers className="w-4 h-4 text-outline" /> },
];

export const EstruturasView: React.FC<Props> = ({ onShowToast }) => {
  const { structures, addStructure, updateStructure, toggleStructureStatus, switchStructure, currentStructureId } =
    useAccess();

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStruct, setEditingStruct] = useState<Structure | null>(null);
  const [confirmStatusStruct, setConfirmStatusStruct] = useState<Structure | null>(null);

  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    tipo: 'college' as StructureType,
    morada: '',
    diretorResponsavel: '',
    estudantesCount: 0,
    professoresCount: 0,
    estado: 'Ativo' as 'Ativo' | 'Inativo',
  });

  const totalEstudantes = structures.reduce((acc, s) => acc + s.estudantesCount, 0);
  const totalProfessores = structures.reduce((acc, s) => acc + s.professoresCount, 0);
  const estruturasAtivas = structures.filter((s) => s.estado === 'Ativo').length;

  const openCreateModal = () => {
    setEditingStruct(null);
    setForm({
      codigo: `EST-0${structures.length + 1}`,
      nome: '',
      tipo: 'college',
      morada: '',
      diretorResponsavel: '',
      estudantesCount: 0,
      professoresCount: 0,
      estado: 'Ativo',
    });
    setModalOpen(true);
  };

  const openEditModal = (struct: Structure) => {
    setEditingStruct(struct);
    setForm({
      codigo: struct.codigo,
      nome: struct.nome,
      tipo: struct.tipo,
      morada: struct.morada,
      diretorResponsavel: struct.diretorResponsavel,
      estudantesCount: struct.estudantesCount,
      professoresCount: struct.professoresCount,
      estado: struct.estado,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoObj = tipoOptions.find((t) => t.value === form.tipo);
    const tipoLabel = tipoObj ? tipoObj.label : 'Estrutura';

    if (editingStruct) {
      updateStructure(editingStruct.id, {
        ...form,
        tipoLabel,
      });
      onShowToast(`Estrutura "${form.nome}" atualizada com sucesso!`);
    } else {
      addStructure({
        institutionId: 'inst-01',
        codigo: form.codigo,
        nome: form.nome,
        tipo: form.tipo,
        tipoLabel,
        morada: form.morada,
        diretorResponsavel: form.diretorResponsavel,
        estudantesCount: Number(form.estudantesCount),
        professoresCount: Number(form.professoresCount),
        estado: form.estado,
      });
      onShowToast(`Estrutura "${form.nome}" criada com sucesso!`);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = () => {
    if (!confirmStatusStruct) return;
    toggleStructureStatus(confirmStatusStruct.id);
    const newEstado = confirmStatusStruct.estado === 'Ativo' ? 'Inativa' : 'Ativada';
    onShowToast(`Estrutura "${confirmStatusStruct.nome}" ${newEstado} com sucesso.`);
    setConfirmStatusStruct(null);
  };

  const filteredStructures = structures.filter((s) => {
    const matchSearch = `${s.nome} ${s.codigo} ${s.diretorResponsavel} ${s.morada}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTipo = filterTipo === 'Todos' || s.tipo === filterTipo;
    const matchEstado = filterEstado === 'Todos' || s.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  return (
    <div className="mt-header-height p-4 sm:p-5 w-full flex flex-col gap-4">
      {/* Header Title */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-secondary stroke-[1.75]" />
            Estruturas & Unidades Operacionais
          </h1>
          <p className="text-xs text-on-surface-variant">
            Gestão de colégios, campi, faculdades e polos pertencentes à instituição.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[1.75]" /> Nova Estrutura
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Total de Estruturas</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{structures.length}</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center font-bold">
            <Users className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Estudantes Consolidados</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{totalEstudantes.toLocaleString('pt-PT')}</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Corpo Docente Ativo</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{totalProfessores.toLocaleString('pt-PT')}</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <Power className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Unidades Operacionais</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{estruturasAtivas} Ativas</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1.5 cursor-pointer font-medium"
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="college">Colégios</option>
              <option value="campus">Campi Universitários</option>
              <option value="faculty">Faculdades</option>
              <option value="polo">Polos de Formação</option>
              <option value="center">Centros de Estudos</option>
              <option value="unit">Unidades Operacionais</option>
            </select>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1.5 cursor-pointer font-medium"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, código ou diretor..."
              className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium w-64"
            />
          </div>
        </div>

        {/* Structures Table */}
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-3.5 py-3 text-left">Estrutura / Código</th>
                <th className="px-3.5 py-3 text-left">Tipo</th>
                <th className="px-3.5 py-3 text-left">Diretor Responsável</th>
                <th className="px-3.5 py-3 text-center">Estudantes</th>
                <th className="px-3.5 py-3 text-center">Professores</th>
                <th className="px-3.5 py-3 text-center">Estado</th>
                <th className="px-3.5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredStructures.length ? (
                filteredStructures.map((s) => {
                  const isSelected = currentStructureId === s.id;
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-surface-container-low/30 transition-colors ${
                        isSelected ? 'bg-secondary/5 font-semibold' : ''
                      }`}
                    >
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {s.codigo.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-xs flex items-center gap-1.5">
                              {s.nome}
                              {isSelected && (
                                <span className="bg-secondary text-surface-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                  Contexto Ativo
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-outline flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-outline shrink-0" />
                              {s.morada}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3.5 py-3">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 w-fit">
                          {tipoOptions.find((t) => t.value === s.tipo)?.icon}
                          {s.tipoLabel}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-on-surface-variant text-xs font-medium">
                        {s.diretorResponsavel}
                      </td>

                      <td className="px-3.5 py-3 text-center font-bold text-primary text-xs">
                        {s.estudantesCount.toLocaleString('pt-PT')}
                      </td>

                      <td className="px-3.5 py-3 text-center font-bold text-primary text-xs">
                        {s.professoresCount.toLocaleString('pt-PT')}
                      </td>

                      <td className="px-3.5 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            s.estado === 'Ativo' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                          }`}
                        >
                          {s.estado}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              switchStructure(s.id);
                              onShowToast(`Contexto alterado para "${s.nome}".`);
                            }}
                            className="px-2 py-1 text-[10px] bg-secondary/10 text-secondary hover:bg-secondary hover:text-surface-white font-bold rounded transition-colors cursor-pointer"
                            title="Alternar para este contexto"
                          >
                            Trabalhar Aqui
                          </button>
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmStatusStruct(s)}
                            className="p-1.5 text-outline hover:text-warning rounded hover:bg-warning/10 transition-colors cursor-pointer"
                            title="Ativar/Desativar"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">
                    Nenhuma estrutura encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Criar / Editar Estrutura */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Building2 className="w-5 h-5 text-secondary" />
                {editingStruct ? `Editar Estrutura: ${editingStruct.nome}` : 'Criar Nova Estrutura'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">
                  Código da Unidade
                  <input
                    type="text"
                    required
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                    placeholder="Ex: COL-01, CAM-02"
                  />
                </label>

                <label className="block text-outline font-bold">
                  Tipo de Estrutura
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as StructureType })}
                    className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"
                  >
                    {tipoOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-outline font-bold">
                Nome da Estrutura
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                  placeholder="Ex: Colégio Talatona, Campus Universitário Central"
                />
              </label>

              <label className="block text-outline font-bold">
                Morada / Localização
                <input
                  type="text"
                  required
                  value={form.morada}
                  onChange={(e) => setForm({ ...form, morada: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                  placeholder="Ex: Via S10, Talatona, Luanda"
                />
              </label>

              <label className="block text-outline font-bold">
                Diretor Responsável
                <input
                  type="text"
                  required
                  value={form.diretorResponsavel}
                  onChange={(e) => setForm({ ...form, diretorResponsavel: e.target.value })}
                  className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                  placeholder="Ex: Dra. Sara Silva, Prof. Carlos Mendes"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">
                  Nº Inicial de Estudantes
                  <input
                    type="number"
                    value={form.estudantesCount}
                    onChange={(e) => setForm({ ...form, estudantesCount: Number(e.target.value) })}
                    className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                  />
                </label>

                <label className="block text-outline font-bold">
                  Nº Inicial de Professores
                  <input
                    type="number"
                    value={form.professoresCount}
                    onChange={(e) => setForm({ ...form, professoresCount: Number(e.target.value) })}
                    className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-outline font-bold">
                Estado Operacional
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as 'Ativo' | 'Inativo' })}
                  className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all"
                >
                  {editingStruct ? 'Guardar Alterações' : 'Criar Estrutura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Ativação / Desativação */}
      {confirmStatusStruct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                {confirmStatusStruct.estado === 'Ativo' ? 'Desativar Estrutura' : 'Ativar Estrutura'}
              </h2>
              <button
                onClick={() => setConfirmStatusStruct(null)}
                className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              Deseja alterar o estado da estrutura{' '}
              <strong className="text-primary">{confirmStatusStruct.nome}</strong> para{' '}
              <strong className="text-secondary">
                {confirmStatusStruct.estado === 'Ativo' ? 'Inativo' : 'Ativo'}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmStatusStruct(null)}
                className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleToggleStatus}
                className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
