import React, { useState } from 'react';
import {
  X,
  Save,
  Building2,
  Lock,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAccess } from '../context/AccessContext';

export interface WizardTarget {
  type: 'user' | 'group';
  id: string;
  name: string;
  role?: string;
}

interface Props {
  target: WizardTarget;
  onBack: () => void;
  onSave: (targetId: string, data: any) => void;
  onShowToast: (msg: string) => void;
}

// Matrix Resource Items
interface ResourceItem {
  id: string;
  module: string;
  domain: 'Geral' | 'Académico' | 'Financeiro' | 'Utilizadores' | 'Administração';
  name: string;
}

const MATRIX_RESOURCES: ResourceItem[] = [
  { id: 'dashboard', module: 'DASHBOARD', domain: 'Geral', name: 'Dashboard' },
  { id: 'estudantes', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Estudantes' },
  { id: 'turmas', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Turmas' },
  { id: 'professores', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Professores' },
  { id: 'pautas', module: 'GESTÃO ACADÉMICA', domain: 'Académico', name: 'Pautas & Notas' },
  { id: 'gestao_financeira', module: 'SERVIÇOS FINANCEIROS', domain: 'Financeiro', name: 'Contas & Propinas' },
  { id: 'precarios', module: 'SERVIÇOS FINANCEIROS', domain: 'Financeiro', name: 'Tabelas de Preços' },
  { id: 'utilizadores_sistema', module: 'UTILIZADORES & ACESSOS', domain: 'Utilizadores', name: 'Utilizadores' },
  { id: 'grupos_acesso', module: 'UTILIZADORES & ACESSOS', domain: 'Utilizadores', name: 'Grupos & Perfis' },
  { id: 'config_academicas', module: 'ADMINISTRAÇÃO DA PLATAFORMA', domain: 'Administração', name: 'Estruturas & Polos' },
  { id: 'auditoria_logs', module: 'ADMINISTRAÇÃO DA PLATAFORMA', domain: 'Administração', name: 'Auditoria & Logs' },
];

const OPERATIONS = ['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR', 'SUSPENDER', 'ENCERRAR', 'ADMINISTRAR'] as const;
type Operation = typeof OPERATIONS[number];

type MatrixMap = Record<string, Set<Operation>>;

export const PermissionWizardView: React.FC<Props> = ({ target, onBack, onSave, onShowToast }) => {
  const { structures } = useAccess();

  // Form State — Scope & Mode
  const [scopeType, setScopeType] = useState<'global' | 'restricted'>('restricted');
  const [scopeMode, setScopeMode] = useState<'uniform' | 'contextual'>('contextual');
  const [selectedStructures, setSelectedStructures] = useState<string[]>(['str-01', 'str-02']);
  const [domainFilter, setDomainFilter] = useState<string>('Todos os Domínios');

  // Accordion Expanded State (Key: structure ID or 'global')
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (key: string) => {
    setExpandedAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Matrix State per Structure (Key: structure ID or 'global')
  const [structureMatrices, setStructureMatrices] = useState<Record<string, MatrixMap>>(() => {
    const defaultMatrix: MatrixMap = {
      estudantes: new Set<Operation>(['VER', 'CRIAR', 'EDITAR']),
      turmas: new Set<Operation>(['VER', 'EDITAR']),
      pautas: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR']),
    };

    const kilambaMatrix: MatrixMap = {
      estudantes: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR', 'ADMINISTRAR']),
      turmas: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'ADMINISTRAR']),
      pautas: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR']),
      gestao_financeira: new Set<Operation>(['VER', 'CRIAR', 'EDITAR', 'APROVAR', 'EXPORTAR']),
    };

    const talatonaMatrix: MatrixMap = {
      estudantes: new Set<Operation>(['VER']),
      turmas: new Set<Operation>(['VER']),
      pautas: new Set<Operation>(['VER']),
    };

    return {
      global: defaultMatrix,
      'str-01': kilambaMatrix,
      'str-02': talatonaMatrix,
    };
  });

  // Calculate Total Active Rules
  const calculateActiveRulesCount = (): number => {
    if (scopeMode === 'uniform' || scopeType === 'global') {
      const globalMat = structureMatrices['global'] || {};
      return (Object.values(globalMat) as Set<Operation>[]).reduce((acc, curr) => acc + curr.size, 0);
    }
    let total = 0;
    selectedStructures.forEach((strId) => {
      const mat = structureMatrices[strId] || structureMatrices['global'] || {};
      total += (Object.values(mat) as Set<Operation>[]).reduce((acc, curr) => acc + curr.size, 0);
    });
    return total;
  };

  const activeRulesCount = calculateActiveRulesCount();

  const toggleMatrixCell = (targetKey: string, resourceId: string, op: Operation) => {
    setStructureMatrices((prev) => {
      const targetMat = prev[targetKey] || {};
      const nextMat = { ...targetMat };
      const set = new Set(nextMat[resourceId] || []);
      if (set.has(op)) {
        set.delete(op);
      } else {
        set.add(op);
      }
      nextMat[resourceId] = set;
      return { ...prev, [targetKey]: nextMat };
    });
  };

  const toggleResourceAll = (targetKey: string, resourceId: string) => {
    setStructureMatrices((prev) => {
      const targetMat = prev[targetKey] || {};
      const nextMat = { ...targetMat };
      const currentSet = nextMat[resourceId] || new Set();
      if (currentSet.size === OPERATIONS.length) {
        nextMat[resourceId] = new Set();
      } else {
        nextMat[resourceId] = new Set(OPERATIONS);
      }
      return { ...prev, [targetKey]: nextMat };
    });
  };

  const toggleStructureSelection = (strId: string) => {
    if (selectedStructures.includes(strId)) {
      setSelectedStructures(selectedStructures.filter((id) => id !== strId));
    } else {
      setSelectedStructures([...selectedStructures, strId]);
    }
  };

  const handleSave = () => {
    onSave(target.id, {
      scopeType,
      scopeMode,
      selectedStructures,
      structureMatrices,
    });
    onShowToast(`Permissões salvas com sucesso para ${target.name}!`);
    onBack();
  };

  const filteredResources = MATRIX_RESOURCES.filter(
    (r) => domainFilter === 'Todos os Domínios' || r.domain === domainFilter
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-hidden backdrop-blur-xs">
      {/* Fixed Height Modal Container */}
      <div className="bg-surface-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-5xl h-[88vh] overflow-hidden flex flex-col">
        {/* Modal Top Header (Fixed Height) */}
        <div className="px-4 py-3 border-b border-border-subtle bg-surface-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-primary flex items-center gap-2 leading-tight">
                Atribuir Permissões: <span className="text-secondary">{target.name}</span>
              </h2>
              <p className="text-[10px] text-outline">
                {target.role ? `Perfil Base: ${target.role}` : 'Governação de Acesso Vendaia OS® (RN9.08)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-surface-container-low border border-border-subtle px-2 py-0.5 rounded text-center">
                <span className="text-[8px] uppercase font-bold text-outline block leading-none">ALVO</span>
                <span className="font-bold text-primary text-[11px] leading-tight">
                  {target.type === 'user' ? 'Utilizador Individual' : 'Grupo'}
                </span>
              </div>
              <div className="bg-success/10 border border-success/20 px-2 py-0.5 rounded text-center">
                <span className="text-[8px] uppercase font-bold text-success block leading-none">REGRAS</span>
                <span className="font-bold text-success text-[11px] leading-tight">{activeRulesCount} Ativas</span>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-outline hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toolbar & Reorganized Cohesive Controls */}
        <div className="bg-surface-container-low border-b border-border-subtle px-4 py-2 text-xs shrink-0">
          <div className="flex items-center justify-between gap-3 overflow-x-auto">
            {/* Left Group: Escopo & Modo */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Scope Type Toggle */}
              <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-outline px-1.5 flex items-center gap-1">
                  ESCOPO:
                </span>
                <button
                  onClick={() => setScopeType('global')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    scopeType === 'global'
                      ? 'bg-secondary text-surface-white shadow-xs'
                      : 'text-outline hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  🌐 Global
                </button>
                <button
                  onClick={() => setScopeType('restricted')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    scopeType === 'restricted'
                      ? 'bg-secondary text-surface-white shadow-xs'
                      : 'text-outline hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  🏢 Por Polos
                </button>
              </div>

              {/* Scope Mode Toggle (Only when Restricted) */}
              {scopeType === 'restricted' && (
                <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs">
                  <span className="text-[9px] uppercase font-bold text-outline px-1.5 flex items-center gap-1">
                    MATRIZ:
                  </span>
                  <button
                    onClick={() => setScopeMode('uniform')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      scopeMode === 'uniform'
                        ? 'bg-primary text-surface-white shadow-xs'
                        : 'text-outline hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    🟢 Uniforme
                  </button>
                  <button
                    onClick={() => setScopeMode('contextual')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      scopeMode === 'contextual'
                        ? 'bg-primary text-surface-white shadow-xs'
                        : 'text-outline hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    🟡 Acórdão por Polo
                  </button>
                </div>
              )}
            </div>

            {/* Right Group: Domain Filter Pills */}
            <div className="flex items-center gap-1 bg-surface-white border border-border-subtle p-1 rounded-xl shadow-2xs shrink-0">
              <span className="text-[9px] uppercase font-bold text-outline px-1.5 flex items-center gap-1">
                <Filter className="w-3 h-3 text-secondary" /> DOMÍNIOS:
              </span>
              {['Todos os Domínios', 'Geral', 'Académico', 'Financeiro', 'Utilizadores', 'Administração'].map((domain) => {
                const label = domain === 'Todos os Domínios' ? 'Todos' : domain;
                const isSelected = domainFilter === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => setDomainFilter(domain)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-surface-white shadow-2xs'
                        : 'text-outline hover:text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body (Takes Remaining Fixed Space) */}
        <div className="p-3 overflow-y-auto flex-1 min-h-0 text-xs">
          {/* Global / Uniform Matrix Panel */}
          {(scopeType === 'global' || scopeMode === 'uniform') ? (
            <div className="border border-border-subtle rounded-xl bg-surface-white shadow-2xs overflow-hidden h-full flex flex-col">
              <div className="px-3 py-2 bg-secondary text-surface-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="font-bold text-xs">
                    {scopeType === 'global' ? '🌐 Matriz Institucional Global' : '🌐 Matriz Uniforme (Todas as Estruturas Selecionadas)'}
                  </span>
                </div>
                <span className="bg-surface-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {((Object.values(structureMatrices['global'] || {}) as Set<Operation>[]).reduce((acc, curr) => acc + curr.size, 0))} regras
                </span>
              </div>

              <div className="p-2 bg-surface-white flex-1 min-h-0 overflow-y-auto">
                <div className="border border-border-subtle rounded-lg h-full overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-border-subtle text-[8px]">
                      <tr>
                        <th className="px-2 py-1.5 font-bold text-primary min-w-[170px]">MÓDULO / RECURSO</th>
                        {OPERATIONS.map((op) => (
                          <th key={op} className="px-1 py-1.5 text-center font-bold text-outline min-w-[60px]">
                            {op}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredResources.map((res) => {
                        const set = (structureMatrices['global'] || {})[res.id] || new Set();
                        const isAll = set.size === OPERATIONS.length;
                        return (
                          <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-2 py-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-outline leading-none block">{res.module}</span>
                                  <span className="font-bold text-primary text-[10px] leading-tight">{res.name}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleResourceAll('global', res.id)}
                                  className="text-[8px] text-secondary hover:underline font-semibold cursor-pointer"
                                >
                                  [{isAll ? 'Desmarcar' : 'Marcar'}]
                                </button>
                              </div>
                            </td>

                            {OPERATIONS.map((op) => {
                              const checked = set.has(op);
                              return (
                                <td key={op} className="px-1 py-1 text-center">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleMatrixCell('global', res.id, op)}
                                    className="w-3 h-3 rounded border-border-subtle text-success focus:ring-success cursor-pointer"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Ultra-Compact Accordion List View per Polo */
            <div className="border border-border-subtle rounded-xl divide-y divide-border-subtle bg-surface-white overflow-hidden shadow-2xs">
              {structures.map((s) => {
                const isSelected = selectedStructures.includes(s.id);
                const isExpanded = expandedAccordions[s.id] === true && isSelected;
                const itemMatrix = structureMatrices[s.id] || {};
                const rulesCount = (Object.values(itemMatrix) as Set<Operation>[]).reduce((acc, curr) => acc + curr.size, 0);

                return (
                  <div key={s.id} className="transition-all">
                    {/* Compact Single-Row Accordion Header */}
                    <div
                      className={`px-3 py-1.5 flex items-center justify-between transition-colors text-left select-none ${
                        isSelected
                          ? isExpanded
                            ? 'bg-secondary/10 border-l-4 border-l-secondary text-primary'
                            : 'bg-surface-white hover:bg-surface-container-low/40 text-primary'
                          : 'bg-surface-container-low/20 text-outline opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStructureSelection(s.id)}
                          className="w-3.5 h-3.5 rounded border-border-subtle text-secondary focus:ring-secondary cursor-pointer"
                        />
                        <button
                          onClick={() => isSelected && toggleAccordion(s.id)}
                          disabled={!isSelected}
                          className="flex items-center gap-2 cursor-pointer focus:outline-none disabled:cursor-not-allowed"
                        >
                          {isSelected ? (
                            isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-outline" />
                            )
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-outline/40" />
                          )}

                          <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-secondary' : 'text-outline/50'}`} />
                          <span className="font-bold text-xs text-primary">{s.nome}</span>
                          <span className="text-[10px] text-outline">({s.codigo})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span
                            onClick={() => toggleAccordion(s.id)}
                            className="px-2 py-0.5 rounded text-[9px] font-bold bg-secondary/10 text-secondary border border-secondary/20 cursor-pointer"
                          >
                            {rulesCount} regras ativas
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Accordion Body (Matrix Table) */}
                    {isSelected && isExpanded && (
                      <div className="p-2 border-t border-border-subtle bg-surface-white">
                        <div className="overflow-x-auto border border-border-subtle rounded-lg max-h-[280px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-border-subtle text-[8px]">
                              <tr>
                                <th className="px-2 py-1.5 font-bold text-primary min-w-[170px]">MÓDULO / RECURSO</th>
                                {OPERATIONS.map((op) => (
                                  <th key={op} className="px-1 py-1.5 text-center font-bold text-outline min-w-[60px]">
                                    {op}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                              {filteredResources.map((res) => {
                                const set = itemMatrix[res.id] || new Set();
                                const isAll = set.size === OPERATIONS.length;
                                return (
                                  <tr key={res.id} className="hover:bg-surface-container-low/30 transition-colors">
                                    <td className="px-2 py-1">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <span className="text-[7px] uppercase font-bold text-outline leading-none block">{res.module}</span>
                                          <span className="font-bold text-primary text-[10px] leading-tight">{res.name}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => toggleResourceAll(s.id, res.id)}
                                          className="text-[8px] text-secondary hover:underline font-semibold cursor-pointer"
                                        >
                                          [{isAll ? 'Desmarcar' : 'Marcar'}]
                                        </button>
                                      </div>
                                    </td>

                                    {OPERATIONS.map((op) => {
                                      const checked = set.has(op);
                                      return (
                                        <td key={op} className="px-1 py-1 text-center">
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleMatrixCell(s.id, res.id, op)}
                                            className="w-3 h-3 rounded border-border-subtle text-success focus:ring-success cursor-pointer"
                                          />
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Actions (Fixed Height) */}
        <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-white flex justify-between items-center shrink-0">
          <button
            onClick={onBack}
            className="border border-border-subtle px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-surface-container transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="bg-secondary text-surface-white px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-secondary/90 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Guardar Permissões
          </button>
        </div>
      </div>
    </div>
  );
};
