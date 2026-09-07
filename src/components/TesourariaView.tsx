import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import {
  Search, Plus, Receipt, Download, Printer, Send, Wallet,
  Clock, TriangleAlert as AlertTriangle, FileText, X, Trash2, Eye,
  TrendingUp, CreditCard,
} from 'lucide-react';

interface Props { onSelectView: (view: ActiveView) => void; onShowToast: (msg: string) => void; }

type Tab = 'cobrancas' | 'faturas' | 'pagamentos' | 'recibos' | 'historico';
type InvoiceStatus = 'Pago' | 'Emitido' | 'Parcial' | 'Atrasado' | 'Pendente';
type PaymentMethod = 'Numerário' | 'Multicaixa' | 'Transferência' | 'Referência MB' | 'Cartão';

interface InvoiceItem {
  id: string; numero: string; estudante: string; matricula: string;
  descricao: string; itens: { nome: string; valor: number }[];
  valorTotal: number; valorPago: number; dataEmissao: string; dataVencimento: string;
  estado: InvoiceStatus; multaAplicada: number; jurosAplicados: number;
}
interface ReceiptItem {
  id: string; numero: string; faturaRef: string; estudante: string;
  valor: number; metodo: PaymentMethod; data: string; operador: string;
}
interface ServiceProduct { id: string; nome: string; categoria: string; preco: number; }

const money = (v: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(v);

const statusChip = (e: InvoiceStatus): string => ({
  Pago: 'bg-success/15 text-success', Emitido: 'bg-info/15 text-info',
  Parcial: 'bg-warning/15 text-warning', Atrasado: 'bg-error/15 text-error',
  Pendente: 'bg-warning/15 text-warning',
}[e]);

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'cobrancas', label: 'Cobranças Pendentes', icon: <Clock className="w-4 h-4" /> },
  { key: 'faturas', label: 'Faturas & Documentos', icon: <FileText className="w-4 h-4" /> },
  { key: 'pagamentos', label: 'Registar Pagamento', icon: <Wallet className="w-4 h-4" /> },
  { key: 'recibos', label: 'Recibos Emitidos', icon: <Receipt className="w-4 h-4" /> },
  { key: 'historico', label: 'Histórico Financeiro', icon: <TrendingUp className="w-4 h-4" /> },
];

const availableServices: ServiceProduct[] = [
  { id: 's1', nome: 'Propina Mensal', categoria: 'Propinas', preco: 35000 },
  { id: 's2', nome: 'Matrícula Anual', categoria: 'Matrículas', preco: 25000 },
  { id: 's3', nome: 'Seguro Escolar', categoria: 'Emolumentos', preco: 5000 },
  { id: 's4', nome: 'Uniforme Completo', categoria: 'Uniformes', preco: 18000 },
  { id: 's5', nome: 'Transporte Escolar — Mensal', categoria: 'Transporte', preco: 15000 },
  { id: 's6', nome: 'Emissão de Declaração', categoria: 'Emolumentos', preco: 2000 },
  { id: 's7', nome: 'Certificado de Conclusão', categoria: 'Emolumentos', preco: 8000 },
  { id: 's8', nome: 'Segunda Via do Cartão', categoria: 'Emolumentos', preco: 1500 },
  { id: 's9', nome: 'Atividade Extracurricular — Robótica', categoria: 'Extracurricular', preco: 10000 },
  { id: 's10', nome: 'Livro Didático — Matemática', categoria: 'Material', preco: 6500 },
];

const initialInvoices: InvoiceItem[] = [
  { id: 'inv1', numero: 'FT 2026/1042', estudante: 'Afonso Mateus Lemba', matricula: '3798', descricao: 'Propina Mensal — Setembro 2026', itens: [{ nome: 'Propina Mensal — Setembro 2026', valor: 35000 }], valorTotal: 35000, valorPago: 35000, dataEmissao: '01 Set 2026', dataVencimento: '10 Set 2026', estado: 'Pago', multaAplicada: 0, jurosAplicados: 0 },
  { id: 'inv2', numero: 'FT 2026/1043', estudante: 'Afonso Mateus Lemba', matricula: '3798', descricao: 'Propina Mensal — Outubro 2026', itens: [{ nome: 'Propina Mensal — Outubro 2026', valor: 35000 }], valorTotal: 35000, valorPago: 0, dataEmissao: '01 Out 2026', dataVencimento: '10 Out 2026', estado: 'Pendente', multaAplicada: 0, jurosAplicados: 0 },
  { id: 'inv3', numero: 'FT 2026/1038', estudante: 'Beatriz Lemba Neto', matricula: '4102', descricao: 'Propina + Transporte — Agosto 2026', itens: [{ nome: 'Propina Mensal — Agosto 2026', valor: 35000 }, { nome: 'Transporte Escolar — Agosto 2026', valor: 15000 }], valorTotal: 50000, valorPago: 25000, dataEmissao: '01 Ago 2026', dataVencimento: '10 Ago 2026', estado: 'Parcial', multaAplicada: 700, jurosAplicados: 350 },
  { id: 'inv4', numero: 'FT 2026/1030', estudante: 'Carlos Eduardo Ferreira', matricula: '20230512', descricao: 'Matrícula + Seguro — Ano Letivo 2026/2027', itens: [{ nome: 'Matrícula Anual', valor: 25000 }, { nome: 'Seguro Escolar', valor: 5000 }], valorTotal: 30000, valorPago: 0, dataEmissao: '15 Ago 2026', dataVencimento: '25 Ago 2026', estado: 'Atrasado', multaAplicada: 600, jurosAplicados: 300 },
  { id: 'inv5', numero: 'FT 2026/1051', estudante: 'Daniela Sofia Santos', matricula: '20230891', descricao: 'Uniforme + Material — Setembro 2026', itens: [{ nome: 'Uniforme Completo', valor: 18000 }, { nome: 'Livro Didático — Matemática', valor: 6500 }], valorTotal: 24500, valorPago: 0, dataEmissao: '05 Set 2026', dataVencimento: '20 Set 2026', estado: 'Emitido', multaAplicada: 0, jurosAplicados: 0 },
];

const initialReceipts: ReceiptItem[] = [
  { id: 'rc1', numero: 'REC 2026/0892', faturaRef: 'FT 2026/1042', estudante: 'Afonso Mateus Lemba', valor: 35000, metodo: 'Referência MB', data: '08 Set 2026', operador: 'Sara Silva' },
  { id: 'rc2', numero: 'REC 2026/0885', faturaRef: 'FT 2026/1038', estudante: 'Beatriz Lemba Neto', valor: 25000, metodo: 'Numerário', data: '05 Ago 2026', operador: 'Sara Silva' },
  { id: 'rc3', numero: 'REC 2026/0870', faturaRef: 'FT 2026/1025', estudante: 'Maria Joana Silva Santos', valor: 42000, metodo: 'Transferência', data: '02 Ago 2026', operador: 'Beatriz Ferreira' },
  { id: 'rc4', numero: 'REC 2026/0865', faturaRef: 'FT 2026/1020', estudante: 'Ana Catarina Mendes Silva', valor: 35000, metodo: 'Multicaixa', data: '28 Jul 2026', operador: 'Sara Silva' },
];

export const TesourariaView: React.FC<Props> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('cobrancas');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [receipts, setReceipts] = useState<ReceiptItem[]>(initialReceipts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceStudent, setInvoiceStudent] = useState('');
  const [invoiceMatricula, setInvoiceMatricula] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<{ nome: string; valor: number }[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const [payInvoice, setPayInvoice] = useState<InvoiceItem | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Numerário');

  const [viewInvoice, setViewInvoice] = useState<InvoiceItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvoiceItem | null>(null);

  const totalCobrado = invoices.reduce((s, i) => s + i.valorTotal, 0);
  const totalRecebido = invoices.reduce((s, i) => s + i.valorPago, 0);
  const totalPendente = invoices.filter((i) => i.estado !== 'Pago').reduce((s, i) => s + (i.valorTotal - i.valorPago), 0);
  const totalAtrasado = invoices.filter((i) => i.estado === 'Atrasado').reduce((s, i) => s + (i.valorTotal - i.valorPago), 0);
  const invoiceTotal = invoiceItems.reduce((s, i) => s + i.valor, 0);
  const pendingInvoices = invoices.filter((i) => i.estado !== 'Pago');

  const addServiceToInvoice = () => {
    const svc = availableServices.find((s) => s.id === selectedServiceId);
    if (!svc) return;
    setInvoiceItems([...invoiceItems, { nome: svc.nome, valor: svc.preco }]);
    setSelectedServiceId('');
  };
  const removeInvoiceItem = (idx: number) => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceStudent.trim() || invoiceItems.length === 0) { onShowToast('Preencha o nome do estudante e adicione pelo menos um item.'); return; }
    const newNum = `FT 2026/${String(1052 + invoices.length).padStart(4, '0')}`;
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`, numero: newNum, estudante: invoiceStudent, matricula: invoiceMatricula || '—',
      descricao: invoiceItems.map((i) => i.nome).join(', '), itens: invoiceItems,
      valorTotal: invoiceTotal, valorPago: 0, dataEmissao: '10 Ago 2026', dataVencimento: '25 Ago 2026',
      estado: 'Emitido', multaAplicada: 0, jurosAplicados: 0,
    };
    setInvoices([newInvoice, ...invoices]);
    onShowToast(`Fatura ${newNum} emitida com sucesso para ${invoiceStudent}.`);
    setIsInvoiceModalOpen(false); setInvoiceStudent(''); setInvoiceMatricula(''); setInvoiceItems([]);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoice) return;
    const remaining = payInvoice.valorTotal - payInvoice.valorPago;
    if (payAmount <= 0 || payAmount > remaining + 0.01) { onShowToast('Valor de pagamento inválido.'); return; }
    const newValorPago = payInvoice.valorPago + payAmount;
    const newEstado: InvoiceStatus = newValorPago >= payInvoice.valorTotal ? 'Pago' : newValorPago > 0 ? 'Parcial' : payInvoice.estado;
    const newReceipt: ReceiptItem = {
      id: `rc-${Date.now()}`, numero: `REC 2026/${String(893 + receipts.length).padStart(4, '0')}`,
      faturaRef: payInvoice.numero, estudante: payInvoice.estudante, valor: payAmount, metodo: payMethod,
      data: '10 Ago 2026', operador: 'Sara Silva',
    };
    setInvoices(invoices.map((inv) => inv.id === payInvoice.id ? { ...inv, valorPago: newValorPago, estado: newEstado } : inv));
    setReceipts([newReceipt, ...receipts]);
    onShowToast(`Pagamento de ${money(payAmount)} registado. Recibo ${newReceipt.numero} emitido.`);
    setPayInvoice(null); setPayAmount(0); setPayMethod('Numerário');
  };

  const handleDeleteInvoice = () => {
    if (!confirmDelete) return;
    setInvoices(invoices.filter((i) => i.id !== confirmDelete.id));
    onShowToast(`Fatura ${confirmDelete.numero} anulada.`);
    setConfirmDelete(null);
  };

  const filteredInvoices = useMemo(() => invoices.filter((inv) => {
    const ms = `${inv.numero} ${inv.estudante} ${inv.matricula} ${inv.descricao}`.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === 'Todos' || inv.estado === filterStatus;
    return ms && mf;
  }), [invoices, search, filterStatus]);

  return (
    <div className="mt-header-height p-4 w-full max-w-7xl mx-auto flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Receipt className="w-5 h-5 text-secondary" />
          Tesouraria / Facturação
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => onShowToast('Relatório de cobranças exportado.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button onClick={() => setIsInvoiceModalOpen(true)} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" />
            Emitir Fatura
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total Cobrado</span><span className="text-xl font-bold text-primary leading-none">{money(totalCobrado)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-info bg-info/10 text-[10px] font-bold"><FileText className="w-3.5 h-3.5" />{invoices.length} faturas</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Total Recebido</span><span className="text-xl font-bold text-success leading-none">{money(totalRecebido)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-success bg-success/10 text-[10px] font-bold"><TrendingUp className="w-3.5 h-3.5" />{receipts.length} recibos</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Pendente</span><span className="text-xl font-bold text-warning leading-none">{money(totalPendente)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-warning bg-warning/15 text-[10px] font-bold"><Clock className="w-3.5 h-3.5" />{pendingInvoices.length} pendentes</span></div>
        <div className="bg-surface-white border border-outline-variant/30 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition-all h-[68px]"><div><span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider block mb-0.5">Em Atraso</span><span className="text-xl font-bold text-error leading-none">{money(totalAtrasado)}</span></div><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-error bg-error/15 text-[10px] font-bold"><AlertTriangle className="w-3.5 h-3.5" />{invoices.filter((i) => i.estado === 'Atrasado').length} dívidas</span></div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSearch(''); setFilterStatus('Todos'); }}
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

      {/* Tab: Cobranças Pendentes */}
      {tab === 'cobrancas' && <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div><h2 className="text-lg font-bold text-primary">Cobranças Pendentes & Dívidas Ativas</h2><p className="text-xs text-on-surface-variant">Faturas com pagamentos em aberto, ordenadas por estado de atraso.</p></div>
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer"><option value="Todos">Todos os Estados</option><option value="Pendente">Pendente</option><option value="Parcial">Parcial</option><option value="Atrasado">Atrasado</option><option value="Emitido">Emitido</option></select>
            <div className="relative"><Search className="w-4 h-4 text-outline absolute left-2.5 top-2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar fatura ou estudante..." className="pl-8 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" /></div>
          </div>
        </div>
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3.5 py-3">Nº Fatura</th><th className="px-3.5 py-3">Estudante</th><th className="px-3.5 py-3">Descrição</th><th className="px-3.5 py-3 text-right">Valor Total</th><th className="px-3.5 py-3 text-right">Pago</th><th className="px-3.5 py-3 text-right">Saldo</th><th className="px-3.5 py-3 text-center">Estado</th><th className="px-3.5 py-3 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredInvoices.filter((i) => i.estado !== 'Pago').length ? filteredInvoices.filter((i) => i.estado !== 'Pago').map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{inv.numero}</td>
                  <td className="px-3.5 py-3"><div className="font-bold text-primary">{inv.estudante}</div><div className="text-[10px] text-outline">Proc. {inv.matricula}</div></td>
                  <td className="px-3.5 py-3 text-on-surface-variant max-w-xs truncate">{inv.descricao}</td>
                  <td className="px-3.5 py-3 text-right font-bold text-primary">{money(inv.valorTotal)}</td>
                  <td className="px-3.5 py-3 text-right text-success font-medium">{money(inv.valorPago)}</td>
                  <td className="px-3.5 py-3 text-right font-bold text-error">{money(inv.valorTotal - inv.valorPago)}</td>
                  <td className="px-3.5 py-3 text-center"><span className={`${statusChip(inv.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{inv.estado}</span></td>
                  <td className="px-3.5 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setPayInvoice(inv); setPayAmount(inv.valorTotal - inv.valorPago); }} className="p-1.5 text-outline hover:text-success rounded hover:bg-success/10 transition-colors cursor-pointer" title="Registar Pagamento"><Wallet className="w-4 h-4" /></button>
                    <button onClick={() => setViewInvoice(inv)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Ver Detalhes"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => onShowToast(`Recibo da fatura ${inv.numero} enviado por email/SMS.`)} className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer" title="Enviar Recibo"><Send className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              )) : <tr><td colSpan={8} className="text-center py-8 text-on-surface-variant font-medium">Nenhuma cobrança pendente encontrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Tab: Faturas & Documentos */}
      {tab === 'faturas' && <div className="bg-surface-white border border-border-subtle rounded-b-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div><h2 className="text-lg font-bold text-primary">Faturas & Documentos Comerciais</h2><p className="text-xs text-on-surface-variant">Todas as faturas emitidas pela tesouraria da instituição.</p></div>
          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer"><option value="Todos">Todos os Estados</option><option value="Pago">Pago</option><option value="Emitido">Emitido</option><option value="Parcial">Parcial</option><option value="Atrasado">Atrasado</option><option value="Pendente">Pendente</option></select>
            <div className="relative"><Search className="w-4 h-4 text-outline absolute left-2.5 top-2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." className="pl-8 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" /></div>
          </div>
        </div>
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3.5 py-3">Nº Fatura</th><th className="px-3.5 py-3">Estudante</th><th className="px-3.5 py-3">Emissão</th><th className="px-3.5 py-3">Vencimento</th><th className="px-3.5 py-3 text-right">Valor Total</th><th className="px-3.5 py-3 text-right">Multa/Juros</th><th className="px-3.5 py-3 text-center">Estado</th><th className="px-3.5 py-3 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredInvoices.length ? filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{inv.numero}</td>
                  <td className="px-3.5 py-3"><div className="font-bold text-primary">{inv.estudante}</div><div className="text-[10px] text-outline">Proc. {inv.matricula}</div></td>
                  <td className="px-3.5 py-3 text-on-surface-variant">{inv.dataEmissao}</td>
                  <td className="px-3.5 py-3 text-on-surface-variant">{inv.dataVencimento}</td>
                  <td className="px-3.5 py-3 text-right font-bold text-primary">{money(inv.valorTotal)}</td>
                  <td className="px-3.5 py-3 text-right">{inv.multaAplicada + inv.jurosAplicados > 0 ? <span className="text-error font-bold">{money(inv.multaAplicada + inv.jurosAplicados)}</span> : <span className="text-outline">—</span>}</td>
                  <td className="px-3.5 py-3 text-center"><span className={`${statusChip(inv.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{inv.estado}</span></td>
                  <td className="px-3.5 py-3 text-right relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-surface-variant/50 cursor-pointer" title="Opções"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                    {activeMenuId === inv.id && <><div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} /><div className="absolute right-2 top-8 w-48 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                      <button onClick={() => { setActiveMenuId(null); setViewInvoice(inv); }} className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"><Eye className="w-3.5 h-3.5" /> Ver Detalhes</button>
                      <button onClick={() => { setActiveMenuId(null); setPayInvoice(inv); setPayAmount(inv.valorTotal - inv.valorPago); }} className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-success"><Wallet className="w-3.5 h-3.5" /> Registar Pagamento</button>
                      <button onClick={() => { setActiveMenuId(null); onShowToast(`Fatura ${inv.numero} descarregada em PDF.`); }} className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-info"><Download className="w-3.5 h-3.5" /> Descarregar PDF</button>
                      <button onClick={() => { setActiveMenuId(null); onShowToast(`Fatura ${inv.numero} enviada para impressão.`); }} className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"><Printer className="w-3.5 h-3.5" /> Imprimir</button>
                      <button onClick={() => { setActiveMenuId(null); onShowToast(`Fatura ${inv.numero} enviada por email/SMS.`); }} className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-secondary"><Send className="w-3.5 h-3.5" /> Enviar</button>
                      <button onClick={() => { setActiveMenuId(null); setConfirmDelete(inv); }} className="w-full text-left px-3 py-1.5 hover:bg-error/10 rounded flex items-center gap-2 cursor-pointer font-medium text-error"><Trash2 className="w-3.5 h-3.5" /> Anular Fatura</button>
                    </div></>}
                  </td>
                </tr>
              )) : <tr><td colSpan={8} className="text-center py-8 text-on-surface-variant font-medium">Nenhuma fatura encontrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Tab: Registar Pagamento */}
      {tab === 'pagamentos' && <div className="bg-surface-white border border-border-subtle rounded-b-xl p-4 shadow-sm">
        <div className="mb-4"><h2 className="text-lg font-bold text-primary">Registar Pagamento</h2><p className="text-xs text-on-surface-variant">Pesquise o estudante e registe um pagamento parcial ou total.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {pendingInvoices.length ? pendingInvoices.map((inv) => (
            <div key={inv.id} className="border border-border-subtle rounded-lg p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => { setPayInvoice(inv); setPayAmount(inv.valorTotal - inv.valorPago); }}>
              <div className="flex justify-between items-start mb-2"><div><h3 className="text-sm font-bold text-primary">{inv.estudante}</h3><p className="text-[10px] text-outline">{inv.numero} · Proc. {inv.matricula}</p></div><span className={`${statusChip(inv.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{inv.estado}</span></div>
              <p className="text-[11px] text-on-surface-variant line-clamp-1">{inv.descricao}</p>
              <div className="border-t border-border-subtle mt-3 pt-3 flex justify-between text-xs"><div><span className="text-[10px] uppercase font-bold text-outline block">Saldo Devedor</span><span className="font-bold text-error">{money(inv.valorTotal - inv.valorPago)}</span></div><div className="text-right"><span className="text-[10px] uppercase font-bold text-outline block">Vencimento</span><span className="text-on-surface-variant">{inv.dataVencimento}</span></div></div>
            </div>
          )) : <div className="col-span-2 text-center py-8 text-on-surface-variant font-medium text-xs">Todas as faturas estão liquidadas. Nenhum pagamento pendente.</div>}
        </div>
      </div>}

      {/* Tab: Recibos Emitidos */}
      {tab === 'recibos' && <div className="bg-surface-white border border-border-subtle rounded-b-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3"><div><h2 className="text-lg font-bold text-primary">Recibos Emitidos</h2><p className="text-xs text-on-surface-variant">Todos os recibos de pagamentos processados pela tesouraria.</p></div><button onClick={() => onShowToast('Lista de recibos exportada em PDF.')} className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><Download className="w-4 h-4" />Exportar</button></div>
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3.5 py-3">Nº Recibo</th><th className="px-3.5 py-3">Fatura Ref.</th><th className="px-3.5 py-3">Estudante</th><th className="px-3.5 py-3 text-right">Valor</th><th className="px-3.5 py-3 text-center">Método</th><th className="px-3.5 py-3">Data</th><th className="px-3.5 py-3">Operador</th><th className="px-3.5 py-3 text-right">Ações</th></tr></thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {receipts.length ? receipts.map((rc) => (
                <tr key={rc.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{rc.numero}</td>
                  <td className="px-3.5 py-3 text-on-surface-variant font-mono text-[11px]">{rc.faturaRef}</td>
                  <td className="px-3.5 py-3 font-bold text-primary">{rc.estudante}</td>
                  <td className="px-3.5 py-3 text-right font-bold text-success">{money(rc.valor)}</td>
                  <td className="px-3.5 py-3 text-center"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{rc.metodo}</span></td>
                  <td className="px-3.5 py-3 text-on-surface-variant">{rc.data}</td>
                  <td className="px-3.5 py-3 text-on-surface-variant">{rc.operador}</td>
                  <td className="px-3.5 py-3 text-right"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => onShowToast(`Recibo ${rc.numero} descarregado em PDF.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Descarregar"><Download className="w-4 h-4" /></button>
                    <button onClick={() => onShowToast(`Recibo ${rc.numero} enviado por email.`)} className="p-1.5 text-outline hover:text-secondary rounded hover:bg-secondary/10 transition-colors cursor-pointer" title="Enviar"><Send className="w-4 h-4" /></button>
                    <button onClick={() => onShowToast(`Recibo ${rc.numero} enviado para impressão.`)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Imprimir"><Printer className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              )) : <tr><td colSpan={8} className="text-center py-8 text-on-surface-variant font-medium">Nenhum recibo emitido.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Tab: Histórico Financeiro */}
      {tab === 'historico' && <div className="bg-surface-white border border-border-subtle rounded-b-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3"><div><h2 className="text-lg font-bold text-primary">Histórico Financeiro Consolidado</h2><p className="text-xs text-on-surface-variant">Movimentações financeiras da tesouraria no período corrente.</p></div><button onClick={() => onShowToast('Histórico financeiro exportado.')} className="border border-border-subtle px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><Download className="w-4 h-4" />Exportar</button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="border border-success/20 bg-success/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Total Recebido</span><p className="text-xl font-bold text-success mt-1">{money(totalRecebido)}</p><p className="text-[10px] text-on-surface-variant mt-1">{receipts.length} recibos emitidos</p></div>
          <div className="border border-warning/20 bg-warning/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Total Pendente</span><p className="text-xl font-bold text-warning mt-1">{money(totalPendente)}</p><p className="text-[10px] text-on-surface-variant mt-1">{pendingInvoices.length} faturas em aberto</p></div>
          <div className="border border-error/20 bg-error/5 rounded-lg p-4"><span className="text-[10px] uppercase font-bold text-outline">Dívida em Atraso</span><p className="text-xl font-bold text-error mt-1">{money(totalAtrasado)}</p><p className="text-[10px] text-on-surface-variant mt-1">{invoices.filter((i) => i.estado === 'Atrasado').length} faturas vencidas</p></div>
        </div>
        <div className="overflow-x-auto border border-border-subtle rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3.5 py-3">Data</th><th className="px-3.5 py-3">Documento</th><th className="px-3.5 py-3">Estudante</th><th className="px-3.5 py-3 text-right">Valor</th><th className="px-3.5 py-3 text-center">Tipo</th><th className="px-3.5 py-3 text-center">Estado</th></tr></thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {receipts.map((rc) => <tr key={rc.id} className="hover:bg-surface-container-low/30 transition-colors"><td className="px-3.5 py-3 text-on-surface-variant">{rc.data}</td><td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{rc.numero}</td><td className="px-3.5 py-3 text-on-surface-variant">{rc.estudante}</td><td className="px-3.5 py-3 text-right font-bold text-success">{money(rc.valor)}</td><td className="px-3.5 py-3 text-center"><span className="bg-success/15 text-success px-2 py-0.5 rounded text-[10px] font-bold">Recebimento</span></td><td className="px-3.5 py-3 text-center"><span className="bg-success/15 text-success px-2.5 py-1 rounded-full text-[11px] font-bold">Confirmado</span></td></tr>)}
              {invoices.filter((i) => i.estado === 'Atrasado').map((inv) => <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors"><td className="px-3.5 py-3 text-on-surface-variant">{inv.dataEmissao}</td><td className="px-3.5 py-3 font-bold text-primary font-mono text-[11px]">{inv.numero}</td><td className="px-3.5 py-3 text-on-surface-variant">{inv.estudante}</td><td className="px-3.5 py-3 text-right font-bold text-error">{money(inv.valorTotal - inv.valorPago)}</td><td className="px-3.5 py-3 text-center"><span className="bg-error/15 text-error px-2 py-0.5 rounded text-[10px] font-bold">Dívida</span></td><td className="px-3.5 py-3 text-center"><span className="bg-error/15 text-error px-2.5 py-1 rounded-full text-[11px] font-bold">Atrasado</span></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Modal: Emitir Fatura */}
      {isInvoiceModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"><div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><FileText className="w-5 h-5 text-secondary" />Emitir Nova Fatura</h2><button onClick={() => setIsInvoiceModalOpen(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button></div>
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          <div><h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">1. Pesquisar Estudante</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-outline font-bold">Nome do Estudante *<input type="text" required value={invoiceStudent} onChange={(e) => setInvoiceStudent(e.target.value)} placeholder="Ex: Afonso Mateus Lemba" className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
            <label className="block text-outline font-bold">Nº de Processo / Matrícula<input type="text" value={invoiceMatricula} onChange={(e) => setInvoiceMatricula(e.target.value)} placeholder="Ex: 3798" className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
          </div></div>
          <div><h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">2. Adicionar Produtos / Serviços</h3>
            <div className="flex items-center gap-2"><select value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)} className="flex-1 border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"><option value="">Selecione um produto/serviço...</option>{availableServices.map((s) => <option key={s.id} value={s.id}>{s.nome} — {money(s.preco)}</option>)}</select><button type="button" onClick={addServiceToInvoice} disabled={!selectedServiceId} className="bg-primary text-surface-white px-3 py-2 rounded font-bold disabled:opacity-50 cursor-pointer hover:bg-primary/90 transition-all"><Plus className="w-4 h-4" /></button></div>
            {invoiceItems.length > 0 && <div className="mt-3 border border-border-subtle rounded-lg overflow-hidden"><table className="w-full text-left border-collapse"><thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3 py-2">Item</th><th className="px-3 py-2 text-right">Valor</th><th className="px-3 py-2 text-right w-12">Remover</th></tr></thead><tbody className="divide-y divide-border-subtle">{invoiceItems.map((item, idx) => <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors"><td className="px-3 py-2 font-bold text-primary">{item.nome}</td><td className="px-3 py-2 text-right font-bold text-primary">{money(item.valor)}</td><td className="px-3 py-2 text-right"><button type="button" onClick={() => removeInvoiceItem(idx)} className="p-1 text-outline hover:text-error rounded hover:bg-error/10 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></td></tr>)}</tbody><tfoot><tr className="bg-surface-container-low/50"><td className="px-3 py-2 font-bold text-primary text-right">TOTAL</td><td className="px-3 py-2 text-right font-bold text-secondary text-sm">{money(invoiceTotal)}</td><td></td></tr></tfoot></table></div>}
          </div>
          <div className="flex justify-end gap-2 border-t border-border-subtle pt-3"><button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button><button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">Emitir Fatura</button></div>
        </form>
      </div></div>}

      {/* Modal: Registar Pagamento */}
      {payInvoice && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"><div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><Wallet className="w-5 h-5 text-secondary" />Registar Pagamento</h2><button onClick={() => setPayInvoice(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button></div>
        <form onSubmit={handleRegisterPayment} className="space-y-3 text-xs">
          <div className="bg-surface-container-low/40 border border-border-subtle rounded-lg p-3 space-y-1">
            <div className="flex justify-between"><span className="text-outline font-bold">Fatura:</span><span className="font-bold text-primary font-mono">{payInvoice.numero}</span></div>
            <div className="flex justify-between"><span className="text-outline font-bold">Estudante:</span><span className="font-bold text-primary">{payInvoice.estudante}</span></div>
            <div className="flex justify-between"><span className="text-outline font-bold">Valor Total:</span><span className="font-bold text-primary">{money(payInvoice.valorTotal)}</span></div>
            <div className="flex justify-between"><span className="text-outline font-bold">Já Pago:</span><span className="font-bold text-success">{money(payInvoice.valorPago)}</span></div>
            <div className="flex justify-between border-t border-border-subtle pt-1"><span className="text-outline font-bold">Saldo Devedor:</span><span className="font-bold text-error">{money(payInvoice.valorTotal - payInvoice.valorPago)}</span></div>
            {payInvoice.multaAplicada + payInvoice.jurosAplicados > 0 && <div className="flex justify-between"><span className="text-outline font-bold">Multa + Juros:</span><span className="font-bold text-error">{money(payInvoice.multaAplicada + payInvoice.jurosAplicados)}</span></div>}
          </div>
          <label className="block text-outline font-bold">Valor a Pagar (Kz)<input type="number" required value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} max={payInvoice.valorTotal - payInvoice.valorPago} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
          <label className="block text-outline font-bold">Método de Pagamento<select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PaymentMethod)} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white"><option value="Numerário">Numerário</option><option value="Multicaixa">Multicaixa</option><option value="Transferência">Transferência Bancária</option><option value="Referência MB">Referência MB</option><option value="Cartão">Cartão</option></select></label>
          <div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg text-info font-medium"><CreditCard className="w-4 h-4" /><span>Recibo será gerado automaticamente após confirmação.</span></div>
          <div className="flex justify-end gap-2 border-t border-border-subtle pt-3"><button type="button" onClick={() => setPayInvoice(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button><button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">Confirmar Pagamento</button></div>
        </form>
      </div></div>}

      {/* Modal: Ver Detalhes */}
      {viewInvoice && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"><div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><FileText className="w-5 h-5 text-secondary" />Detalhes da Fatura</h2><button onClick={() => setViewInvoice(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button></div>
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3"><div className="w-12 h-12 rounded bg-primary/10 text-primary flex items-center justify-center"><FileText className="w-6 h-6" /></div><div><h3 className="text-sm font-bold text-primary">{viewInvoice.numero}</h3><span className="text-[10px] text-outline">{viewInvoice.dataEmissao} · Venc: {viewInvoice.dataVencimento}</span></div><span className={`${statusChip(viewInvoice.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold ml-auto`}>{viewInvoice.estado}</span></div>
          <div className="grid grid-cols-2 gap-3"><div><span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-0.5">Estudante</span><span className="text-on-surface font-medium">{viewInvoice.estudante}</span></div><div><span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-0.5">Nº Processo</span><span className="text-on-surface font-medium">{viewInvoice.matricula}</span></div></div>
          <div><span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-1">Itens da Fatura</span><div className="border border-border-subtle rounded-lg overflow-hidden"><table className="w-full text-left border-collapse"><thead><tr className="bg-surface-container-low text-[10px] uppercase tracking-wider font-bold text-primary"><th className="px-3 py-2">Descrição</th><th className="px-3 py-2 text-right">Valor</th></tr></thead><tbody className="divide-y divide-border-subtle">{viewInvoice.itens.map((item, idx) => <tr key={idx}><td className="px-3 py-2 font-bold text-primary">{item.nome}</td><td className="px-3 py-2 text-right font-bold text-primary">{money(item.valor)}</td></tr>)}</tbody><tfoot><tr className="bg-surface-container-low/50"><td className="px-3 py-2 font-bold text-primary text-right">TOTAL</td><td className="px-3 py-2 text-right font-bold text-secondary text-sm">{money(viewInvoice.valorTotal)}</td></tr></tfoot></table></div></div>
          <div className="grid grid-cols-3 gap-3"><div className="border border-border-subtle rounded-lg p-2 text-center"><span className="text-[10px] uppercase font-bold text-outline block">Total</span><span className="font-bold text-primary">{money(viewInvoice.valorTotal)}</span></div><div className="border border-border-subtle rounded-lg p-2 text-center"><span className="text-[10px] uppercase font-bold text-outline block">Pago</span><span className="font-bold text-success">{money(viewInvoice.valorPago)}</span></div><div className="border border-border-subtle rounded-lg p-2 text-center"><span className="text-[10px] uppercase font-bold text-outline block">Saldo</span><span className="font-bold text-error">{money(viewInvoice.valorTotal - viewInvoice.valorPago)}</span></div></div>
          {viewInvoice.multaAplicada + viewInvoice.jurosAplicados > 0 && <div className="bg-error/10 border border-error/30 rounded-lg p-3 flex items-center gap-2 text-error"><AlertTriangle className="w-4 h-4" /><span className="font-medium">Multa: {money(viewInvoice.multaAplicada)} · Juros: {money(viewInvoice.jurosAplicados)}</span></div>}
          <div className="flex justify-end gap-2 border-t border-border-subtle pt-3"><button onClick={() => setViewInvoice(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Fechar</button><button onClick={() => onShowToast(`Fatura ${viewInvoice.numero} descarregada em PDF.`)} className="bg-info text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-info/90 transition-all flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />Descarregar</button>{viewInvoice.estado !== 'Pago' && <button onClick={() => { const inv = viewInvoice; setViewInvoice(null); setPayInvoice(inv); setPayAmount(inv.valorTotal - inv.valorPago); }} className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />Pagar</button>}</div>
        </div>
      </div></div>}

      {/* Modal: Confirmar Anulação */}
      {confirmDelete && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"><div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4"><h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Anular Fatura</h2><button onClick={() => setConfirmDelete(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button></div>
        <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja anular a fatura <strong className="text-primary font-mono">{confirmDelete.numero}</strong> de <strong className="text-primary">{confirmDelete.estudante}</strong>?</p>
        <div className="flex justify-end gap-2"><button onClick={() => setConfirmDelete(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button><button onClick={handleDeleteInvoice} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Anular</button></div>
      </div></div>}
    </div>
  );
};
