import React, { useState } from 'react';
import { ActiveView } from '../types';

interface HeaderNavProps {
  currentView: ActiveView;
  selectedStudentName?: string;
  onSelectView: (view: ActiveView) => void;
  onOpenNotifications?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  selectedStudentName,
  onSelectView,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header-nav fixed top-0 right-0 h-header-height flex justify-between items-center px-4 bg-surface-white/90 backdrop-blur-md z-40 border-b border-border-subtle shadow-sm transition-all duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center text-xs font-medium text-on-surface-variant">
          {currentView === 'dashboard' && (
            <span className="text-on-surface font-semibold">Dashboards › Visão Geral</span>
          )}

          {['estudantes', 'perfil', 'turmas', 'professores', 'config_academicas', 'aluno_portal', 'encarregado_portal', 'professor_portal'].includes(currentView) && (
            <>
              <span
                className="hover:text-secondary cursor-pointer transition-colors"
                onClick={() => onSelectView('estudantes')}
              >
                Gestão Académica
              </span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span
                className={`cursor-pointer transition-colors ${
                  currentView === 'perfil' ? 'hover:text-secondary' : 'text-on-surface font-semibold'
                }`}
                onClick={() => onSelectView('estudantes')}
              >
                {currentView === 'estudantes'
                  ? 'Estudantes'
                  : currentView === 'turmas'
                  ? 'Turmas'
                  : currentView === 'professores'
                  ? 'Professores'
                  : currentView === 'config_academicas'
                  ? 'Configurações Académicas'
                  : currentView === 'aluno_portal'
                  ? 'Portal do Aluno'
                  : currentView === 'encarregado_portal'
                  ? 'Portal do Encarregado'
                  : currentView === 'professor_portal'
                  ? 'Portal do Professor'
                  : 'Estudantes'}
              </span>
              {currentView === 'perfil' && (
                <>
                  <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
                  <span className="text-on-surface font-semibold truncate max-w-[200px]">
                    {selectedStudentName || 'Perfil de Estudante'}
                  </span>
                </>
              )}
            </>
          )}

          {['servicos_produtos', 'cantina'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Serviços Institucionais</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">
                {currentView === 'servicos_produtos' ? 'Gerir Serviços e Produtos' : 'Gerir Cantina'}
              </span>
            </>
          )}

          {['tesouraria', 'gestao_financeira', 'financeiro'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Gestão Financeira</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">
                {currentView === 'tesouraria' ? 'Tesouraria / Facturação' : 'Gestão Financeira'}
              </span>
            </>
          )}

          {['rh_colaboradores'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Recursos Humanos</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">Colaboradores</span>
            </>
          )}

          {['gestao_documental', 'documental'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Gestão Documental</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">Arquivo Documental</span>
            </>
          )}

          {['comunicacao', 'cms'].includes(currentView) && (
            <>
              <span
                className="hover:text-secondary cursor-pointer transition-colors"
                onClick={() => onSelectView('comunicacao')}
              >
                Comunicação
              </span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">
                {currentView === 'comunicacao' ? 'Comunicação' : 'CMS (Website)'}
              </span>
            </>
          )}

          {['utilizadores_permissoes', 'config_instituicao', 'administracao'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Administração</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">
                {currentView === 'config_instituicao' ? 'Configurações da Instituição' : 'Utilizadores e Permissões'}
              </span>
            </>
          )}

          {['biblioteca'].includes(currentView) && (
            <>
              <span className="text-on-surface-variant">Biblioteca Digital</span>
              <span className="material-symbols-outlined text-[14px] mx-1 text-outline">chevron_right</span>
              <span className="text-on-surface font-semibold">Acervo & Catálogo</span>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        {/* Academic Year Badge */}
        <div className="hidden lg:flex items-center px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant mr-2">
          <span className="text-[10px] font-bold text-outline uppercase tracking-tight">Ano Letivo: 23/24</span>
        </div>

        {/* Notifications & Action Icons */}
        <div className="flex items-center gap-0.5 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-on-surface-variant hover:text-secondary transition-colors p-1.5 rounded-full hover:bg-surface-variant/50"
            title="Notificações"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface-white"></span>
          </button>

          {/* Notifications Dropdown Popup */}
          {showNotifications && (
            <div className="absolute top-10 right-0 w-80 bg-surface-white border border-border-subtle rounded-lg shadow-xl z-50 p-3 text-xs">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2 mb-2">
                <span className="font-bold text-primary text-sm">Notificações</span>
                <span className="text-[10px] text-secondary font-semibold hover:underline cursor-pointer">
                  Marcar como lidas
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 bg-surface-container-low rounded border-l-2 border-error flex gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">credit_card</span>
                  <div>
                    <p className="font-semibold text-on-surface">14 Propinas Pendentes</p>
                    <p className="text-[10px] text-on-surface-variant">Lembretes automáticos prontos para envio.</p>
                  </div>
                </div>
                <div className="p-2 bg-surface-container-low rounded border-l-2 border-warning flex gap-2">
                  <span className="material-symbols-outlined text-warning text-[16px]">description</span>
                  <div>
                    <p className="font-semibold text-on-surface">3 Documentos Expirados</p>
                    <p className="text-[10px] text-on-surface-variant">Atualização necessária para matrícula.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => alert('Central de Ajuda Vendaia School®')}
            className="text-on-surface-variant hover:text-secondary transition-colors p-1.5 rounded-full hover:bg-surface-variant/50"
            title="Ajuda"
          >
            <span className="material-symbols-outlined">help</span>
          </button>

          <button
            onClick={() => onSelectView('administracao')}
            className="text-on-surface-variant hover:text-secondary transition-colors p-1.5 rounded-full hover:bg-surface-variant/50"
            title="Aplicações"
          >
            <span className="material-symbols-outlined">apps</span>
          </button>
        </div>

        <div className="h-6 w-px bg-border-subtle mx-2"></div>

        {/* User Profile Avatar Menu */}
        <div className="relative cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className="relative">
            <img
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover border border-border-subtle"
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-surface-white rounded-full"></span>
          </div>
          <div className="absolute -right-1 -bottom-1 bg-surface-white rounded-full shadow-sm border border-border-subtle">
            <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
          </div>

          {showProfileMenu && (
            <div className="absolute top-10 right-0 w-56 bg-surface-white border border-border-subtle rounded-lg shadow-xl z-50 p-2 text-xs">
              <div className="p-2 border-b border-border-subtle mb-1">
                <p className="font-bold text-primary">Dra. Sara Silva</p>
                <p className="text-[10px] text-on-surface-variant">Administradora Geral</p>
                <p className="text-[10px] text-outline">sara.silva@vendaia.pt</p>
              </div>
              <button
                onClick={() => onSelectView('administracao')}
                className="w-full text-left p-2 hover:bg-surface-container rounded flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">settings</span> Configurações de Conta
              </button>
              <button
                onClick={() => alert('Sessão terminada')}
                className="w-full text-left p-2 hover:bg-error/10 text-error rounded flex items-center gap-2 font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
