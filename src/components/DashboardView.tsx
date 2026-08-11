import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Calendar,
  ChevronDown,
  Download,
  TrendingUp,
  CheckCircle2,
  MoreVertical,
  FileText,
  ListFilter,
  Receipt,
  UserPlus,
  Box,
  X,
  FileCheck
} from 'lucide-react';

interface DashboardViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView, onShowToast }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Últimos 30 Dias');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState<boolean>(false);
  const [activeChartMenu, setActiveChartMenu] = useState<'academic' | 'financial' | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const periods = ['Últimos 30 Dias', 'Este Semestre', 'Ano Letivo 23/24', 'Últimos 90 Dias'];

  const reports = [
    {
      id: 'rep-1',
      icon: ListFilter,
      colorClass: 'bg-transparent text-primary',
      title: 'Lista de Estudantes por Turma',
      description: 'Exportação completa de alunos organizados por ano letivo e turma com dados de contacto.',
      badge: 'Gerado hoje',
      type: 'Estudantes',
    },
    {
      id: 'rep-2',
      icon: FileText,
      colorClass: 'bg-transparent text-secondary',
      title: 'Pautas de Avaliação',
      description: 'Notas finais e intercalares agregadas por disciplina e professor responsável.',
      badge: 'Gerado há 2 dias',
      type: 'Académico',
    },
    {
      id: 'rep-3',
      icon: Receipt,
      colorClass: 'bg-transparent text-error',
      title: 'Relatório de Propinas em Atraso',
      description: 'Listagem de dívidas ativas ordenadas por tempo de atraso e valor total em dívida.',
      badge: 'Atualização Diária',
      type: 'Financeiro',
    },
    {
      id: 'rep-4',
      icon: Calendar,
      colorClass: 'bg-transparent text-info',
      title: 'Mapa de Assiduidade Mensal',
      description: 'Registo detalhado de faltas justificadas e injustificadas para reporte à direção.',
      badge: 'Gerado ontem',
      type: 'Assiduidade',
    },
    {
      id: 'rep-5',
      icon: UserPlus,
      colorClass: 'bg-transparent text-warning',
      title: 'Estatísticas de Novos Registos',
      description: 'Métricas de conversão de leads, origem de alunos e pipeline de novas admissões.',
      badge: 'Gerado há 1 semana',
      type: 'Admissões',
    },
    {
      id: 'rep-6',
      icon: Box,
      colorClass: 'bg-transparent text-outline',
      title: 'Inventário de Ativos Físicos',
      description: 'Contagem e estado de conservação de equipamentos informáticos e mobiliário escolar.',
      badge: 'Gerado há 1 mês',
      type: 'Património',
    },
  ];

  const handleExport = () => {
    onShowToast(`Exportando relatório consolidado (${selectedPeriod}) em formato PDF/Excel...`);
  };

  const handleGenerateReport = (reportTitle: string) => {
    setSelectedReport(reportTitle);
    onShowToast(`Relatório "${reportTitle}" gerado e disponível para transferência.`);
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-3">
      {/* KPI Cards (Faixa 1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Total Estudantes</span>
            <span className="text-2xl font-bold text-primary leading-none">1.432</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +5%
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">vs ano anterior</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between transition-all hover:shadow-md h-[68px]">
          <div className="flex flex-col justify-center">
            <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider mb-0.5">Média Global</span>
            <div className="text-2xl font-bold text-primary leading-none">14.5<span className="text-sm text-outline font-medium">/20</span></div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> +0.8
            </span>
            <span className="text-[9px] text-outline font-medium uppercase">vs sem. anterior</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Cobrança Financeira</span>
              <div className="flex items-center gap-2">
                <span className="text-warning font-bold text-[12px]">88%</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-warning h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span className="text-warning">Abaixo da meta (95%)</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center transition-all hover:shadow-md h-[68px]">
          <div className="w-full flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-end">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Taxa Assiduidade</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-bold text-[12px]">94.2%</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            <div className="flex justify-between text-[9px] font-medium uppercase text-outline">
              <span className="text-success flex items-center gap-0.5"><span className="material-symbols-outlined text-[10px]">check_circle</span>Estável</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar (Faixa 2) */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">Painel de Controlo</span>
        </div>
        <div className="flex items-center gap-2 relative">
          {/* Period Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center border border-border-subtle bg-surface-white rounded-md h-7 px-2 gap-1 text-on-surface shadow-sm cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '14px' }}>
                calendar_month
              </span>
              <span className="font-label-sm text-[10px] font-medium">{selectedPeriod}</span>
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '14px' }}>
                arrow_drop_down
              </span>
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute right-0 top-8 bg-surface-white border border-border-subtle rounded-md shadow-lg py-1 z-30 w-44">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setIsPeriodDropdownOpen(false);
                      onShowToast(`Filtro alterado para: ${p}`);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-surface-container-low transition-colors ${
                      selectedPeriod === p ? 'text-secondary font-bold bg-surface-container-low/50' : 'text-primary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface font-semibold text-[10px] h-7 px-2 rounded-md transition-colors gap-1 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Chart 1: Academic Performance */}
        <div className="col-span-2 bg-surface-white border border-outline-variant/30 rounded-lg shadow-sm flex flex-col p-4 h-[300px] relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-lg text-[14px] text-primary font-bold">Desempenho Académico por Ciclo</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-primary rounded-sm"></div>
                <span className="font-label-sm text-[9px] text-outline uppercase font-semibold">Ensino Básico</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-secondary rounded-sm"></div>
                <span className="font-label-sm text-[9px] text-outline uppercase font-semibold">Secundário</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveChartMenu(activeChartMenu === 'academic' ? null : 'academic')}
                  className="p-0.5 text-outline hover:text-primary transition-colors rounded cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">more_vert</span>
                </button>
                {activeChartMenu === 'academic' && (
                  <div className="absolute right-0 top-6 bg-surface-white border border-border-subtle rounded-md shadow-lg py-1 z-30 w-48 text-xs">
                    <button
                      onClick={() => {
                        setActiveChartMenu(null);
                        onShowToast('Dados exportados para CSV com sucesso!');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low"
                    >
                      Exportar dados em CSV
                    </button>
                    <button
                      onClick={() => {
                        setActiveChartMenu(null);
                        onShowToast('Ajustando escala para valores absolutos...');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low"
                    >
                      Alternar para Percentagem
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Simplified Bar Chart Representation */}
          <div className="flex-1 relative flex items-end justify-around pb-5 pt-2 border-l border-b border-border-subtle ml-4">
            {/* Y-axis labels */}
            <div className="absolute left-[-20px] top-0 bottom-5 flex flex-col justify-between font-label-sm text-[9px] text-outline">
              <span className="">20</span><span className="">15</span><span className="">10</span><span className="">5</span><span className="">0</span>
            </div>
            {/* Grid lines */}
            <div className="absolute inset-0 bottom-5 flex flex-col justify-between z-0 ml-1">
              <div className="w-full border-t border-border-subtle/50"></div>
              <div className="w-full border-t border-border-subtle/50"></div>
              <div className="w-full border-t border-border-subtle/50"></div>
              <div className="w-full border-t border-border-subtle/50"></div>
              <div></div>
            </div>
            {/* Bars */}
            <div className="z-10 flex gap-1 items-end h-[80%] relative group cursor-pointer">
              <div className="w-6 sm:w-8 bg-primary h-[70%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="w-6 sm:w-8 bg-secondary h-[65%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label-sm text-[10px] text-on-surface-variant w-max font-medium">Português</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-surface-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap pointer-events-none z-20">
                Básico: 14.0 | Secundário: 13.0
              </div>
            </div>
            <div className="z-10 flex gap-1 items-end h-[80%] relative group cursor-pointer">
              <div className="w-6 sm:w-8 bg-primary h-[60%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="w-6 sm:w-8 bg-secondary h-[55%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label-sm text-[10px] text-on-surface-variant w-max font-medium">Matemática</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-surface-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap pointer-events-none z-20">
                Básico: 12.0 | Secundário: 11.0
              </div>
            </div>
            <div className="z-10 flex gap-1 items-end h-[80%] relative group cursor-pointer">
              <div className="w-6 sm:w-8 bg-primary h-[85%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="w-6 sm:w-8 bg-secondary h-[75%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label-sm text-[10px] text-on-surface-variant w-max font-medium">Ciências</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-surface-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap pointer-events-none z-20">
                Básico: 17.0 | Secundário: 15.0
              </div>
            </div>
            <div className="z-10 flex gap-1 items-end h-[80%] relative group cursor-pointer">
              <div className="w-6 sm:w-8 bg-primary h-[75%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="w-6 sm:w-8 bg-secondary h-[80%] rounded-t-sm hover:opacity-90 transition-opacity"></div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-label-sm text-[10px] text-on-surface-variant w-max font-medium">Inglês</div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-surface-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap pointer-events-none z-20">
                Básico: 15.0 | Secundário: 16.0
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Financial */}
        <div className="col-span-1 bg-surface-white border border-outline-variant/30 rounded-lg shadow-sm flex flex-col p-4 h-[300px] relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-title-lg text-[14px] text-primary font-bold">Receita vs Dívida</h3>
            <div className="relative">
              <button
                onClick={() => setActiveChartMenu(activeChartMenu === 'financial' ? null : 'financial')}
                className="p-0.5 text-outline hover:text-primary transition-colors rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">more_vert</span>
              </button>
              {activeChartMenu === 'financial' && (
                <div className="absolute right-0 top-6 bg-surface-white border border-border-subtle rounded-md shadow-lg py-1 z-30 w-48 text-xs">
                  <button
                    onClick={() => {
                      setActiveChartMenu(null);
                      onSelectView('financeiro');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low"
                  >
                    Ver detalhes financeiros
                  </button>
                  <button
                    onClick={() => {
                      setActiveChartMenu(null);
                      onShowToast('A emitir avisos de cobrança pendentes...');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-container-low text-warning font-semibold"
                  >
                    Emitir avisos de cobrança
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* CSS Conic Gradient Donut with 12px rounded corners as specified */}
            <div
              className="relative w-32 h-32 flex items-center justify-center mb-4 rounded-12px chart-donut-box transition-transform hover:scale-105 cursor-pointer shadow-sm"
              style={{ background: 'conic-gradient(#041939 0% 88%, #e5e7eb 88% 100%)', borderRadius: '12px' }}
              onClick={() => onSelectView('financeiro')}
              title="Clique para abrir detalhes financeiros"
            >
              {/* Inner White Box */}
              <div 
                className="w-24 h-24 bg-surface-white rounded-12px chart-donut-box flex flex-col items-center justify-center shadow-inner"
                style={{ borderRadius: '12px' }}
              >
                <span className="font-label-sm text-[9px] text-outline uppercase font-semibold mb-0.5 tracking-wider">
                  RECEBIDO
                </span>
                <span className="font-headline-sm text-2xl text-primary font-bold">
                  88%
                </span>
              </div>
            </div>
            <div className="w-full flex justify-between px-2 border-t border-border-subtle pt-3">
              <div className="flex flex-col">
                <span className="font-label-sm text-[9px] text-outline font-bold uppercase mb-0.5 tracking-wider">RECEITA</span>
                <span className="font-body-md text-[13px] text-primary font-bold">€1.2M</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-label-sm text-[9px] text-warning font-bold uppercase mb-0.5 tracking-wider leading-tight text-right">EM<br />ATRASO</span>
                <span className="font-body-md text-[13px] text-primary font-bold">€145K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports Grid */}
      <div>
        <div className="flex justify-between items-center mb-3 mt-2">
          <h2 className="font-title-lg text-[14px] text-primary font-bold">Relatórios Detalhados</h2>
          <button
            onClick={() => onShowToast('A carregar catálogo completo com +15 relatórios institucionais...')}
            className="font-label-md text-xs text-secondary font-semibold hover:underline cursor-pointer"
          >
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleGenerateReport(report.title)}
              className="bg-surface-white border border-outline-variant/30 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex items-start gap-3"
            >
              <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors bg-transparent ${report.colorClass}`}>
                <report.icon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-label-md text-[12px] font-semibold text-primary mb-0.5 truncate">{report.title}</h4>
                <p className="font-body-md text-[11px] text-on-surface-variant line-clamp-2 mb-1.5 leading-tight">{report.description}</p>
                <span className="inline-block bg-surface-container-low font-label-sm text-[9px] font-medium px-1.5 py-0.5 rounded text-outline uppercase">{report.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal / Preview Banner when selected */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle p-6 max-w-lg w-full">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">description</span>
                <h3 className="font-bold text-primary text-sm">{selectedReport}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              O relatório foi processado com sucesso para o período <strong>{selectedPeriod}</strong> com base nos dados mais recentes da Vendaia School®.
            </p>

            <div className="bg-surface-container-low p-3 rounded-lg text-xs space-y-1 mb-4 border border-border-subtle">
              <div className="flex justify-between text-[11px]">
                <span className="text-outline">Estado da Geração:</span>
                <span className="font-bold text-success flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Pronto para download
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-outline">Formato do Ficheiro:</span>
                <span className="font-bold text-primary">PDF / Excel (.xlsx)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-outline">Registos Incluídos:</span>
                <span className="font-bold text-primary">1.432 Alunos</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="border border-border-subtle px-4 py-2 rounded-lg text-xs font-semibold hover:bg-surface-container"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  onShowToast(`Descarregando ${selectedReport}...`);
                  setSelectedReport(null);
                }}
                className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Descarregar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

