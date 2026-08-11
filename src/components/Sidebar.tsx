import React, { useState } from 'react';
import { ActiveView } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isExpanded,
  onToggleExpand,
}) => {
  // State for collapsible submenus
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    academica: true,
    servicos: false,
    financeira: false,
    rh: false,
    documental: false,
    comunicacao: false,
    admin: false,
  });

  const toggleModule = (moduleKey: string) => {
    if (!isExpanded) {
      onToggleExpand();
    }
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const handleSelectScreen = (view: ActiveView) => {
    if (!isExpanded) {
      onToggleExpand();
    }
    onSelectView(view);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full flex flex-col bg-primary-container border-r border-outline-variant z-50 transition-all duration-300 ${
        isExpanded ? 'sidebar-expanded w-[260px]' : 'sidebar-collapsed w-[80px]'
      }`}
      id="sidebar"
    >
      {/* Header / Brand */}
      <div className="p-4 border-b border-on-primary-container/20 flex items-center justify-between menu-header h-[72px] shrink-0">
        {isExpanded ? (
          <div
            className="sidebar-text truncate cursor-pointer select-none"
            onClick={() => onSelectView('dashboard')}
          >
            <h1 className="font-title-lg text-title-lg font-bold text-on-primary mb-0.5 tracking-tight">
              Vendaia School®
            </h1>
            <p className="font-label-sm text-[11px] text-on-primary-container">
              Plataforma de Gestão Escolar
            </p>
          </div>
        ) : null}
        <button
          className="text-on-primary-container hover:text-on-primary p-1.5 rounded hover:bg-on-primary-container/20 transition-colors mx-auto cursor-pointer"
          onClick={onToggleExpand}
          title={isExpanded ? 'Recolher Menu' : 'Expandir Menu'}
        >
          <span className="material-symbols-outlined text-[18px]">menu</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {/* MÓDULO 1: DASHBOARDS */}
        <div>
          <button
            onClick={() => handleSelectScreen('dashboard')}
            className={`w-full flex items-center gap-2 px-3 py-2 transition-colors rounded menu-item text-left cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            {isExpanded && <span className="font-label-md sidebar-text">Dashboard</span>}
          </button>
        </div>

        {/* MÓDULO 2: GESTÃO ACADÉMICA */}
        <div>
          <button
            onClick={() => toggleModule('academica')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['estudantes', 'perfil', 'turmas', 'professores', 'config_academicas', 'aluno_portal', 'encarregado_portal', 'professor_portal'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Gestão Académica"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">school</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Académica</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.academica ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.academica && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('estudantes')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'estudantes' || currentView === 'perfil'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Estudantes
              </button>
              <button
                onClick={() => handleSelectScreen('turmas')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'turmas'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                2. Turmas
              </button>
              <button
                onClick={() => handleSelectScreen('professores')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'professores'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                3. Professores
              </button>
              <button
                onClick={() => handleSelectScreen('config_academicas')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'config_academicas'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                4. Config. Académicas
              </button>
              <button
                onClick={() => handleSelectScreen('aluno_portal')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'aluno_portal'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                5. Portal do Aluno
              </button>
              <button
                onClick={() => handleSelectScreen('encarregado_portal')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'encarregado_portal'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                6. Portal Encarregado
              </button>
              <button
                onClick={() => handleSelectScreen('professor_portal')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'professor_portal'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                7. Portal Professor
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 3: BIBLIOTECA DIGITAL */}
        <div>
          <button
            onClick={() => handleSelectScreen('biblioteca')}
            className={`w-full flex items-center gap-2 px-3 py-2 transition-colors rounded menu-item text-left cursor-pointer ${
              currentView === 'biblioteca'
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Biblioteca Digital"
          >
            <span className="material-symbols-outlined text-[18px]">local_library</span>
            {isExpanded && <span className="font-label-md sidebar-text truncate">Biblioteca Digital</span>}
          </button>
        </div>

        {/* MÓDULO 4: SERVIÇOS INSTITUCIONAIS */}
        <div>
          <button
            onClick={() => toggleModule('servicos')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['servicos_produtos', 'cantina'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Serviços Institucionais"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Serviços Institucionais</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.servicos ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.servicos && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('servicos_produtos')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'servicos_produtos'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Serviços e Produtos
              </button>
              <button
                onClick={() => handleSelectScreen('cantina')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'cantina'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                2. Gerir Cantina
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 5: GESTÃO FINANCEIRA */}
        <div>
          <button
            onClick={() => toggleModule('financeira')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['tesouraria', 'gestao_financeira', 'financeiro'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Gestão Financeira"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Financeira</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.financeira ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.financeira && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('tesouraria')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'tesouraria'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Tesouraria / Facturação
              </button>
              <button
                onClick={() => handleSelectScreen('gestao_financeira')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'gestao_financeira' || currentView === 'financeiro'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                2. Gestão Financeira
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 6: RECURSOS HUMANOS */}
        <div>
          <button
            onClick={() => toggleModule('rh')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['rh_colaboradores'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Recursos Humanos"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">badge</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Recursos Humanos</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.rh ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.rh && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('rh_colaboradores')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'rh_colaboradores'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Colaboradores
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 7: GESTÃO DOCUMENTAL */}
        <div>
          <button
            onClick={() => toggleModule('documental')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['gestao_documental', 'documental'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Gestão Documental"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Gestão Documental</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.documental ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.documental && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('gestao_documental')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'gestao_documental' || currentView === 'documental'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Arquivo Documental
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 8: COMUNICAÇÃO INSTITUCIONAL */}
        <div>
          <button
            onClick={() => toggleModule('comunicacao')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['comunicacao', 'cms'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Comunicação Institucional"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">forum</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Comunicação</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.comunicacao ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.comunicacao && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('comunicacao')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'comunicacao'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Comunicação
              </button>
              <button
                onClick={() => handleSelectScreen('cms')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'cms'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                2. CMS (Website)
              </button>
            </div>
          )}
        </div>

        {/* MÓDULO 9: ADMINISTRAÇÃO DA PLATAFORMA */}
        <div>
          <button
            onClick={() => toggleModule('admin')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded cursor-pointer menu-item transition-all text-left ${
              ['utilizadores_permissoes', 'config_instituicao', 'administracao'].includes(currentView)
                ? 'text-on-primary bg-on-primary-container/20 border-l-2 border-secondary font-semibold'
                : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
            }`}
            title="Administração da Plataforma"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              {isExpanded && <span className="font-label-md sidebar-text truncate">Administração</span>}
            </div>
            {isExpanded && (
              <span className={`material-symbols-outlined text-[18px] transition-transform ${openModules.admin ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            )}
          </button>

          {isExpanded && openModules.admin && (
            <div className="sidebar-text ml-5 pl-2 border-l border-on-primary-container/15 my-1 space-y-0.5">
              <button
                onClick={() => handleSelectScreen('utilizadores_permissoes')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'utilizadores_permissoes' || currentView === 'administracao'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                1. Utilizadores & Permissões
              </button>
              <button
                onClick={() => handleSelectScreen('config_instituicao')}
                className={`block w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                  currentView === 'config_instituicao'
                    ? 'text-secondary font-bold bg-on-primary-container/20'
                    : 'text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20'
                }`}
              >
                2. Config. Instituição
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Support & Logout */}
      <div className="border-t border-on-primary-container/20 p-2 shrink-0">
        <button
          onClick={() => alert('Atendimento de Suporte Técnico Vendaia School® ativo. Contacto: suporte@vendaia.pt')}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20 transition-colors rounded menu-item text-left cursor-pointer"
          title="Suporte"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          {isExpanded && <span className="font-label-md sidebar-text">Suporte</span>}
        </button>
        <button
          onClick={() => alert('Sessão terminada com sucesso.')}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-on-primary-container hover:text-on-primary hover:bg-on-primary-container/20 transition-colors rounded menu-item text-left cursor-pointer"
          title="Sair"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {isExpanded && <span className="font-label-md sidebar-text">Sair</span>}
        </button>
      </div>
    </aside>
  );
};
