import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, Award, ChartBar as BarChart3, Building2, CircleCheck as CheckCircle2, Download, CreditCard as Edit3, ChartBar as FileBarChart, Landmark, Percent, Plus, Printer, Receipt, Search, Scale, Trash2, TrendingDown, TrendingUp, Wallet, X, TriangleAlert as AlertTriangle } from 'lucide-react';

interface Props { onSelectView: (view: ActiveView) => void; onShowToast: (msg: string) => void; }
type Tab = 'fluxo' | 'receitas' | 'despesas' | 'caixa' | 'bancos' | 'conciliacao' | 'bolsas' | 'descontos' | 'relatorios';
type Movement = { id: string; date: string; description: string; category: string; account: string; amount: number; status: 'Confirmado' | 'Pendente'; };
type BankAccount = { id: string; bank: string; iban: string; holder: string; balance: number; active: boolean; };

const money = (value: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(value);
const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'fluxo', label: 'Fluxo de Caixa', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'receitas', label: 'Receitas', icon: <ArrowDownCircle className="w-4 h-4" /> },
  { key: 'despesas', label: 'Despesas', icon: <ArrowUpCircle className="w-4 h-4" /> },
  { key: 'caixa', label: 'Caixa', icon: <Wallet className="w-4 h-4" /> },
  { key: 'bancos', label: 'Bancos', icon: <Landmark className="w-4 h-4" /> },
  { key: 'conciliacao', label: 'Conciliação Bancária', icon: <Scale className="w-4 h-4" /> },
  { key: 'bolsas', label: 'Bolsas', icon: <Award className="w-4 h-4" /> },
  { key: 'descontos', label: 'Descontos', icon: <Percent className="w-4 h-4" /> },
  { key: 'relatorios', label: 'Relatórios Financeiros', icon: <FileBarChart className="w-4 h-4" /> },
];

const initialRevenue: Movement[] = [
  { id: 'r1', date: '08 Ago 2026', description: 'Propina Mensal — Setembro 2026 (Turma 10ºA)', category: 'Propinas', account: 'Caixa Principal', amount: 4200000, status: 'Confirmado' },
  { id: 'r2', date: '07 Ago 2026', description: 'Matrícula Anual — 45 novos estudantes', category: 'Matrículas', account: 'BAI — Conta Operacional', amount: 1125000, status: 'Confirmado' },
  { id: 'r3', date: '05 Ago 2026', description: 'Venda de Uniformes Oficiais — Lote 3', category: 'Uniformes', account: 'Caixa Principal', amount: 840000, status: 'Confirmado' },
  { id: 'r4', date: '02 Ago 2026', description: 'Emolumentos — Emissão de declarações', category: 'Emolumentos', account: 'Caixa Principal', amount: 77000, status: 'Pendente' },
  { id: 'r5', date: '01 Ago 2026', description: 'Transporte Escolar — Passe Mensal Rota A', category: 'Transporte', account: 'BAI — Conta Operacional', amount: 1540000, status: 'Confirmado' },
];
const initialExpenses: Movement[] = [
  { id: 'd1', date: '09 Ago 2026', description: 'Salários Docentes — Folha 08/2026', category: 'Salários', account: 'BAI — Conta Operacional', amount: 3850000, status: 'Confirmado' },
  { id: 'd2', date: '06 Ago 2026', description: 'Compra de Material Didático — Lote Trimestral', category: 'Material', account: 'Caixa Principal', amount: 320000, status: 'Confirmado' },
  { id: 'd3', date: '04 Ago 2026', description: 'Manutenção do Laboratório de Informática', category: 'Manutenção', account: 'BAF — Conta Investimento', amount: 180000, status: 'Pendente' },
  { id: 'd4', date: '03 Ago 2026', description: 'Fornecimento de Gás e Água — Campus Principal', category: 'Utilidades', account: 'BAI — Conta Operacional', amount: 95000, status: 'Confirmado' },
  { id: 'd5', date: '01 Ago 2026', description: 'Seguro Escolar Anual — Apólice 2026/2027', category: 'Seguros', account: 'BAF — Conta Investimento', amount: 450000, status: 'Confirmado' },
];
const initialBanks: BankAccount[] = [
  { id: 'b1', bank: 'Banco Angolano de Investimentos (BAI)', iban: 'AO06.0000.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Operacional', balance: 8420000, active: true },
  { id: 'b2', bank: 'Banco de Fomento Angola (BAF)', iban: 'AO06.0040.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Investimento', balance: 24500000, active: true },
  { id: 'b3', bank: 'Standard Bank Angola', iban: 'AO06.0003.0000.0000.0000.0000.0', holder: 'Vendaia School® — Conta Reserva', balance: 5800000, active: false },
];

export const GestaoFinanceiraView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('fluxo');
  const [revenues, setRevenues] = useState(initialRevenue);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [banks, setBanks] = useState(initialBanks);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'revenue' | 'expense' | 'bank' | null>(null);
  const [editing, setEditing] = useState<Movement | BankAccount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: 'revenue' | 'expense' | 'bank'; item: Movement | BankAccount } | null>(null);
  const [form, setForm] = useState({ description: '', category: 'Propinas', account: 'Caixa Principal', amount: 0, bank: '', iban: '', holder: '', balance: 0 });

  const revenueTotal = revenues.filter((x) => x.status === 'Confirmado').reduce((sum, x) => sum + x.amount, 0);
  const expenseTotal = expenses.filter((x) => x.status === 'Confirmado').reduce((sum, x) => sum + x.amount, 0);
  const bankTotal = banks.filter((x) => x.active).reduce((sum, x) => sum + x.balance, 0);
  const result = revenueTotal - expenseTotal;

  const openMovement = (kind: 'revenue' | 'expense', item?: Movement) => {
    setModal(kind); setEditing(item || null);
    setForm({ description: item?.description || '', category: item?.category || (kind === 'revenue' ? 'Propinas' : 'Material'), account: item?.account || 'Caixa Principal', amount: item?.amount || 0, bank: '', iban: '', holder: '', balance: 0 });
  };
  const openBank = (item?: BankAccount) => {
    setModal('bank'); setEditing(item || null);
    setForm({ description: '', category: 'Propinas', account: 'Caixa Principal', amount: 0, bank: item?.bank || '', iban: item?.iban || '', holder: item?.holder || '', balance: item?.balance || 0 });
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (modal === 'bank') {
      const item: BankAccount = { id: (editing as BankAccount)?.id || `b${Date.now()}`, bank: form.bank, iban: form.iban, holder: form.holder, balance: form.balance, active: (editing as BankAccount)?.active ?? true };
      setBanks(editing ? banks.map((x) => x.id === item.id ? item : x) : [...banks, item]);
      onShowToast(editing ? 'Conta bancária atualizada.' : 'Conta bancária adicionada.');
    } else if (modal) {
      const item: Movement = { id: (editing as Movement)?.id || `${modal}-${Date.now()}`, date: '10 Ago 2026', description: form.description, category: form.category, account: form.account, amount: form.amount, status: 'Confirmado' };
      if (modal === 'revenue') setRevenues(editing ? revenues.map((x) => x.id === item.id ? item : x) : [item, ...revenues]);
      else setExpenses(editing ? expenses.map((x) => x.id === item.id ? item : x) : [item, ...expenses]);
      onShowToast(editing ? 'Lançamento atualizado.' : 'Lançamento registado.');
    }
    setModal(null);
  };
  const remove = () => {
    if (!confirmDelete) return;
    if (confirmDelete.kind === 'bank') setBanks(banks.filter((x) => x.id !== confirmDelete.item.id));
    if (confirmDelete.kind === 'revenue') setRevenues(revenues.filter((x) => x.id !== confirmDelete.item.id));
    if (confirmDelete.kind === 'expense') setExpenses(expenses.filter((x) => x.id !== confirmDelete.item.id));
    setConfirmDelete(null); onShowToast('Registo removido.');
  };

  const filtered = useMemo(() => {
    const list = tab === 'receitas' ? revenues : expenses;
    return list.filter((x) => `${x.description} ${x.category} ${x.account}`.toLowerCase().includes(search.toLowerCase()));
  }, [tab, revenues, expenses, search]);

  return <div className="mt-header-height p-4 w-full max-w-7xl mx-auto flex flex-col gap-3">
    <div className="flex justify-between items-center mb-1">
      <h1 className="text-xl font-bold text-primary flex items-center gap-2">
        <Receipt className="w-5 h-5 text-secondary" />
        Gestão Financeira
      </h1>
      <div className="flex items-center gap-2">
        <button onClick={() => onShowToast('Relatório financeiro exportado.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
          <Download className="w-4 h-4" />
          Exportar
        </button>
        <button onClick={() => openMovement('revenue')} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Lançamento
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <Kpi label="Total Receitas" value={money(revenueTotal)} tone="text-success" note="+12% vs mês anterior" icon={<TrendingUp className="w-4 h-4" />} />
      <Kpi label="Total Despesas" value={money(expenseTotal)} tone="text-error" note="+3% vs mês anterior" icon={<TrendingDown className="w-4 h-4" />} />
      <Kpi label="Resultado Operacional" value={money(result)} tone="text-primary" note={result >= 0 ? 'Superávit' : 'Défice'} icon={<Scale className="w-4 h-4" />} />
      <Kpi label="Saldo em Bancos" value={money(bankTotal)} tone="text-primary" note={`${banks.filter((x) => x.active).length} contas ativas`} icon={<Landmark className="w-4 h-4" />} />
    </div>
    <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
      {tabs.map((item) => (
        <button
          key={item.key}
          onClick={() => { setTab(item.key); setSearch(''); }}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tab === item.key
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>

    {tab === 'fluxo' && <Flow result={result} revenue={revenueTotal} expense={expenseTotal} onShowToast={onShowToast} />}
    {(tab === 'receitas' || tab === 'despesas') && <MovementTable tab={tab} rows={filtered} search={search} setSearch={setSearch} onAdd={() => openMovement(tab === 'receitas' ? 'revenue' : 'expense')} onEdit={(row) => openMovement(tab === 'receitas' ? 'revenue' : 'expense', row)} onDelete={(row) => setConfirmDelete({ kind: tab === 'receitas' ? 'revenue' : 'expense', item: row })} />}
    {tab === 'caixa' && <Cash onShowToast={onShowToast} />}
    {tab === 'bancos' && <Banks rows={banks} onAdd={() => openBank()} onEdit={openBank} onDelete={(row) => setConfirmDelete({ kind: 'bank', item: row })} />}
    {tab === 'conciliacao' && <Reconciliation onShowToast={onShowToast} />}
    {tab === 'bolsas' && <SimpleCards title="Bolsas de Estudo & Apoios Sociais" action="Nova Bolsa" icon={<Award className="w-5 h-5" />} items={['Bolsa Mérito Académico 2026 — Ana Catarina Mendes Silva', 'Bolsa Social Família Numerosa — Carlos Eduardo Ferreira', 'Bolsa Integral Orçamento Estatal — Eduardo Jorge Lima']} onAction={() => onShowToast('Formulário de bolsa aberto.')} />}
    {tab === 'descontos' && <SimpleCards title="Configuração de Descontos" action="Novo Desconto" icon={<Percent className="w-5 h-5" />} items={['Desconto Pontualidade — 5% nas propinas', 'Desconto Irmandade — 15% para 3 ou mais irmãos', 'Desconto Fixo Funcionários Vendaia — 12.000 Kz']} onAction={() => onShowToast('Formulário de desconto aberto.')} />}
    {tab === 'relatorios' && <Reports onShowToast={onShowToast} />}

    {modal && <Modal title={modal === 'bank' ? 'Conta Bancária' : modal === 'revenue' ? 'Receita' : 'Despesa'} onClose={() => setModal(null)}><form onSubmit={save} className="space-y-3 text-xs">{modal === 'bank' ? <><Field label="Banco / Instituição" value={form.bank} onChange={(v) => setForm({ ...form, bank: v })} required /><Field label="IBAN" value={form.iban} onChange={(v) => setForm({ ...form, iban: v })} required /><Field label="Titular da Conta" value={form.holder} onChange={(v) => setForm({ ...form, holder: v })} required /><Field label="Saldo disponível (Kz)" type="number" value={String(form.balance)} onChange={(v) => setForm({ ...form, balance: Number(v) })} /></> : <><Field label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required /><div className="grid grid-cols-2 gap-3"><Field label="Categoria" value={form.category} onChange={(v) => setForm({ ...form, category: v })} /><Field label="Valor (Kz)" type="number" value={String(form.amount)} onChange={(v) => setForm({ ...form, amount: Number(v) })} required /></div><Field label="Conta / Origem" value={form.account} onChange={(v) => setForm({ ...form, account: v })} /></>}<div className="flex justify-end gap-2 border-t border-border-subtle pt-3"><button type="button" onClick={() => setModal(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer">Cancelar</button><button className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer">Guardar</button></div></form></Modal>}
    {confirmDelete && <Modal title="Confirmar remoção" onClose={() => setConfirmDelete(null)}><div className="space-y-4 text-xs"><p className="text-on-surface-variant flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Esta ação não pode ser desfeita. Deseja remover este registo?</p><div className="flex justify-end gap-2"><button onClick={() => setConfirmDelete(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer">Cancelar</button><button onClick={remove} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer">Sim, Remover</button></div></div></Modal>}
  </div>;
};

const Kpi = ({ label, value, tone, note, icon }: { label: string; value: string; tone: string; note: string; icon: React.ReactNode }) => <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">{label}</span><span className={`text-xl font-bold leading-none ${tone}`}>{value}</span></div><div className="text-right"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold">{icon}{note}</span></div></div>;
const Panel = ({ children }: { children: React.ReactNode }) => <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">{children}</div>;
const Field = ({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) => <label className="block text-outline font-bold">{label}<input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>;
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6"><div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><Receipt className="w-5 h-5 text-secondary" />{title}</h2><button onClick={onClose} className="text-outline hover:text-primary p-1 cursor-pointer"><X className="w-4 h-4" /></button></div>{children}</div></div>;

const MovementTable = ({ tab, rows, search, setSearch, onAdd, onEdit, onDelete }: { tab: Tab; rows: Movement[]; search: string; setSearch: (x: string) => void; onAdd: () => void; onEdit: (x: Movement) => void; onDelete: (x: Movement) => void }) => <Panel><div className="flex justify-between items-center gap-3 mb-3"><div><h2 className="text-lg font-bold text-primary">{tab === 'receitas' ? 'Receitas' : 'Despesas'}</h2><p className="text-xs text-on-surface-variant">Registos financeiros do período corrente.</p></div><div className="flex gap-2"><div className="relative"><Search className="w-4 h-4 text-outline absolute left-2.5 top-2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." className="pl-8 pr-3 py-1.5 text-xs border border-border-subtle rounded-lg focus:outline-none focus:border-secondary" /></div><button onClick={onAdd} className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-4 h-4" />Adicionar</button></div></div><div className="overflow-x-auto border border-border-subtle rounded-lg"><table className="w-full text-left border-collapse"><thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3.5 py-3">Data</th><th className="px-3.5 py-3">Descrição</th><th className="px-3.5 py-3">Categoria</th><th className="px-3.5 py-3">Conta</th><th className="px-3.5 py-3 text-right">Valor</th><th className="px-3.5 py-3 text-center">Estado</th><th className="px-3.5 py-3 text-right">Ações</th></tr></thead><tbody className="divide-y divide-border-subtle text-xs">{rows.length ? rows.map((row) => <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors"><td className="px-3.5 py-3 text-on-surface-variant">{row.date}</td><td className="px-3.5 py-3 font-bold text-primary">{row.description}</td><td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{row.category}</span></td><td className="px-3.5 py-3 text-on-surface-variant">{row.account}</td><td className={`px-3.5 py-3 text-right font-bold ${tab === 'receitas' ? 'text-success' : 'text-error'}`}>{money(row.amount)}</td><td className="px-3.5 py-3 text-center"><span className={`${row.status === 'Confirmado' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{row.status}</span></td><td className="px-3.5 py-3 text-right"><button onClick={() => onEdit(row)} className="p-1.5 text-outline hover:text-info cursor-pointer"><Edit3 className="w-4 h-4" /></button><button onClick={() => onDelete(row)} className="p-1.5 text-outline hover:text-error cursor-pointer"><Trash2 className="w-4 h-4" /></button></td></tr>) : <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">Nenhum resultado.</td></tr>}</tbody></table></div></Panel>;

const Flow = ({ revenue, expense, result, onShowToast }: { revenue: number; expense: number; result: number; onShowToast: (x: string) => void }) => <Panel><div className="flex justify-between items-center mb-4"><div><h2 className="text-lg font-bold text-primary">Fluxo de Caixa — Agosto 2026</h2><p className="text-xs text-on-surface-variant">Entradas e saídas consolidadas por período.</p></div><button onClick={() => onShowToast('Fluxo de caixa enviado para impressão.')} className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-bold flex gap-1 items-center cursor-pointer"><Printer className="w-4 h-4" />Imprimir</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"><div className="border border-success/20 bg-success/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Entradas</span><p className="text-xl font-bold text-success mt-1">{money(revenue)}</p></div><div className="border border-error/20 bg-error/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Saídas</span><p className="text-xl font-bold text-error mt-1">{money(expense)}</p></div><div className="border border-primary/20 bg-primary/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Saldo líquido</span><p className="text-xl font-bold text-primary mt-1">{money(result)}</p></div></div><div className="border border-border-subtle rounded-lg p-4"><h3 className="text-sm font-bold text-primary mb-3">Evolução do saldo diário</h3><div className="h-32 flex items-end gap-1 border-b border-border-subtle">{[52,60,55,70,66,74,68,82,78,88,84,94,90,96,88,98,93,100,92,97].map((height, index) => <div key={index} className="flex-1 bg-primary/70 hover:bg-secondary transition-colors rounded-t-sm" style={{ height: `${height}%` }} />)}</div><div className="flex justify-between text-[9px] text-outline mt-1"><span>01 Ago</span><span>10 Ago</span><span>20 Ago</span><span>31 Ago</span></div></div></Panel>;

const Cash = ({ onShowToast }: { onShowToast: (x: string) => void }) => <Panel><div className="flex justify-between items-center mb-4"><div><h2 className="text-lg font-bold text-primary">Caixa Principal — 10 Ago 2026</h2><p className="text-xs text-on-surface-variant">Turno da manhã · Operador: Sara Silva</p></div><div className="flex gap-2 items-center"><span className="bg-success/15 text-success px-2.5 py-1 rounded-full text-[11px] font-bold">Caixa Aberto</span><button onClick={() => onShowToast('Fecho de caixa iniciado.')} className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">Fechar Caixa</button></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['Fundo Inicial', 50000], ['Entradas', 78500], ['Saídas', 8500], ['Saldo Atual', 120000]].map(([label, value]) => <div key={String(label)} className="border border-border-subtle rounded-lg p-3"><span className="text-[10px] uppercase font-bold text-outline">{label}</span><p className="text-lg font-bold text-primary mt-1">{money(Number(value))}</p></div>)}</div></Panel>;

const Banks = ({ rows, onAdd, onEdit, onDelete }: { rows: BankAccount[]; onAdd: () => void; onEdit: (x: BankAccount) => void; onDelete: (x: BankAccount) => void }) => <Panel><div className="flex justify-between items-center mb-4"><div><h2 className="text-lg font-bold text-primary">Contas Bancárias da Instituição</h2><p className="text-xs text-on-surface-variant">Saldos e dados das contas utilizadas pela escola.</p></div><button onClick={onAdd} className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-4 h-4" />Nova Conta</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{rows.map((row) => <div key={row.id} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all"><div className="flex justify-between items-start"><div className="flex gap-2"><Building2 className="w-5 h-5 text-primary" /><div><h3 className="text-sm font-bold text-primary">{row.bank}</h3><p className="text-[10px] text-outline font-mono">{row.iban}</p></div></div><span className={`${row.active ? 'bg-success/15 text-success' : 'bg-surface-container text-outline'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>{row.active ? 'Ativa' : 'Inativa'}</span></div><p className="text-[11px] text-on-surface-variant mt-3">{row.holder}</p><div className="border-t border-border-subtle mt-3 pt-3 flex justify-between"><div><span className="text-[10px] uppercase font-bold text-outline">Saldo Disponível</span><p className="font-bold text-success">{money(row.balance)}</p></div><div><button onClick={() => onEdit(row)} className="p-1.5 text-outline hover:text-info cursor-pointer"><Edit3 className="w-4 h-4" /></button><button onClick={() => onDelete(row)} className="p-1.5 text-outline hover:text-error cursor-pointer"><Trash2 className="w-4 h-4" /></button></div></div></div>)}</div></Panel>;

const Reconciliation = ({ onShowToast }: { onShowToast: (x: string) => void }) => <Panel><div className="flex justify-between items-center mb-4"><div><h2 className="text-lg font-bold text-primary">Conciliação Bancária</h2><p className="text-xs text-on-surface-variant">Compare os movimentos importados com os registos internos.</p></div><button onClick={() => onShowToast('Todos os movimentos pendentes foram conciliados.')} className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><CheckCircle2 className="w-4 h-4" />Conciliar Todos</button></div><div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-xs text-on-surface-variant mb-3">Existem <strong className="text-warning">3 movimentos</strong> bancários por conciliar.</div><div className="border border-border-subtle rounded-lg p-3 space-y-2">{['Transferência recebida — Propinas 10ºA', 'Juros de depósito a prazo — Agosto', 'Pagamento fornecedor — Material didático'].map((item) => <div key={item} className="flex justify-between items-center border-b border-border-subtle last:border-0 pb-2 last:pb-0"><span className="text-xs font-bold text-primary">{item}</span><button onClick={() => onShowToast('Movimento conciliado com sucesso.')} className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-md font-bold cursor-pointer">Conciliar</button></div>)}</div></Panel>;

const SimpleCards = ({ title, action, icon, items, onAction }: { title: string; action: string; icon: React.ReactNode; items: string[]; onAction: () => void }) => <Panel><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2">{icon}{title}</h2><button onClick={onAction} className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-4 h-4" />{action}</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{items.map((item, index) => <div key={item} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all"><div className="flex justify-between"><span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">{index === 2 ? 'Suspensa' : 'Ativa'}</span><Award className="w-5 h-5 text-secondary" /></div><p className="text-sm font-bold text-primary mt-3">{item}</p><p className="text-[11px] text-on-surface-variant mt-2">Validade: Junho 2027 · Gestão financeira</p></div>)}</div></Panel>;
const Reports = ({ onShowToast }: { onShowToast: (x: string) => void }) => <Panel><div className="flex justify-between items-center mb-4"><div><h2 className="text-lg font-bold text-primary">Relatórios Financeiros</h2><p className="text-xs text-on-surface-variant">Relatórios para a direção e auditoria.</p></div><button onClick={() => onShowToast('Relatório consolidado exportado.')} className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><Download className="w-4 h-4" />Exportar Consolidado</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{['Demonstração de Resultados', 'Mapa de Fluxo de Caixa', 'Relatório de Conciliação Bancária', 'Relatório de Bolsas e Descontos', 'Relatório de Dívidas e Cobrança', 'Fecho de Caixa Mensal'].map((item) => <button key={item} onClick={() => onShowToast(`Relatório “${item}” gerado.`)} className="text-left border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"><FileBarChart className="w-5 h-5 text-secondary mb-2" /><h3 className="text-sm font-bold text-primary">{item}</h3><p className="text-[11px] text-on-surface-variant mt-1">Gerar e descarregar relatório detalhado.</p></button>)}</div></Panel>;
