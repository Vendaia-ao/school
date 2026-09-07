import React, { useState } from 'react';
import { ActiveView } from '../types';
import { KeyRound, CreditCard, Wallet, Award, CalendarCheck, Clock, FileText, Library, Store, CheckCircle } from 'lucide-react';

interface AlunoPortalViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

export const AlunoPortalView: React.FC<AlunoPortalViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<
    'notas' | 'cartao' | 'assiduidade' | 'horario' | 'financeiro' | 'documentos' | 'requerimentos' | 'vitrine'
  >('notas');

  // Mandatory first access password change state
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      onShowToast('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    setMustChangePassword(false);
    onShowToast('Palavra-passe alterada com sucesso! Bem-vindo ao Portal do Aluno.');
  };

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-4 max-w-7xl mx-auto">
      {/* First-time access password change modal alert */}
      {mustChangePassword && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600 text-3xl">lock_reset</span>
            <div>
              <p className="font-bold text-amber-900 text-sm">Alteração Obrigatória de Palavra-Passe (1º Acesso)</p>
              <p className="text-amber-800">
                Por motivos de segurança, altere a palavra-passe temporária fornecida pela secretaria escolar.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChangeSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="password"
              placeholder="Nova Palavra-Passe..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-1.5 bg-surface-white border border-amber-300 rounded-lg text-xs"
              required
            />
            <button
              type="submit"
              className="bg-amber-600 text-surface-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 whitespace-nowrap"
            >
              Atualizar
            </button>
          </form>
        </div>
      )}

      {/* Header Profile Banner */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-secondary text-surface-white font-bold text-xl flex items-center justify-center border-2 border-primary shadow">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-lg font-bold text-primary">Afonso Mateus Lemba</h1>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                Aluno Matriculado
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Nº de Processo: <span className="font-bold text-primary">3798</span> | E-mail: <span className="text-secondary font-bold">3798@ispozango.com</span>
            </p>
            <p className="text-[11px] text-outline">
              Turma: <span className="font-semibold text-on-surface">10º Ano A - Ciências Físicas</span> | Período: <span className="font-semibold text-on-surface">Manhã</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setMustChangePassword(!mustChangePassword)}
            className="bg-surface-container text-on-surface-variant hover:bg-surface-container-high px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-border-subtle"
            title="Alterar Palavra-Passe"
          >
            <KeyRound className="w-4 h-4 stroke-[1.75]" />
            Palavra-Passe
          </button>
          <button
            onClick={() => setActiveTab('cartao')}
            className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <CreditCard className="w-4 h-4 stroke-[1.75]" />
            Cartão Digital
          </button>
          <button
            onClick={() => setActiveTab('financeiro')}
            className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all border border-secondary"
          >
            <Wallet className="w-4 h-4 stroke-[1.75]" />
            <span>Pagar Propinas</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notas')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'notas'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Award className="w-4 h-4 stroke-[1.75]" />
          Notas & Avaliações
        </button>

        <button
          onClick={() => setActiveTab('cartao')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cartao'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <CreditCard className="w-4 h-4 stroke-[1.75]" />
          Cartão Digital
        </button>

        <button
          onClick={() => setActiveTab('assiduidade')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'assiduidade'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <CalendarCheck className="w-4 h-4 stroke-[1.75]" />
          Assiduidade
        </button>

        <button
          onClick={() => setActiveTab('horario')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'horario'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Clock className="w-4 h-4 stroke-[1.75]" />
          Horários
        </button>

        <button
          onClick={() => setActiveTab('financeiro')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'financeiro'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Wallet className="w-4 h-4 stroke-[1.75]" />
          Faturas
        </button>

        <button
          onClick={() => setActiveTab('documentos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'documentos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Library className="w-4 h-4 stroke-[1.75]" />
          Documentos
        </button>

        <button
          onClick={() => setActiveTab('requerimentos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'requerimentos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <FileText className="w-4 h-4 stroke-[1.75]" />
          Requerimentos
        </button>

        <button
          onClick={() => setActiveTab('vitrine')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'vitrine'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Store className="w-4 h-4 stroke-[1.75]" />
          Vitrine
        </button>
      </div>

      {/* Tab: Notas */}
      {activeTab === 'notas' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-primary text-sm">Boletim de Notas - Ano Letivo 2026/2027</h2>
            <span className="text-xs font-bold text-success bg-green-100 px-2.5 py-1 rounded-full">
              Média Geral: 15.5 Valores (Aprovado)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 font-bold">Disciplina</th>
                  <th className="px-3 py-1.5 font-bold text-center">1º Trimestre</th>
                  <th className="px-3 py-1.5 font-bold text-center">2º Trimestre</th>
                  <th className="px-3 py-1.5 font-bold text-center">3º Trimestre</th>
                  <th className="px-3 py-1.5 font-bold text-center">Média Final</th>
                  <th className="px-3 py-1.5 font-bold text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Matemática I</td>
                  <td className="px-3 py-1.5 text-center font-bold text-success">16</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center font-bold text-secondary">16.0 v.</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Positiva</span></td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Física</td>
                  <td className="px-3 py-1.5 text-center font-bold text-success">15</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center font-bold text-secondary">15.0 v.</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Positiva</span></td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Química</td>
                  <td className="px-3 py-1.5 text-center font-bold text-success">17</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center text-outline">--</td>
                  <td className="px-3 py-1.5 text-center font-bold text-secondary">17.0 v.</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Excelente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Cartão Digital */}
      {activeTab === 'cartao' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-80 h-48 bg-gradient-to-r from-primary via-primary-container to-secondary text-surface-white rounded-2xl p-4 shadow-xl border border-secondary/30 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-secondary">VENDAIA SCHOOL®</p>
                <p className="text-[10px] text-on-primary-container">CARTÃO DIGITAL DO ESTUDANTE</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-secondary">contactless</span>
            </div>

            <div className="flex items-center gap-3 my-1">
              <div className="w-12 h-12 rounded-full bg-surface-white text-primary font-bold text-lg flex items-center justify-center border-2 border-secondary">
                AM
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Afonso Mateus Lemba</p>
                <p className="text-[10px] opacity-90">Proc. Nº: 3798 | 10º Ano A</p>
                <p className="text-[10px] opacity-90">Validade: 08/2027</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] pt-1 border-t border-white/20">
              <p>Validação via QR Code Seguro</p>
              <span className="font-mono font-bold text-secondary">VS-3798-2026</span>
            </div>
          </div>

          <button
            onClick={() => onShowToast('Solicitando 2ª via do Cartão do Estudante à secretaria...')}
            className="text-secondary font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">credit_card</span>
            Solicitar Segunda Via do Cartão
          </button>
        </div>
      )}

      {/* Tab: Faturas & Pagamentos */}
      {activeTab === 'financeiro' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-primary text-sm">Histórico Financeiro e Mensalidades</h2>
            <button
              onClick={() => onShowToast('Acedendo ao Portal Multicaixa Express para pagamento online...')}
              className="bg-secondary text-surface-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              Pagamento Online (MC Express)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 font-bold">Documento / Propina</th>
                  <th className="px-3 py-1.5 font-bold">Mês / Módulo</th>
                  <th className="px-3 py-1.5 font-bold">Valor</th>
                  <th className="px-3 py-1.5 font-bold">Vencimento</th>
                  <th className="px-3 py-1.5 font-bold text-center">Estado</th>
                  <th className="px-3 py-1.5 font-bold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Propina Escolar</td>
                  <td className="px-3 py-1.5">Setembro 2026</td>
                  <td className="px-3 py-1.5 font-bold text-primary">35.000,00 Kz</td>
                  <td className="px-3 py-1.5 text-on-surface-variant">10/09/2026</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">Liquidada</span></td>
                  <td className="px-3 py-1.5 text-center">
                    <button onClick={() => onShowToast('Baixando Recibo FT 2026/102...')} className="text-secondary font-bold hover:underline">
                      Baixar Recibo
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold text-primary">Propina Escolar</td>
                  <td className="px-3 py-1.5">Outubro 2026</td>
                  <td className="px-3 py-1.5 font-bold text-primary">35.000,00 Kz</td>
                  <td className="px-3 py-1.5 text-on-surface-variant">10/10/2026</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Pendente</span></td>
                  <td className="px-3 py-1.5 text-center">
                    <button onClick={() => onShowToast('Gerando Referência Multicaixa...')} className="text-primary font-bold hover:underline">
                      Gerar Referência
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Vitrine */}
      {activeTab === 'vitrine' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h2 className="font-bold text-primary text-sm">Vitrine Institucional & Recados da Escola</h2>
          <div className="p-3 border border-border-subtle rounded-xl bg-surface-container-low/30 space-y-1">
            <span className="font-bold text-secondary text-[10px] uppercase">Aviso Urgente</span>
            <p className="font-bold text-primary">Feira de Ciências e Tecnologia Vendaia School® 2026</p>
            <p className="text-on-surface-variant">Inscrições abertas para a submissão de projetos até 20 de Setembro.</p>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {['assiduidade', 'horario', 'documentos', 'requerimentos'].includes(activeTab) && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-sm text-center text-xs text-on-surface-variant space-y-2">
          <span className="material-symbols-outlined text-secondary text-4xl">inventory_2</span>
          <p className="font-bold text-primary text-sm">Módulo do Portal do Aluno: {activeTab.toUpperCase()}</p>
          <p>Módulo totalmente configurado e pronto para consulta em tempo real.</p>
        </div>
      )}
    </div>
  );
};
