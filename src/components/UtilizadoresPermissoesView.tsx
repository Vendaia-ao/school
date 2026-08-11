import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { PERMISSIONS_CATALOG, PermissionLevel } from '../permissionsCatalog';
import { ShieldCheck, Users, UserPlus, UserCog, KeyRound, ScrollText, Plus, Search, CreditCard as Edit3, Trash2, Power, X, TriangleAlert as AlertTriangle, FileText, ChevronRight } from 'lucide-react';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'utilizadores' | 'grupos' | 'permissoes' | 'auditoria';

interface UserItem {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  grupo: string;
  estado: 'Ativo' | 'Inativo' | 'Bloqueado';
  ultimoAcesso: string;
  criado: string;
  avatar?: string;
}

interface GroupItem {
  id: string;
  nome: string;
  descricao: string;
  membros: number;
  estado: 'Ativo' | 'Inativo';
  permissoes: number;
}

interface LogItem {
  id: string;
  utilizador: string;
  acao: string;
  modulo: string;
  ip: string;
  data: string;
  hora: string;
  nivel: 'Info' | 'Aviso' | 'Crítico';
}

const initialUsers: UserItem[] = [
  { id: 'u1', nome: 'Sara Silva', email: 'sara.silva@vendaia.edu', perfil: 'Administrador', grupo: 'Direção Geral', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 09:15', criado: '15 Jan 2025' },
  { id: 'u2', nome: 'Carlos Mendes', email: 'carlos.mendes@vendaia.edu', perfil: 'Gestor Académico', grupo: 'Secretaria Académica', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 08:42', criado: '03 Fev 2025' },
  { id: 'u3', nome: 'João Pinto', email: 'joao.pinto@vendaia.edu', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 16:30', criado: '12 Fev 2025' },
  { id: 'u4', nome: 'Miguel Ângelo', email: 'miguel.angelo@vendaia.edu', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 14:20', criado: '20 Fev 2025' },
  { id: 'u5', nome: 'Ana Lopes', email: 'ana.lopes@vendaia.edu', perfil: 'Tesoureiro', grupo: 'Serviços Financeiros', estado: 'Ativo', ultimoAcesso: '08 Ago 2026, 11:10', criado: '05 Mar 2025' },
  { id: 'u6', nome: 'Rui Costa', email: 'rui.costa@vendaia.edu', perfil: 'Bibliotecário', grupo: 'Biblioteca', estado: 'Inativo', ultimoAcesso: '15 Jul 2026, 10:00', criado: '10 Mar 2025' },
  { id: 'u7', nome: 'Marta Gomes', email: 'marta.gomes@vendaia.edu', perfil: 'Gestor RH', grupo: 'Recursos Humanos', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 15:45', criado: '18 Mar 2025' },
  { id: 'u8', nome: 'Pedro Santos', email: 'pedro.santos@vendaia.edu', perfil: 'Editor CMS', grupo: 'Comunicação', estado: 'Ativo', ultimoAcesso: '10 Ago 2026, 07:30', criado: '22 Mar 2025' },
  { id: 'u9', nome: 'Domingos Henriques', email: 'domingoshenriques1@ispozango.com', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo', ultimoAcesso: '09 Ago 2026, 13:15', criado: '01 Abr 2025' },
  { id: 'u10', nome: 'Lúcia Pereira', email: 'lucia.pereira@vendaia.edu', perfil: 'Rececionista', grupo: 'Receção', estado: 'Bloqueado', ultimoAcesso: '10 Jun 2026, 09:00', criado: '15 Abr 2025' },
];

const initialGroups: GroupItem[] = [
  { id: 'g1', nome: 'Direção Geral', descricao: 'Acesso total ao sistema e todas as configurações', membros: 3, estado: 'Ativo', permissoes: 48 },
  { id: 'g2', nome: 'Secretaria Académica', descricao: 'Gestão de estudantes, matrículas e documentos', membros: 5, estado: 'Ativo', permissoes: 32 },
  { id: 'g3', nome: 'Corpo Docente', descricao: 'Professores com acesso a turmas, notas e assiduidade', membros: 28, estado: 'Ativo', permissoes: 18 },
  { id: 'g4', nome: 'Serviços Financeiros', descricao: 'Tesouraria, faturação e relatórios financeiros', membros: 4, estado: 'Ativo', permissoes: 24 },
  { id: 'g5', nome: 'Biblioteca', descricao: 'Gestão do acervo e catálogo digital', membros: 2, estado: 'Ativo', permissoes: 12 },
  { id: 'g6', nome: 'Recursos Humanos', descricao: 'Colaboradores, salários e processamento', membros: 3, estado: 'Ativo', permissoes: 22 },
  { id: 'g7', nome: 'Comunicação', descricao: 'CMS, notícias e comunicação institucional', membros: 2, estado: 'Ativo', permissoes: 14 },
  { id: 'g8', nome: 'Receção', descricao: 'Atendimento geral e marcações', membros: 2, estado: 'Inativo', permissoes: 6 },
];

const initialLogs: LogItem[] = [
  { id: 'l1', utilizador: 'Sara Silva', acao: 'Login no sistema', modulo: 'Autenticação', ip: '192.168.1.10', data: '10 Ago 2026', hora: '09:15', nivel: 'Info' },
  { id: 'l2', utilizador: 'Carlos Mendes', acao: 'Editou dados do estudante EST-2024-089', modulo: 'Gestão Académica', ip: '192.168.1.24', data: '10 Ago 2026', hora: '08:45', nivel: 'Info' },
  { id: 'l3', utilizador: 'Ana Lopes', acao: 'Emitiu fatura FAT-2026-0312', modulo: 'Tesouraria', ip: '192.168.1.35', data: '10 Ago 2026', hora: '08:30', nivel: 'Info' },
  { id: 'l4', utilizador: 'Lúcia Pereira', acao: 'Tentativa de acesso bloqueada — conta suspensa', modulo: 'Autenticação', ip: '192.168.1.52', data: '10 Ago 2026', hora: '07:50', nivel: 'Crítico' },
  { id: 'l5', utilizador: 'Pedro Santos', acao: 'Publicou notícia "Abertura de Inscrições 2026/2027"', modulo: 'CMS', ip: '192.168.1.41', data: '09 Ago 2026', hora: '17:20', nivel: 'Info' },
  { id: 'l6', utilizador: 'Sara Silva', acao: 'Alterou permissões do grupo "Receção"', modulo: 'Administração', ip: '192.168.1.10', data: '09 Ago 2026', hora: '16:00', nivel: 'Aviso' },
  { id: 'l7', utilizador: 'João Pinto', acao: 'Lançou notas da turma 10ºA — Matemática', modulo: 'Gestão Académica', ip: '192.168.1.28', data: '09 Ago 2026', hora: '14:30', nivel: 'Info' },
  { id: 'l8', utilizador: 'Marta Gomes', acao: 'Processou folha salarial — Julho 2026', modulo: 'Recursos Humanos', ip: '192.168.1.33', data: '09 Ago 2026', hora: '11:15', nivel: 'Info' },
  { id: 'l9', utilizador: 'Sara Silva', acao: 'Exportou relatório de auditoria (PDF)', modulo: 'Administração', ip: '192.168.1.10', data: '08 Ago 2026', hora: '18:00', nivel: 'Info' },
  { id: 'l10', utilizador: 'Rui Costa', acao: 'Conta desativada por inatividade (30 dias)', modulo: 'Autenticação', ip: '192.168.1.45', data: '15 Jul 2026', hora: '10:00', nivel: 'Aviso' },
];

const statusChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Ativo': 'bg-success/15 text-success',
    'Inativo': 'bg-warning/15 text-warning',
    'Bloqueado': 'bg-error/15 text-error',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

const nivelChip = (nivel: string): string => {
  const map: Record<string, string> = {
    'Info': 'bg-info/15 text-info',
    'Aviso': 'bg-warning/15 text-warning',
    'Crítico': 'bg-error/15 text-error',
  };
  return map[nivel] || 'bg-surface-container text-outline';
};

const perfilIcon = (perfil: string): string => {
  return perfil.charAt(0).toUpperCase();
};

const allScreens = PERMISSIONS_CATALOG.flatMap(m => m.screens);
const allTabKeys: string[] = PERMISSIONS_CATALOG.flatMap(m =>
  m.screens.flatMap(s => s.tabs.map(t => `${s.id}::${t}`))
);

const emptyPerms = (): Record<string, PermissionLevel> =>
  Object.fromEntries([
    ...allScreens.map(s => [s.id, 'none' as PermissionLevel]),
    ...allTabKeys.map(k => [k, 'none' as PermissionLevel]),
  ]);

const cyclePermission = (perm: PermissionLevel): PermissionLevel => {
  if (perm === 'none') return 'read';
  if (perm === 'read') return 'full';
  return 'none';
};

const permLabel = (perm: PermissionLevel): { label: string; cls: string } => {
  const map: Record<PermissionLevel, { label: string; cls: string }> = {
    'full': { label: 'Total', cls: 'bg-success/15 text-success' },
    'read': { label: 'Leitura', cls: 'bg-info/15 text-info' },
    'none': { label: '—', cls: 'bg-surface-container text-outline' },
  };
  return map[perm] || map['none'];
};

// Shared permissions panel component for modals
const PermissionsPanel: React.FC<{
  tempPermissions: Record<string, PermissionLevel>;
  setTempPermissions: React.Dispatch<React.SetStateAction<Record<string, PermissionLevel>>>;
  expandedPermModules: Set<string>;
  setExpandedPermModules: React.Dispatch<React.SetStateAction<Set<string>>>;
  title: string;
}> = ({ tempPermissions, setTempPermissions, expandedPermModules, setExpandedPermModules, title }) => (
  <div className="border border-border-subtle rounded-lg p-3 bg-surface-container-low/30">
    <div className="flex items-center justify-between mb-2">
      <span className="font-bold text-secondary uppercase text-[10px] tracking-wider">{title}</span>
      <div className="flex gap-1">
        <button type="button" onClick={() => setTempPermissions(Object.fromEntries([...allScreens.map(s => [s.id, 'full' as PermissionLevel]), ...allTabKeys.map(k => [k, 'full' as PermissionLevel])]))} className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-success/20">Marcar Tudo</button>
        <button type="button" onClick={() => setTempPermissions(emptyPerms())} className="text-[10px] bg-surface-container text-outline px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-surface-container-high">Limpar</button>
      </div>
    </div>
    <div className="max-h-56 overflow-y-auto space-y-0.5 drawer-scroll">
      {PERMISSIONS_CATALOG.map((mod) => {
        const isExpanded = expandedPermModules.has(mod.id);
        const activeCount = mod.screens.filter(s => tempPermissions[s.id] !== 'none').length;
        return (
          <div key={mod.id}>
            <button
              type="button"
              onClick={() => setExpandedPermModules(prev => {
                const ns = new Set(prev);
                if (ns.has(mod.id)) ns.delete(mod.id);
                else ns.add(mod.id);
                return ns;
              })}
              className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-surface-container-low rounded text-xs font-bold text-primary cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                {mod.label}
              </span>
              <span className="text-[10px] text-outline font-medium">{activeCount}/{mod.screens.length} telas</span>
            </button>
            {isExpanded && (
              <div className="ml-5 pl-2 border-l border-border-subtle space-y-0.5">
                {mod.screens.map((screen) => {
                  const perm = tempPermissions[screen.id] || 'none';
                  const p = permLabel(perm);
                  return (
                    <div key={screen.id} className="px-2 py-1">
                      <div className="flex items-center justify-between hover:bg-surface-container-low/50 rounded">
                        <span className="text-[11px] font-medium text-on-surface">{screen.label}</span>
                        <button
                          type="button"
                          onClick={() => setTempPermissions(prev => ({ ...prev, [screen.id]: cyclePermission(prev[screen.id] || 'none') }))}
                          className={`${p.cls} px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {p.label}
                        </button>
                      </div>
                      {screen.tabs.length > 0 && (
                        <div className="ml-3 mt-1 space-y-0.5">
                          {screen.tabs.map((tabLabel) => {
                            const tabKey = `${screen.id}::${tabLabel}`;
                            const tabPerm = tempPermissions[tabKey] || 'none';
                            const tp = permLabel(tabPerm);
                            return (
                              <div key={tabLabel} className="flex items-center justify-between hover:bg-surface-container-low/50 rounded px-1.5 py-0.5">
                                <span className="text-[10px] text-on-surface-variant flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-outline" />
                                  {tabLabel}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setTempPermissions(prev => ({ ...prev, [tabKey]: cyclePermission(prev[tabKey] || 'none') }))}
                                  className={`${tp.cls} px-1.5 py-0.5 rounded-full text-[9px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  {tp.label}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export const UtilizadoresPermissoesView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('utilizadores');
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups);
  const [logs] = useState<LogItem[]>(initialLogs);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterPerfil, setFilterPerfil] = useState('Todos');
  const [filterNivel, setFilterNivel] = useState('Todos');

  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserItem | null>(null);
  const [passwordModal, setPasswordModal] = useState<UserItem | null>(null);
  const [groupModal, setGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<GroupItem | null>(null);

  const [userForm, setUserForm] = useState({ nome: '', email: '', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo' as UserItem['estado'] });
  const [groupForm, setGroupForm] = useState({ nome: '', descricao: '', estado: 'Ativo' as GroupItem['estado'] });
  const [newPassword, setNewPassword] = useState('');

  // Permissions state: Record<groupId/userId, Record<screenId, PermissionLevel>>
  const [groupPermissions, setGroupPermissions] = useState<Record<string, Record<string, PermissionLevel>>>(() => {
    const base: Record<string, Record<string, PermissionLevel>> = {};
    const fullPerms = Object.fromEntries(allScreens.map(s => [s.id, 'full' as PermissionLevel]));
    base['g1'] = { ...fullPerms };
    base['g2'] = Object.fromEntries(allScreens.map(s => [s.id, (['estudantes', 'turmas', 'config_academicas', 'gestao_documental'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g3'] = Object.fromEntries(allScreens.map(s => [s.id, (['estudantes', 'turmas', 'professores', 'professor_portal', 'aluno_portal'].includes(s.id) ? 'read' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g4'] = Object.fromEntries(allScreens.map(s => [s.id, (['gestao_financeira'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g5'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'biblioteca' ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g6'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'rh_colaboradores' ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g7'] = Object.fromEntries(allScreens.map(s => [s.id, (['comunicacao', 'cms'].includes(s.id) ? 'full' : s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    base['g8'] = Object.fromEntries(allScreens.map(s => [s.id, (s.id === 'dashboard' ? 'read' : 'none') as PermissionLevel]));
    return base;
  });
  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, PermissionLevel>>>({});

  // Temp permissions for modal editing
  const [tempPermissions, setTempPermissions] = useState<Record<string, PermissionLevel>>(emptyPerms);
  const [expandedPermModules, setExpandedPermModules] = useState<Set<string>>(new Set());
  const [expandedMatrixScreens, setExpandedMatrixScreens] = useState<Set<string>>(new Set());

  const activeCount = users.filter((u) => u.estado === 'Ativo').length;
  const inactiveCount = users.filter((u) => u.estado === 'Inativo').length;
  const blockedCount = users.filter((u) => u.estado === 'Bloqueado').length;
  const groupCount = groups.filter((g) => g.estado === 'Ativo').length;

  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({ nome: '', email: '', perfil: 'Professor', grupo: 'Corpo Docente', estado: 'Ativo' });
    setTempPermissions(emptyPerms());
    setExpandedPermModules(new Set());
    setUserModal(true);
  };

  const openEditUser = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({ nome: user.nome, email: user.email, perfil: user.perfil, grupo: user.grupo, estado: user.estado });
    setTempPermissions(userPermissions[user.id] ? { ...userPermissions[user.id] } : emptyPerms());
    setExpandedPermModules(new Set());
    setUserModal(true);
  };

  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...userForm } : u)));
      setUserPermissions({ ...userPermissions, [editingUser.id]: tempPermissions });
      onShowToast(`Utilizador "${userForm.nome}" atualizado com sucesso!`);
    } else {
      const newUser: UserItem = {
        id: `u${Date.now()}`,
        nome: userForm.nome,
        email: userForm.email,
        perfil: userForm.perfil,
        grupo: userForm.grupo,
        estado: userForm.estado,
        ultimoAcesso: 'Nunca',
        criado: '10 Ago 2026',
      };
      setUsers([newUser, ...users]);
      setUserPermissions({ ...userPermissions, [newUser.id]: tempPermissions });
      onShowToast(`Utilizador "${userForm.nome}" criado com sucesso!`);
    }
    setUserModal(false);
  };

  const toggleUserStatus = (user: UserItem) => {
    const newEstado = user.estado === 'Ativo' ? 'Inativo' : 'Ativo';
    setUsers(users.map((u) => (u.id === user.id ? { ...u, estado: newEstado } : u)));
    onShowToast(`Utilizador "${user.nome}" ${newEstado === 'Ativo' ? 'ativado' : 'desativado'}.`);
  };

  const removeUser = () => {
    if (!confirmDeleteUser) return;
    setUsers(users.filter((u) => u.id !== confirmDeleteUser.id));
    onShowToast(`Utilizador "${confirmDeleteUser.nome}" removido.`);
    setConfirmDeleteUser(null);
  };

  const changePassword = () => {
    if (!passwordModal || !newPassword.trim()) return;
    onShowToast(`Palavra-passe de "${passwordModal.nome}" alterada com sucesso!`);
    setPasswordModal(null);
    setNewPassword('');
  };

  const openCreateGroup = () => {
    setEditingGroup(null);
    setGroupForm({ nome: '', descricao: '', estado: 'Ativo' });
    setTempPermissions(emptyPerms());
    setExpandedPermModules(new Set());
    setGroupModal(true);
  };

  const openEditGroup = (group: GroupItem) => {
    setEditingGroup(group);
    setGroupForm({ nome: group.nome, descricao: group.descricao, estado: group.estado });
    setTempPermissions(groupPermissions[group.id] ? { ...groupPermissions[group.id] } : emptyPerms());
    setExpandedPermModules(new Set());
    setGroupModal(true);
  };

  const saveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const permCount = Object.values(tempPermissions).filter(p => p !== 'none').length;
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, ...groupForm, permissoes: permCount } : g)));
      setGroupPermissions({ ...groupPermissions, [editingGroup.id]: tempPermissions });
      onShowToast(`Grupo "${groupForm.nome}" atualizado com sucesso!`);
    } else {
      const newGroup: GroupItem = {
        id: `g${Date.now()}`,
        nome: groupForm.nome,
        descricao: groupForm.descricao,
        membros: 0,
        estado: groupForm.estado,
        permissoes: permCount,
      };
      setGroups([newGroup, ...groups]);
      setGroupPermissions({ ...groupPermissions, [newGroup.id]: tempPermissions });
      onShowToast(`Grupo "${groupForm.nome}" criado com sucesso!`);
    }
    setGroupModal(false);
  };

  const toggleGroupStatus = (group: GroupItem) => {
    const newEstado = group.estado === 'Ativo' ? 'Inativo' : 'Ativo';
    setGroups(groups.map((g) => (g.id === group.id ? { ...g, estado: newEstado } : g)));
    onShowToast(`Grupo "${group.nome}" ${newEstado === 'Ativo' ? 'ativado' : 'desativado'}.`);
  };

  const removeGroup = () => {
    if (!confirmDeleteGroup) return;
    setGroups(groups.filter((g) => g.id !== confirmDeleteGroup.id));
    onShowToast(`Grupo "${confirmDeleteGroup.nome}" removido.`);
    setConfirmDeleteGroup(null);
  };

  const filteredUsers = useMemo(() => users.filter((u) => {
    const matchSearch = `${u.nome} ${u.email} ${u.perfil} ${u.grupo}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || u.estado === filterEstado;
    const matchPerfil = filterPerfil === 'Todos' || u.perfil === filterPerfil;
    return matchSearch && matchEstado && matchPerfil;
  }), [users, search, filterEstado, filterPerfil]);

  const filteredGroups = useMemo(() => groups.filter((g) => {
    const matchSearch = `${g.nome} ${g.descricao}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || g.estado === filterEstado;
    return matchSearch && matchEstado;
  }), [groups, search, filterEstado]);

  const filteredLogs = useMemo(() => logs.filter((l) => {
    const matchSearch = `${l.utilizador} ${l.acao} ${l.modulo} ${l.ip}`.toLowerCase().includes(search.toLowerCase());
    const matchNivel = filterNivel === 'Todos' || l.nivel === filterNivel;
    return matchSearch && matchNivel;
  }), [logs, search, filterNivel]);

  const perfiles = ['Todos', 'Administrador', 'Gestor Académico', 'Professor', 'Tesoureiro', 'Bibliotecário', 'Gestor RH', 'Editor CMS', 'Rececionista'];
  const activeGroups = groups.filter(g => g.estado === 'Ativo');

  return (
    <div className="mt-header-height p-4 w-full max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary stroke-[1.75]" />
          Utilizadores e Permissões
        </h1>
        <div className="flex items-center gap-2">
          {tab === 'utilizadores' && (
            <button onClick={openCreateUser} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <UserPlus className="w-4 h-4 stroke-[1.75]" />Criar Utilizador
            </button>
          )}
          {tab === 'grupos' && (
            <button onClick={openCreateGroup} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[1.75]" />Criar Grupo
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-success flex items-center justify-center"><Users className="w-5 h-5 stroke-[1.75]" /></div>
          <div><p className="text-[10px] uppercase font-bold text-outline tracking-wider">Utilizadores Ativos</p><p className="font-headline-sm text-lg font-bold text-primary">{activeCount}</p></div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-warning flex items-center justify-center"><Power className="w-5 h-5 stroke-[1.75]" /></div>
          <div><p className="text-[10px] uppercase font-bold text-outline tracking-wider">Inativos / Bloqueados</p><p className="font-headline-sm text-lg font-bold text-primary">{inactiveCount + blockedCount}</p></div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-info flex items-center justify-center"><UserCog className="w-5 h-5 stroke-[1.75]" /></div>
          <div><p className="text-[10px] uppercase font-bold text-outline tracking-wider">Grupos Ativos</p><p className="font-headline-sm text-lg font-bold text-primary">{groupCount}</p></div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-secondary flex items-center justify-center"><ScrollText className="w-5 h-5 stroke-[1.75]" /></div>
          <div><p className="text-[10px] uppercase font-bold text-outline tracking-wider">Registos de Auditoria</p><p className="font-headline-sm text-lg font-bold text-primary">{logs.length}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {([
          { key: 'utilizadores', label: 'Utilizadores', icon: <Users className="w-4 h-4" /> },
          { key: 'grupos', label: 'Grupos de Utilizadores', icon: <UserCog className="w-4 h-4" /> },
          { key: 'permissoes', label: 'Permissões', icon: <KeyRound className="w-4 h-4" /> },
          { key: 'auditoria', label: 'Auditoria & Logs', icon: <ScrollText className="w-4 h-4" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((item) => (
          <button key={item.key} onClick={() => { setTab(item.key); setSearch(''); setFilterEstado('Todos'); setFilterPerfil('Todos'); setFilterNivel('Todos'); }} className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tab === item.key ? 'bg-primary text-surface-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {/* Tab: Utilizadores */}
      {tab === 'utilizadores' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterPerfil} onChange={(e) => setFilterPerfil(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                {perfiles.map((p) => <option key={p} value={p}>{p === 'Todos' ? 'Perfil: Todos' : p}</option>)}
              </select>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                <option value="Todos">Estado: Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar utilizadores..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Utilizador</th>
                  <th className="px-3.5 py-3 text-left">Perfil</th>
                  <th className="px-3.5 py-3 text-left">Grupo</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-left">Último Acesso</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.length ? filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-surface-white flex items-center justify-center font-bold text-xs">{perfilIcon(u.nome)}</div>
                        <div><p className="font-bold text-primary">{u.nome}</p><p className="text-[11px] text-outline">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{u.perfil}</span></td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{u.grupo}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${statusChip(u.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{u.estado}</span></td>
                    <td className="px-3.5 py-3 text-outline">{u.ultimoAcesso}</td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditUser(u)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setPasswordModal(u)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Alterar palavra-passe"><KeyRound className="w-4 h-4" /></button>
                        <button onClick={() => toggleUserStatus(u)} className="p-1.5 text-outline hover:text-warning rounded hover:bg-warning/10 transition-colors cursor-pointer" title="Ativar/Desativar"><Power className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeleteUser(u)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant font-medium">Nenhum utilizador encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Grupos */}
      {tab === 'grupos' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
              <option value="Todos">Estado: Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar grupos..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Grupo</th>
                  <th className="px-3.5 py-3 text-left">Descrição</th>
                  <th className="px-3.5 py-3 text-center">Membros</th>
                  <th className="px-3.5 py-3 text-center">Permissões</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredGroups.length ? filteredGroups.map((g) => {
                  const permCount = groupPermissions[g.id] ? Object.values(groupPermissions[g.id]).filter(p => p !== 'none').length : g.permissoes;
                  return (
                    <tr key={g.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><UserCog className="w-4 h-4" /></div>
                          <span className="font-bold text-primary">{g.nome}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 text-on-surface-variant">{g.descricao}</td>
                      <td className="px-3.5 py-3 text-center font-bold text-primary">{g.membros}</td>
                      <td className="px-3.5 py-3 text-center"><span className="bg-info/10 text-info px-2 py-0.5 rounded text-[10px] font-bold">{permCount} perms</span></td>
                      <td className="px-3.5 py-3 text-center"><span className={`${statusChip(g.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{g.estado}</span></td>
                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditGroup(g)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => toggleGroupStatus(g)} className="p-1.5 text-outline hover:text-warning rounded hover:bg-warning/10 transition-colors cursor-pointer" title="Ativar/Desativar"><Power className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmDeleteGroup(g)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant font-medium">Nenhum grupo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Permissões */}
      {tab === 'permissoes' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Matriz de Permissões por Tela</h2>
            <p className="text-xs text-on-surface-variant">Clique numa célula para alternar o nível de acesso do grupo a cada tela. Use a seta ao lado do nome da tela para expandir e gerir as funcionalidades (tabs) internas individualmente.</p>
          </div>
          <div className="overflow-x-auto border border-border-subtle rounded-lg max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left sticky left-0 bg-surface-container-low min-w-[220px]">Módulo / Tela</th>
                  {activeGroups.map((g) => <th key={g.id} className="px-3.5 py-3 text-center min-w-[110px]">{g.nome}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {PERMISSIONS_CATALOG.map((mod) => (
                  <React.Fragment key={mod.id}>
                    <tr className="bg-surface-container-low/50">
                      <td colSpan={activeGroups.length + 1} className="px-3.5 py-2 font-bold text-secondary uppercase text-[10px] tracking-wider">{mod.label}</td>
                    </tr>
                    {mod.screens.map((screen) => {
                      const isScreenExpanded = expandedMatrixScreens.has(screen.id);
                      return (
                        <React.Fragment key={screen.id}>
                          <tr className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-3.5 py-3 sticky left-0 bg-surface-white">
                              <div className="flex items-center gap-1.5">
                                {screen.tabs.length > 0 && (
                                  <button
                                    onClick={() => setExpandedMatrixScreens(prev => {
                                      const ns = new Set(prev);
                                      if (ns.has(screen.id)) ns.delete(screen.id);
                                      else ns.add(screen.id);
                                      return ns;
                                    })}
                                    className="text-outline hover:text-primary cursor-pointer shrink-0"
                                    title={isScreenExpanded ? 'Recolher funcionalidades' : 'Expandir funcionalidades'}
                                  >
                                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isScreenExpanded ? 'rotate-90' : ''}`} />
                                  </button>
                                )}
                                <p className="font-bold text-primary text-xs">{screen.label}</p>
                              </div>
                              {screen.tabs.length > 0 && !isScreenExpanded && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {screen.tabs.map((t) => (
                                    <span key={t} className="text-[9px] text-outline bg-surface-container px-1.5 py-0.5 rounded">{t}</span>
                                  ))}
                                </div>
                              )}
                            </td>
                            {activeGroups.map((g) => {
                              const perm = (groupPermissions[g.id]?.[screen.id]) || 'none';
                              const p = permLabel(perm);
                              return (
                                <td key={g.id} className="px-3.5 py-3 text-center">
                                  <button
                                    onClick={() => {
                                      const newPerm = cyclePermission(perm);
                                      setGroupPermissions({
                                        ...groupPermissions,
                                        [g.id]: { ...(groupPermissions[g.id] || {}), [screen.id]: newPerm },
                                      });
                                      onShowToast(`Permissão de "${g.nome}" em "${screen.label}" alterada para ${permLabel(newPerm).label}.`);
                                    }}
                                    className={`${p.cls} px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                    title={`Clique para alternar: ${perm === 'none' ? 'Sem acesso' : perm === 'read' ? 'Leitura' : 'Total'}`}
                                  >
                                    {p.label}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                          {isScreenExpanded && screen.tabs.length > 0 && screen.tabs.map((tabLabel) => {
                            const tabKey = `${screen.id}::${tabLabel}`;
                            return (
                              <tr key={tabKey} className="hover:bg-surface-container-low/30 transition-colors bg-surface-container-low/20">
                                <td className="px-3.5 py-2 sticky left-0 bg-surface-white">
                                  <div className="flex items-center gap-1.5 pl-5">
                                    <span className="w-1 h-1 rounded-full bg-outline shrink-0" />
                                    <p className="text-[11px] text-on-surface-variant font-medium">{tabLabel}</p>
                                  </div>
                                </td>
                                {activeGroups.map((g) => {
                                  const tabPerm = (groupPermissions[g.id]?.[tabKey]) || 'none';
                                  const tp = permLabel(tabPerm);
                                  return (
                                    <td key={g.id} className="px-3.5 py-2 text-center">
                                      <button
                                        onClick={() => {
                                          const newPerm = cyclePermission(tabPerm);
                                          setGroupPermissions({
                                            ...groupPermissions,
                                            [g.id]: { ...(groupPermissions[g.id] || {}), [tabKey]: newPerm },
                                          });
                                          onShowToast(`Permissão de "${g.nome}" em "${tabLabel}" alterada para ${permLabel(newPerm).label}.`);
                                        }}
                                        className={`${tp.cls} px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                        title={`Clique para alternar: ${tabPerm === 'none' ? 'Sem acesso' : tabPerm === 'read' ? 'Leitura' : 'Total'}`}
                                      >
                                        {tp.label}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-4 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Total</span> Acesso completo (leitura, escrita, eliminação)</span>
            <span className="flex items-center gap-1"><span className="bg-info/15 text-info px-2 py-0.5 rounded-full text-[10px] font-bold">Leitura</span> Acesso de consulta apenas</span>
            <span className="flex items-center gap-1"><span className="bg-surface-container text-outline px-2 py-0.5 rounded-full text-[10px] font-bold">—</span> Sem acesso</span>
          </div>
        </div>
      )}

      {/* Tab: Auditoria & Logs */}
      {tab === 'auditoria' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterNivel} onChange={(e) => setFilterNivel(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                <option value="Todos">Nível: Todos</option>
                <option value="Info">Info</option>
                <option value="Aviso">Aviso</option>
                <option value="Crítico">Crítico</option>
              </select>
              <button onClick={() => onShowToast('Registos de auditoria exportados em PDF.')} className="border border-border-subtle px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><FileText className="w-3.5 h-3.5" />Exportar PDF</button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar logs..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Utilizador</th>
                  <th className="px-3.5 py-3 text-left">Ação</th>
                  <th className="px-3.5 py-3 text-left">Módulo</th>
                  <th className="px-3.5 py-3 text-left">IP</th>
                  <th className="px-3.5 py-3 text-left">Data</th>
                  <th className="px-3.5 py-3 text-left">Hora</th>
                  <th className="px-3.5 py-3 text-center">Nível</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredLogs.length ? filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary">{l.utilizador}</td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{l.acao}</td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{l.modulo}</span></td>
                    <td className="px-3.5 py-3 text-outline font-mono text-[11px]">{l.ip}</td>
                    <td className="px-3.5 py-3 text-outline">{l.data}</td>
                    <td className="px-3.5 py-3 text-outline">{l.hora}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${nivelChip(l.nivel)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{l.nivel}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">Nenhum registo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Utilizador */}
      {userModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-2xl p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><UserPlus className="w-5 h-5 text-secondary" />{editingUser ? `Editar Utilizador: ${editingUser.nome}` : 'Criar Utilizador'}</h2>
              <button onClick={() => setUserModal(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={saveUser} className="space-y-3 text-xs">
              <label className="block text-outline font-bold">Nome Completo<input type="text" required value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <label className="block text-outline font-bold">Email<input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">Perfil<select value={userForm.perfil} onChange={(e) => setUserForm({ ...userForm, perfil: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Administrador</option><option>Gestor Académico</option><option>Professor</option><option>Tesoureiro</option><option>Bibliotecário</option><option>Gestor RH</option><option>Editor CMS</option><option>Rececionista</option>
                </select></label>
                <label className="block text-outline font-bold">Grupo<select value={userForm.grupo} onChange={(e) => setUserForm({ ...userForm, grupo: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Direção Geral</option><option>Secretaria Académica</option><option>Corpo Docente</option><option>Serviços Financeiros</option><option>Biblioteca</option><option>Recursos Humanos</option><option>Comunicação</option><option>Receção</option>
                </select></label>
              </div>
              <label className="block text-outline font-bold">Estado<select value={userForm.estado} onChange={(e) => setUserForm({ ...userForm, estado: e.target.value as UserItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>Ativo</option><option>Inativo</option><option>Bloqueado</option>
              </select></label>

              <PermissionsPanel
                tempPermissions={tempPermissions}
                setTempPermissions={setTempPermissions}
                expandedPermModules={expandedPermModules}
                setExpandedPermModules={setExpandedPermModules}
                title="Permissões Individuais do Utilizador"
              />

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button type="button" onClick={() => setUserModal(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">{editingUser ? 'Guardar' : 'Criar Utilizador'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Alterar Palavra-passe */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><KeyRound className="w-5 h-5 text-secondary" />Alterar Palavra-passe</h2>
              <button onClick={() => { setPasswordModal(null); setNewPassword(''); }} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">A alterar a palavra-passe de <strong className="text-primary">{passwordModal.nome}</strong> ({passwordModal.email}).</p>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova palavra-passe" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none mb-3" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setPasswordModal(null); setNewPassword(''); }} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={changePassword} className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">Alterar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Utilizador */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeleteUser(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover o utilizador <strong className="text-primary">{confirmDeleteUser.nome}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteUser(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeUser} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Grupo */}
      {groupModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-2xl p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><UserCog className="w-5 h-5 text-secondary" />{editingGroup ? `Editar Grupo: ${editingGroup.nome}` : 'Criar Grupo de Utilizadores'}</h2>
              <button onClick={() => setGroupModal(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={saveGroup} className="space-y-3 text-xs">
              <label className="block text-outline font-bold">Nome do Grupo<input type="text" required value={groupForm.nome} onChange={(e) => setGroupForm({ ...groupForm, nome: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <label className="block text-outline font-bold">Descrição<textarea rows={3} value={groupForm.descricao} onChange={(e) => setGroupForm({ ...groupForm, descricao: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none resize-none" /></label>
              <label className="block text-outline font-bold">Estado<select value={groupForm.estado} onChange={(e) => setGroupForm({ ...groupForm, estado: e.target.value as GroupItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>Ativo</option><option>Inativo</option>
              </select></label>

              <PermissionsPanel
                tempPermissions={tempPermissions}
                setTempPermissions={setTempPermissions}
                expandedPermModules={expandedPermModules}
                setExpandedPermModules={setExpandedPermModules}
                title="Atribuir Permissões do Grupo"
              />

              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button type="button" onClick={() => setGroupModal(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">{editingGroup ? 'Guardar' : 'Criar Grupo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Grupo */}
      {confirmDeleteGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeleteGroup(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover o grupo <strong className="text-primary">{confirmDeleteGroup.nome}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteGroup(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeGroup} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
