import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Building2, FileText, Globe, Lock, Database, Plug, Code as Code2, Settings, Save, Upload, Download, RefreshCw, Image as ImageIcon, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, X, Eye, Trash2, Plus, Key, Shield, HardDrive } from 'lucide-react';

interface Props {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'dados' | 'templates' | 'idioma' | 'seguranca' | 'backups' | 'integracoes' | 'apis' | 'geral';

interface BackupItem {
  id: string;
  nome: string;
  data: string;
  tamanho: string;
  tipo: 'Automático' | 'Manual';
  estado: 'Concluído' | 'Em curso' | 'Falhou';
}

interface IntegrationItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  estado: 'Conectado' | 'Desconectado' | 'Erro';
}

interface ApiKeyItem {
  id: string;
  nome: string;
  chave: string;
  criada: string;
  ultimaUsada: string;
  estado: 'Ativa' | 'Inativa';
}

const initialBackups: BackupItem[] = [
  { id: 'b1', nome: 'backup_2026-08-10_03h00', data: '10 Ago 2026, 03:00', tamanho: '248 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b2', nome: 'backup_2026-08-09_03h00', data: '09 Ago 2026, 03:00', tamanho: '246 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b3', nome: 'backup_manual_2026-08-08', data: '08 Ago 2026, 14:30', tamanho: '245 MB', tipo: 'Manual', estado: 'Concluído' },
  { id: 'b4', nome: 'backup_2026-08-08_03h00', data: '08 Ago 2026, 03:00', tamanho: '244 MB', tipo: 'Automático', estado: 'Concluído' },
  { id: 'b5', nome: 'backup_2026-08-07_03h00', data: '07 Ago 2026, 03:00', tamanho: '242 MB', tipo: 'Automático', estado: 'Falhou' },
  { id: 'b6', nome: 'backup_2026-08-06_03h00', data: '06 Ago 2026, 03:00', tamanho: '240 MB', tipo: 'Automático', estado: 'Concluído' },
];

const integrations: IntegrationItem[] = [
  { id: 'i1', nome: 'Supabase', descricao: 'Base de dados e autenticação', categoria: 'Infraestrutura', estado: 'Conectado' },
  { id: 'i2', nome: 'Stripe', descricao: 'Processamento de pagamentos online', categoria: 'Financeiro', estado: 'Conectado' },
  { id: 'i3', nome: 'Twilio SMS', descricao: 'Envio de SMS e notificações', categoria: 'Comunicação', estado: 'Conectado' },
  { id: 'i4', nome: 'Mailchimp', descricao: 'Newsletter e email marketing', categoria: 'Comunicação', estado: 'Conectado' },
  { id: 'i5', nome: 'Google Analytics', descricao: 'Analytics do portal web', categoria: 'Web', estado: 'Conectado' },
  { id: 'i6', nome: 'Multicaixa Express', descricao: 'Pagamentos via Multicaixa Express', categoria: 'Financeiro', estado: 'Desconectado' },
  { id: 'i7', nome: 'Microsoft Graph', descricao: 'Integração com Microsoft 365', categoria: 'Produtividade', estado: 'Desconectado' },
  { id: 'i8', nome: 'WhatsApp Business API', descricao: 'Envio de mensagens via WhatsApp', categoria: 'Comunicação', estado: 'Erro' },
];

const initialApiKeys: ApiKeyItem[] = [
  { id: 'k1', nome: 'Portal Web (Produção)', chave: 'vs_prod_••••••••••••3f8a', criada: '15 Jan 2025', ultimaUsada: '10 Ago 2026', estado: 'Ativa' },
  { id: 'k2', nome: 'App Mobile', chave: 'vs_mob_••••••••••••7c2d', criada: '20 Fev 2025', ultimaUsada: '09 Ago 2026', estado: 'Ativa' },
  { id: 'k3', nome: 'Integração Stripe', chave: 'vs_int_••••••••••••9e1f', criada: '05 Mar 2025', ultimaUsada: '10 Ago 2026', estado: 'Ativa' },
  { id: 'k4', nome: 'Webhook SMS', chave: 'vs_wh_••••••••••••4b6a', criada: '10 Mar 2025', ultimaUsada: '01 Ago 2026', estado: 'Inativa' },
];

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'dados', label: 'Dados Institucionais', icon: <Building2 className="w-4 h-4" /> },
  { key: 'templates', label: 'Templates de Documentos', icon: <FileText className="w-4 h-4" /> },
  { key: 'idioma', label: 'Idioma', icon: <Globe className="w-4 h-4" /> },
  { key: 'seguranca', label: 'Segurança', icon: <Lock className="w-4 h-4" /> },
  { key: 'backups', label: 'Backups', icon: <Database className="w-4 h-4" /> },
  { key: 'integracoes', label: 'Integrações', icon: <Plug className="w-4 h-4" /> },
  { key: 'apis', label: 'APIs', icon: <Code2 className="w-4 h-4" /> },
  { key: 'geral', label: 'Configurações Gerais', icon: <Settings className="w-4 h-4" /> },
];

const estadoChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Concluído': 'bg-success/15 text-success',
    'Em curso': 'bg-warning/15 text-warning',
    'Falhou': 'bg-error/15 text-error',
    'Conectado': 'bg-success/15 text-success',
    'Desconectado': 'bg-surface-container text-outline',
    'Erro': 'bg-error/15 text-error',
    'Ativa': 'bg-success/15 text-success',
    'Inativa': 'bg-warning/15 text-warning',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

export const ConfigInstituicaoView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('dados');
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [apiModal, setApiModal] = useState(false);
  const [confirmDeleteApi, setConfirmDeleteApi] = useState<ApiKeyItem | null>(null);
  const [confirmDeleteBackup, setConfirmDeleteBackup] = useState<BackupItem | null>(null);
  const [restoreBackup, setRestoreBackup] = useState<BackupItem | null>(null);
  const [newApiName, setNewApiName] = useState('');

  const templates = [
    { id: 't1', nome: 'Declaração de Matrícula', tipo: 'PDF', atualizado: '05 Ago 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't2', nome: 'Certificado de Conclusão', tipo: 'PDF', atualizado: '22 Jul 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't3', nome: 'Recibo de Propina', tipo: 'PDF', atualizado: '10 Jul 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't4', nome: 'Cartão do Estudante', tipo: 'PDF', atualizado: '15 Jun 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't5', nome: 'Fatura', tipo: 'PDF', atualizado: '01 Jun 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't6', nome: 'Boletim de Notas', tipo: 'PDF', atualizado: '20 Mai 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't7', nome: 'Contrato de Prestação de Serviços', tipo: 'DOCX', atualizado: '10 Mai 2026', icon: <FileText className="w-5 h-5" /> },
    { id: 't8', nome: 'Termo de Responsabilidade', tipo: 'DOCX', atualizado: '05 Abr 2026', icon: <FileText className="w-5 h-5" /> },
  ];

  const createApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const newKey: ApiKeyItem = {
      id: `k${Date.now()}`,
      nome: newApiName,
      chave: `vs_prod_••••••••••••${Math.random().toString(16).slice(2, 6)}`,
      criada: '10 Ago 2026',
      ultimaUsada: 'Nunca',
      estado: 'Ativa',
    };
    setApiKeys([newKey, ...apiKeys]);
    onShowToast(`API Key "${newApiName}" criada com sucesso!`);
    setApiModal(false);
    setNewApiName('');
  };

  const removeApiKey = () => {
    if (!confirmDeleteApi) return;
    setApiKeys(apiKeys.filter((k) => k.id !== confirmDeleteApi.id));
    onShowToast(`API Key "${confirmDeleteApi.nome}" removida.`);
    setConfirmDeleteApi(null);
  };

  const removeBackup = () => {
    if (!confirmDeleteBackup) return;
    setBackups(backups.filter((b) => b.id !== confirmDeleteBackup.id));
    onShowToast(`Backup "${confirmDeleteBackup.nome}" removido.`);
    setConfirmDeleteBackup(null);
  };

  const doRestore = () => {
    if (!restoreBackup) return;
    onShowToast(`Restauro a partir de "${restoreBackup.nome}" iniciado. O sistema será reiniciado.`);
    setRestoreBackup(null);
  };

  const createBackup = () => {
    const newBackup: BackupItem = {
      id: `b${Date.now()}`,
      nome: `backup_manual_${new Date().toISOString().slice(0, 10)}`,
      data: '10 Ago 2026, 16:00',
      tamanho: '248 MB',
      tipo: 'Manual',
      estado: 'Concluído',
    };
    setBackups([newBackup, ...backups]);
    onShowToast('Backup manual criado com sucesso!');
  };

  return (
    <div className="mt-header-height p-4 w-full max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary stroke-[1.75]" />
          Configurações da Instituição
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)} className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${tab === item.key ? 'bg-primary text-surface-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {/* Tab: Dados Institucionais */}
      {tab === 'dados' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Dados Institucionais</h2>
            <p className="text-xs text-on-surface-variant">Informações gerais da instituição apresentadas em documentos e no portal.</p>
          </div>
          {/* Logótipo */}
          <div className="mb-6 border border-border-subtle rounded-lg p-4">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-3 border-b border-border-subtle/50 pb-1">Logótipo e Identidade Visual</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded bg-primary text-surface-white flex items-center justify-center font-bold text-2xl">VS</div>
              <div className="flex flex-col gap-2">
                <button onClick={() => onShowToast('Seletor de logótipo aberto.')} className="bg-secondary text-surface-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all"><Upload className="w-3.5 h-3.5" />Carregar Logótipo</button>
                <span className="text-[10px] text-outline">PNG, SVG ou JPG até 2MB. Recomendado: 512x512px.</span>
              </div>
            </div>
          </div>
          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-outline font-bold text-xs mb-1">Nome da Instituição</label><input type="text" defaultValue="Vendaia School®" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Designação Oficial</label><input type="text" defaultValue="Instituto Vendaia de Ensino Secundário" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">NIF / Identificação Fiscal</label><input type="text" defaultValue="5412 0098 3" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Telefone Geral</label><input type="text" defaultValue="+244 923 000 000" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Email Geral</label><input type="email" defaultValue="geral@vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Website</label><input type="text" defaultValue="www.vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-outline font-bold text-xs mb-1">Morada</label><input type="text" defaultValue="Av. Comandante Valódia, nº 120, Luanda, Angola" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Ano de Fundação</label><input type="text" defaultValue="1998" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Diretor(a) Geral</label><input type="text" defaultValue="Dra. Sara Silva" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-subtle mt-4">
            <button onClick={() => onShowToast('Dados institucionais guardados com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm"><Save className="w-4 h-4" />Guardar Dados</button>
          </div>
        </div>
      )}

      {/* Tab: Templates de Documentos */}
      {tab === 'templates' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Templates de Documentos</h2>
              <p className="text-xs text-on-surface-variant">Modelos de documentos usados pelo sistema para emissão automática.</p>
            </div>
            <button onClick={() => onShowToast('Seletor de ficheiro de template aberto.')} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"><Plus className="w-4 h-4" />Carregar Template</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((t) => (
              <div key={t.id} className="border border-border-subtle rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center">{t.icon}</div>
                  <div>
                    <p className="font-bold text-primary text-xs">{t.nome}</p>
                    <p className="text-[11px] text-outline">{t.tipo} • Atualizado {t.atualizado}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onShowToast(`Pré-visualização do template "${t.nome}" aberta.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Pré-visualizar"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onShowToast(`Download do template "${t.nome}" iniciado.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Idioma */}
      {tab === 'idioma' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Idioma e Localização</h2>
            <p className="text-xs text-on-surface-variant">Configurações de idioma, formatação de datas e moeda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Idioma Principal</label>
              <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>Português (Angola) — pt-AO</option>
                <option>Português (Portugal) — pt-PT</option>
                <option>Português (Brasil) — pt-BR</option>
                <option>English — en-GB</option>
                <option>Français — fr-FR</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Idiomas Secundários (Ativos)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /> English</label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" /> Français</label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" /> Español</label>
              </div>
            </div>
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Formato de Data</label>
              <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>DD MMM AAAA (10 Ago 2026)</option>
                <option>DD/MM/AAAA (10/08/2026)</option>
                <option>AAAA-MM-DD (2026-08-10)</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Moeda</label>
              <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>Kwanza Angolano (Kz / AOA)</option>
                <option>Euro (€ / EUR)</option>
                <option>Dólar Americano ($ / USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Fuso Horário</label>
              <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>África/Luanda (WAT, UTC+1)</option>
                <option>Europe/Lisbon (WET, UTC+0)</option>
              </select>
            </div>
            <div>
              <label className="block text-outline font-bold text-xs mb-1">Primeiro Dia da Semana</label>
              <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                <option>Segunda-feira</option>
                <option>Domingo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-subtle mt-4">
            <button onClick={() => onShowToast('Configurações de idioma guardadas com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm"><Save className="w-4 h-4" />Guardar</button>
          </div>
        </div>
      )}

      {/* Tab: Segurança */}
      {tab === 'seguranca' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Segurança</h2>
            <p className="text-xs text-on-surface-variant">Políticas de segurança, autenticação e proteção de dados.</p>
          </div>
          <div className="space-y-6">
            {/* Políticas de Palavra-passe */}
            <div>
              <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Políticas de Palavra-passe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-outline font-bold text-xs mb-1">Comprimento Mínimo</label><input type="number" defaultValue="8" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
                <div><label className="block text-outline font-bold text-xs mb-1">Expiração (dias)</label><input type="number" defaultValue="90" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
                <div><label className="block text-outline font-bold text-xs mb-1">Histórico (impede reutilização)</label><input type="number" defaultValue="5" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
                <div><label className="block text-outline font-bold text-xs mb-1">Tentativas antes de bloqueio</label><input type="number" defaultValue="5" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
              </div>
              <div className="space-y-2 mt-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Exigir letra maiúscula</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Exigir número</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Exigir caractere especial</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Forçar alteração no primeiro acesso</span></label>
              </div>
            </div>
            {/* Autenticação em 2 Fatores */}
            <div>
              <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Autenticação em 2 Fatores (2FA)</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Exigir 2FA para administradores</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Exigir 2FA para todos os utilizadores</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Permitir 2FA via SMS</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Permitir 2FA via App (Google Authenticator)</span></label>
              </div>
            </div>
            {/* Sessões */}
            <div>
              <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Gestão de Sessões</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-outline font-bold text-xs mb-1">Tempo limite de sessão (minutos)</label><input type="number" defaultValue="30" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
                <div><label className="block text-outline font-bold text-xs mb-1">Sessões simultâneas por utilizador</label><input type="number" defaultValue="1" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
              </div>
            </div>
            {/* LGPD / Proteção de Dados */}
            <div>
              <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Proteção de Dados (LGPD/RGPD)</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Registar consentimento de encarregados para tratamento de dados</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Permitir exportação de dados pessoais (direito de acesso)</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Anonimizar dados de estudantes inativos após 5 anos</span></label>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-subtle mt-4">
            <button onClick={() => onShowToast('Configurações de segurança guardadas com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm"><Save className="w-4 h-4" />Guardar Segurança</button>
          </div>
        </div>
      )}

      {/* Tab: Backups */}
      {tab === 'backups' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary">Backups do Sistema</h2>
              <p className="text-xs text-on-surface-variant">Cópias de segurança automáticas e manuais da base de dados.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={createBackup} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"><Database className="w-4 h-4" />Criar Backup Agora</button>
            </div>
          </div>
          {/* Configuração de backup automático */}
          <div className="mb-4 border border-border-subtle rounded-lg p-4">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Backup Automático</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-outline font-bold text-xs mb-1">Frequência</label><select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"><option>Diário</option><option>Semanal</option><option>Mensal</option></select></div>
              <div><label className="block text-outline font-bold text-xs mb-1">Hora</label><input type="text" defaultValue="03:00" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
              <div><label className="block text-outline font-bold text-xs mb-1">Retenção (dias)</label><input type="number" defaultValue="30" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Ativo</span>
              <span className="text-[11px] text-outline">Próximo backup: 11 Ago 2026, 03:00</span>
            </div>
          </div>
          {/* Tabela de backups */}
          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Nome</th>
                  <th className="px-3.5 py-3 text-left">Data</th>
                  <th className="px-3.5 py-3 text-left">Tamanho</th>
                  <th className="px-3.5 py-3 text-center">Tipo</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{b.nome}</td>
                    <td className="px-3.5 py-3 text-outline">{b.data}</td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{b.tamanho}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.tipo === 'Automático' ? 'bg-info/10 text-info' : 'bg-secondary/10 text-secondary'}`}>{b.tipo}</span></td>
                    <td className="px-3.5 py-3 text-center"><span className={`${estadoChip(b.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{b.estado}</span></td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onShowToast(`Download do backup "${b.nome}" iniciado.`)} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
                        <button onClick={() => setRestoreBackup(b)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Restaurar"><RefreshCw className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeleteBackup(b)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Integrações */}
      {tab === 'integracoes' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Integrações</h2>
            <p className="text-xs text-on-surface-variant">Serviços externos conectados à plataforma Vendaia School®.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {integrations.map((int) => (
              <div key={int.id} className="border border-border-subtle rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${int.estado === 'Conectado' ? 'bg-success/10 text-success' : int.estado === 'Erro' ? 'bg-error/10 text-error' : 'bg-surface-container text-outline'}`}><Plug className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-primary text-xs">{int.nome}</p>
                    <p className="text-[11px] text-on-surface-variant">{int.descricao}</p>
                    <span className="text-[10px] text-outline uppercase font-bold">{int.categoria}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`${estadoChip(int.estado)} px-2 py-0.5 rounded-full text-[10px] font-bold`}>{int.estado}</span>
                  <button onClick={() => onShowToast(`Configuração de "${int.nome}" aberta.`)} className="text-[10px] text-secondary font-bold hover:underline cursor-pointer">{int.estado === 'Conectado' ? 'Configurar' : 'Conectar'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: APIs */}
      {tab === 'apis' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary">APIs e Chaves de Acesso</h2>
              <p className="text-xs text-on-surface-variant">Gestão de chaves de API para integrações externas.</p>
            </div>
            <button onClick={() => setApiModal(true)} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"><Plus className="w-4 h-4" />Gerar Nova Key</button>
          </div>
          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Nome</th>
                  <th className="px-3.5 py-3 text-left">Chave</th>
                  <th className="px-3.5 py-3 text-left">Criada</th>
                  <th className="px-3.5 py-3 text-left">Última Utilização</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3 font-bold text-primary">{k.nome}</td>
                    <td className="px-3.5 py-3"><span className="font-mono text-[11px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">{k.chave}</span></td>
                    <td className="px-3.5 py-3 text-outline">{k.criada}</td>
                    <td className="px-3.5 py-3 text-outline">{k.ultimaUsada}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${estadoChip(k.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{k.estado}</span></td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onShowToast(`Chave de "${k.nome}" copiada para a área de transferência.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Copiar"><Key className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeleteApi(k)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Revogar"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Configurações Gerais */}
      {tab === 'geral' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Configurações Gerais</h2>
            <p className="text-xs text-on-surface-variant">Parâmetros globais do sistema.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-outline font-bold text-xs mb-1">Ano Letivo Ativo</label><select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"><option>2026/2027</option><option>2025/2026</option></select></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Limite de Estudantes por Turma</label><input type="number" defaultValue="35" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Período de Matrículas (Início)</label><input type="text" defaultValue="01 Set 2026" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Período de Matrículas (Fim)</label><input type="text" defaultValue="15 Set 2026" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Tolerância de Pagamento (dias)</label><input type="number" defaultValue="5" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Multa por Atraso (%)</label><input type="number" defaultValue="2" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Juros de Mora (%)</label><input type="number" defaultValue="1" step="0.1" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
            <div><label className="block text-outline font-bold text-xs mb-1">Limite de Faltas Injustificadas</label><input type="number" defaultValue="10" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></div>
          </div>
          <div className="mt-6 space-y-2 text-xs">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Notificações do Sistema</h3>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Notificar encarregados sobre faltas automaticamente</span></label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Notificar encarregados sobre propinas em atraso</span></label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Enviar relatório diário por email à direção</span></label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors"><input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" /><span className="font-medium">Permitir matrícula online (auto-atendimento)</span></label>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-subtle mt-4">
            <button onClick={() => onShowToast('Configurações gerais guardadas com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm"><Save className="w-4 h-4" />Guardar Configurações</button>
          </div>
        </div>
      )}

      {/* Modal: Gerar API Key */}
      {apiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><Key className="w-5 h-5 text-secondary" />Gerar Nova API Key</h2>
              <button onClick={() => setApiModal(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={createApiKey} className="space-y-3 text-xs">
              <label className="block text-outline font-bold">Nome da Chave<input type="text" required value={newApiName} onChange={(e) => setNewApiName(e.target.value)} placeholder="Ex: App Mobile, Webhook..." className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <p className="text-[11px] text-outline">A chave será gerada automaticamente após a criação. Guarde-a em local seguro.</p>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button type="button" onClick={() => setApiModal(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">Gerar Key</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Revogação API Key */}
      {confirmDeleteApi && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Revogar API Key</h2>
              <button onClick={() => setConfirmDeleteApi(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação é irreversível. Deseja revogar a chave <strong className="text-primary">{confirmDeleteApi.nome}</strong>? Todos os serviços que a utilizam perderão o acesso.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteApi(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeApiKey} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Revogar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Backup */}
      {confirmDeleteBackup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Remover Backup</h2>
              <button onClick={() => setConfirmDeleteBackup(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Deseja remover o backup <strong className="text-primary">{confirmDeleteBackup.nome}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteBackup(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeBackup} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Restauro de Backup */}
      {restoreBackup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><RefreshCw className="w-5 h-5 text-warning" />Restaurar Backup</h2>
              <button onClick={() => setRestoreBackup(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">O sistema será restaurado para o estado de <strong className="text-primary">{restoreBackup.data}</strong>. Todos os dados criados após esta data serão perdidos. Continuar?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRestoreBackup(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={doRestore} className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">Sim, Restaurar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
