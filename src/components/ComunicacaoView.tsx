import React, { useState } from 'react';
import { ActiveView } from '../types';
import { MessageSquare, Send, Mail, CheckCircle2, MessageCircle, Users, BellRing, Smartphone, FileText, History, Edit3, Sliders } from 'lucide-react';

interface ComunicacaoViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

interface MessageHistory {
  id: string;
  titulo: string;
  canal: 'SMS' | 'E-mail' | 'Push App' | 'Multicanal';
  destinatarios: string;
  dataEnvio: string;
  estado: 'Enviado' | 'Entregue' | 'Lido' | 'Agendado';
  taxaAbertura: string;
  autor: string;
}

export const ComunicacaoView: React.FC<ComunicacaoViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'nova' | 'historico' | 'modelos' | 'canais'>('historico');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCanal, setFilterCanal] = useState('todos');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form states for new communication
  const [targetGroup, setTargetGroup] = useState('encarregados');
  const [selectedClass, setSelectedClass] = useState('todas');
  const [channelSMS, setChannelSMS] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Initial Mock History
  const [historyList, setHistoryList] = useState<MessageHistory[]>([
    {
      id: 'com-101',
      titulo: 'Convocatória para Reunião Geral de Encarregados de Educação',
      canal: 'Multicanal',
      destinatarios: 'Todos os Encarregados (842)',
      dataEnvio: '09 Ago 2026, 14:30',
      estado: 'Lido',
      taxaAbertura: '94%',
      autor: 'Dra. Sara Silva (Direção)',
    },
    {
      id: 'com-102',
      titulo: 'Lembrete de Liquidação de Propinas - Mês de Agosto',
      canal: 'SMS',
      destinatarios: 'Encarregados com Pendência (14)',
      dataEnvio: '05 Ago 2026, 09:15',
      estado: 'Entregue',
      taxaAbertura: '100%',
      autor: 'Serviços Financeiros',
    },
    {
      id: 'com-103',
      titulo: 'Divulgação do Calendário de Exames do 2º Semestre',
      canal: 'E-mail',
      destinatarios: 'Estudantes do 10º ao 12º Ano (320)',
      dataEnvio: '01 Ago 2026, 11:00',
      estado: 'Lido',
      taxaAbertura: '88%',
      autor: 'Secretaria Académica',
    },
    {
      id: 'com-104',
      titulo: 'Aviso: Suspensão de Atividades Letivas - Feriado Municipal',
      canal: 'Push App',
      destinatarios: 'Toda a Comunidade Escolar (1.250)',
      dataEnvio: '25 Jul 2026, 16:45',
      estado: 'Enviado',
      taxaAbertura: '91%',
      autor: 'Dra. Sara Silva (Direção)',
    },
    {
      id: 'com-105',
      titulo: 'Comprovativo de Inscrição na Atividade Extracurricular de Robótica',
      canal: 'E-mail',
      destinatarios: 'Inscritos no Clube de Robótica (45)',
      dataEnvio: '18 Jul 2026, 10:20',
      estado: 'Entregue',
      taxaAbertura: '96%',
      autor: 'Prof. Miguel Ângelo',
    },
  ]);

  const templates = [
    {
      id: 'tmpl-1',
      nome: 'Aviso de Reunião de Pais',
      categoria: 'Geral',
      assunto: 'Convocatória: Reunião com o Encarregado de Educação',
      corpo: 'Estimado Encarregado de Educação, vimos por este meio convidá-lo para a reunião presencial a realizar-se no próximo dia [DATA] às [HORA] na sala [SALA]. Contamos com a sua presença.',
    },
    {
      id: 'tmpl-2',
      nome: 'Lembrete de Propina Pendente',
      categoria: 'Financeiro',
      assunto: 'Aviso de Vencimento de Propina - Vendaia School®',
      corpo: 'Exmo.(a) Sr.(a) [NOME_ENCARREGADO], informamos que a propina referente ao mês de [MÊS] do estudante [NOME_ALUNO] se encontra pendente. Agradecemos a regularização via Multicaixa / Referência MB.',
    },
    {
      id: 'tmpl-3',
      nome: 'Notificação de Falta Injustificada',
      categoria: 'Assiduidade',
      assunto: 'Notificação de Assiduidade - [NOME_ALUNO]',
      corpo: 'Informamos que o estudante [NOME_ALUNO] registou uma falta injustificada no dia [DATA] na disciplina de [DISCIPLINA]. Solicita-se o envio de justificativo à secretaria no prazo de 48h.',
    },
    {
      id: 'tmpl-4',
      nome: 'Lançamento de Notas / Pautas',
      categoria: 'Académico',
      assunto: 'Disponibilização de Notas do 1º Período',
      corpo: 'Informamos que as pautas de avaliação referentes ao 1º Período já se encontram disponíveis para consulta no Portal do Aluno e Portal do Encarregado.',
    },
  ];

  const handleSendNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      onShowToast('Por favor preencha o assunto e o texto da mensagem.');
      return;
    }

    const selectedChannelsList = [];
    if (channelSMS) selectedChannelsList.push('SMS');
    if (channelEmail) selectedChannelsList.push('E-mail');
    if (channelPush) selectedChannelsList.push('Push App');

    const mainCanal =
      selectedChannelsList.length > 1
        ? 'Multicanal'
        : (selectedChannelsList[0] as 'SMS' | 'E-mail' | 'Push App') || 'Push App';

    const newComm: MessageHistory = {
      id: `com-${Date.now()}`,
      titulo: subject,
      canal: mainCanal,
      destinatarios:
        targetGroup === 'encarregados'
          ? 'Encarregados de Educação'
          : targetGroup === 'alunos'
          ? 'Estudantes'
          : targetGroup === 'professores'
          ? 'Corpo Docente'
          : 'Toda a Comunidade',
      dataEnvio: 'Agora mesmo',
      estado: 'Enviado',
      taxaAbertura: '100%',
      autor: 'Dra. Sara Silva (Administração)',
    };

    setHistoryList([newComm, ...historyList]);
    setSubject('');
    setMessageBody('');
    setActiveTab('historico');
    onShowToast('Comunicado enviado com sucesso para os destinatários selecionados!');
  };

  const applyTemplate = (tmpl: (typeof templates)[0]) => {
    setSubject(tmpl.assunto);
    setMessageBody(tmpl.corpo);
    setActiveTab('nova');
    onShowToast(`Modelo "${tmpl.nome}" aplicado no formulário de envio.`);
  };

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destinatarios.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.autor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCanal =
      filterCanal === 'todos' || item.canal.toLowerCase() === filterCanal.toLowerCase();

    return matchesSearch && matchesCanal;
  });

  return (
    <div className="mt-header-height p-4 w-full flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-secondary" />
          Comunicação Institucional
        </h1>
        <button
          onClick={() => setActiveTab('nova')}
          className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 stroke-[1.75]" />
          Novo Comunicado
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-info flex items-center justify-center">
            <Mail className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Mensagens no Mês</p>
            <p className="font-headline-sm text-lg font-bold text-primary">1.428</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-success flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Taxa de Entrega</p>
            <p className="font-headline-sm text-lg font-bold text-primary">98.4%</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-warning flex items-center justify-center">
            <Smartphone className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Saldo de SMS</p>
            <p className="font-headline-sm text-lg font-bold text-primary">4.250 crd</p>
          </div>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-secondary flex items-center justify-center">
            <Users className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Encarregados Ativos</p>
            <p className="font-headline-sm text-lg font-bold text-primary">842 enc.</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'historico'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          Histórico de Envio
        </button>

        <button
          onClick={() => setActiveTab('nova')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'nova'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Nova Mensagem
        </button>

        <button
          onClick={() => setActiveTab('modelos')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'modelos'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          Modelos (Templates)
        </button>

        <button
          onClick={() => setActiveTab('canais')}
          className={`flex-1 min-w-[125px] py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'canais'
              ? 'bg-primary text-surface-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Canais & Integrações
        </button>
      </div>

      {/* Tab 1: Histórico de Envio */}
      {activeTab === 'historico' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-3">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-border-subtle">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Pesquisar comunicados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-low border border-border-subtle rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-outline font-semibold">Canal:</span>
              <select
                value={filterCanal}
                onChange={(e) => setFilterCanal(e.target.value)}
                className="text-xs bg-surface-container-low border border-border-subtle rounded-lg px-2 py-1.5 focus:outline-none focus:border-secondary"
              >
                <option value="todos">Todos os Canais</option>
                <option value="sms">SMS</option>
                <option value="e-mail">E-mail</option>
                <option value="push app">Push App</option>
                <option value="multicanal">Multicanal</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Título do Comunicado</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Canal</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Destinatários</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase">Data de Envio</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Estado</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Taxa Leitura</th>
                  <th className="px-3 py-1.5 text-xs font-semibold text-outline uppercase text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-on-surface-variant font-medium">
                      Nenhum comunicado encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-3 py-1.5 font-bold text-primary max-w-xs truncate">{item.titulo}</td>
                      <td className="px-3 py-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                          {item.canal}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-on-surface-variant">{item.destinatarios}</td>
                      <td className="px-3 py-1.5 text-outline">{item.dataEnvio}</td>
                      <td className="px-3 py-1.5 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-center font-bold text-secondary">{item.taxaAbertura}</td>
                      <td className="px-3 py-1.5 text-center relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="text-outline hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-variant/50 cursor-pointer"
                          title="Opções"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>

                        {activeMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-2 top-8 w-44 bg-surface-white border border-border-subtle rounded-md shadow-lg z-30 p-1 text-xs text-left">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onShowToast(`Reenviando comunicado "${item.titulo}"...`);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-primary"
                              >
                                <span className="material-symbols-outlined text-[16px]">send</span> Reenviar
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onShowToast(`Detalhes do comunicado "${item.titulo}" - Autor: ${item.autor}`);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span> Ver Detalhes
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onShowToast(`Exportando relatório de entrega de "${item.titulo}"...`);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-surface-container rounded flex items-center gap-2 cursor-pointer font-medium text-secondary"
                              >
                                <span className="material-symbols-outlined text-[16px]">download</span> Exportar Relatório
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Nova Mensagem */}
      {activeTab === 'nova' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm">
          <form onSubmit={handleSendNewMessage} className="space-y-4 max-w-3xl">
            <h2 className="font-title-lg text-lg font-bold text-primary border-b border-border-subtle pb-2">
              Compor Novo Comunicado
            </h2>

            {/* Target Group Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Grupo Alvo de Destinatários:</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-lg p-2 focus:outline-none focus:border-secondary"
                >
                  <option value="encarregados">Todos os Encarregados de Educação (842)</option>
                  <option value="alunos">Todos os Estudantes (1.250)</option>
                  <option value="professores">Corpo Docente e Professores (68)</option>
                  <option value="turma_especifica">Turma Específica</option>
                  <option value="comunidade">Toda a Comunidade Escolar</option>
                </select>
              </div>

              {targetGroup === 'turma_especifica' && (
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Selecionar Turma:</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-lg p-2 focus:outline-none focus:border-secondary"
                  >
                    <option value="10A">10º Ano - Turma A</option>
                    <option value="10B">10º Ano - Turma B</option>
                    <option value="11A">11º Ano - Turma A</option>
                    <option value="12A">12º Ano - Turma A</option>
                  </select>
                </div>
              )}
            </div>

            {/* Channels Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Canais de Difusão Ativos:</label>
              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={(e) => setChannelEmail(e.target.checked)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary"
                  />
                  <span>E-mail Institucional</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelSMS}
                    onChange={(e) => setChannelSMS(e.target.checked)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary"
                  />
                  <span>SMS Imediato (Gateway Vendaia)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelPush}
                    onChange={(e) => setChannelPush(e.target.checked)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary"
                  />
                  <span>Notificação Push na App móvel</span>
                </label>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Assunto / Título do Comunicado:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Convocatória para Reunião de Avaliação do 1º Trimestre"
                className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-lg p-2 focus:outline-none focus:border-secondary"
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Conteúdo da Mensagem:</label>
              <textarea
                rows={6}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Escreva aqui a mensagem detalhada a ser enviada aos destinatários..."
                className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-lg p-2.5 focus:outline-none focus:border-secondary"
                required
              ></textarea>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubject('');
                  setMessageBody('');
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-border-subtle hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-bold bg-secondary text-surface-white hover:bg-secondary/90 flex items-center gap-2 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Enviar Comunicado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Modelos */}
      {activeTab === 'modelos' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-title-lg text-lg font-bold text-primary mb-1">Modelos Pré-definidos (Templates)</h2>
            <p className="text-xs text-on-surface-variant">
              Utilize estes modelos estandardizados para agilizar o envio de avisos frequentes na escola.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="border border-border-subtle bg-surface-container-low/50 rounded-xl p-4 flex flex-col justify-between hover:border-secondary/50 transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary text-sm">{tmpl.nome}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                      {tmpl.categoria}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface mb-1">Assunto: {tmpl.assunto}</p>
                  <p className="text-xs text-on-surface-variant italic bg-surface-white p-2 rounded border border-border-subtle mb-3">
                    "{tmpl.corpo}"
                  </p>
                </div>

                <button
                  onClick={() => applyTemplate(tmpl)}
                  className="w-full bg-secondary text-surface-white hover:bg-secondary/90 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_paste</span>
                  Usar Este Modelo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Canais */}
      {activeTab === 'canais' && (
        <div className="bg-surface-white border border-border-subtle rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="font-title-lg text-lg font-bold text-primary mb-1">Estado dos Canais de Comunicação</h2>
            <p className="text-xs text-on-surface-variant">
              Monitorize a conectividade dos servidores de envio da plataforma Vendaia School®.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-info text-[18px]">mail</span> Gateway E-mail SMTP
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Servidor: smtp.vendaia.edu.pt (Porta 587 SSL)</p>
              <p className="text-[11px] text-outline">Capacidade: 10.000 e-mails/dia</p>
            </div>

            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-warning text-[18px]">sms</span> Gateway SMS Nacional
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Provedor: Vendaia TeleCom API</p>
              <p className="text-[11px] text-outline">Crédito Disponível: 4.250 SMS</p>
            </div>

            <div className="border border-border-subtle rounded-xl p-4 bg-surface-container-low/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">notifications_active</span> Push Firebase
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Operacional
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Dispositivos Registados: 1.102 móveis</p>
              <p className="text-[11px] text-outline">Latência Média: &lt; 2 segundos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
