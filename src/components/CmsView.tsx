import React, { useMemo, useState } from 'react';
import { ActiveView } from '../types';
import { Globe, FileText, Newspaper, Palette, Settings, Plus, Search, CreditCard as Edit3, Trash2, Eye, Image as ImageIcon, LayoutDashboard, Building2, GraduationCap, Phone, MonitorSmartphone, Save, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, FolderOpen, X } from 'lucide-react';

interface CmsViewProps {
  onSelectView: (view: ActiveView) => void;
  onShowToast: (msg: string) => void;
}

type Tab = 'paginas' | 'noticias' | 'apariencia' | 'configuracao';

interface PageItem {
  id: string;
  titulo: string;
  slug: string;
  seccao: string;
  estado: 'Publicado' | 'Rascunho' | 'Agendado';
  atualizado: string;
  autor: string;
}

interface NewsItem {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
  estado: 'Publicado' | 'Rascunho' | 'Agendado';
  autor: string;
  destacada: boolean;
}

const initialPages: PageItem[] = [
  { id: 'p1', titulo: 'Página Inicial (Home)', slug: '/', seccao: 'Home', estado: 'Publicado', atualizado: '08 Ago 2026', autor: 'João Pinto' },
  { id: 'p2', titulo: 'Apresentação da Instituição', slug: '/instituicao/apresentacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '05 Ago 2026', autor: 'Sara Silva' },
  { id: 'p3', titulo: 'Estatutos da Vendaia School®', slug: '/instituicao/estatutos', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '03 Ago 2026', autor: 'Carlos Mendes' },
  { id: 'p4', titulo: 'Factos e Números', slug: '/instituicao/factos-numeros', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '01 Ago 2026', autor: 'Sara Silva' },
  { id: 'p5', titulo: 'História da Instituição', slug: '/instituicao/historia', seccao: 'A Instituição › Institucional', estado: 'Rascunho', atualizado: '28 Jul 2026', autor: 'João Pinto' },
  { id: 'p6', titulo: 'Informação Oficial', slug: '/instituicao/informacao-oficial', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '25 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p7', titulo: 'Organização e Estrutura', slug: '/instituicao/organizacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '22 Jul 2026', autor: 'Sara Silva' },
  { id: 'p8', titulo: 'Investigação & Desenvolvimento (I&D)', slug: '/instituicao/id', seccao: 'A Instituição › Institucional', estado: 'Rascunho', atualizado: '20 Jul 2026', autor: 'João Pinto' },
  { id: 'p9', titulo: 'Localização e Contactos', slug: '/instituicao/localizacao', seccao: 'A Instituição › Institucional', estado: 'Publicado', atualizado: '18 Jul 2026', autor: 'Sara Silva' },
  { id: 'p10', titulo: 'Departamento de Engenharia Civil', slug: '/departamentos/engenharia-civil', seccao: 'A Instituição › Departamentos', estado: 'Publicado', atualizado: '15 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p11', titulo: 'Departamento de Engenharia Electrotécnica', slug: '/departamentos/engenharia-electrotecnica', seccao: 'A Instituição › Departamentos', estado: 'Publicado', atualizado: '12 Jul 2026', autor: 'Carlos Mendes' },
  { id: 'p12', titulo: 'Serviços — Biblioteca', slug: '/servicos/biblioteca', seccao: 'A Instituição › Serviços', estado: 'Publicado', atualizado: '10 Jul 2026', autor: 'Sara Silva' },
  { id: 'p13', titulo: 'Serviços Académicos', slug: '/servicos/academicos', seccao: 'A Instituição › Serviços', estado: 'Publicado', atualizado: '08 Jul 2026', autor: 'Sara Silva' },
  { id: 'p14', titulo: 'Oferta Formativa', slug: '/estudar-aqui/oferta-formativa', seccao: 'Estudar Aqui', estado: 'Publicado', atualizado: '05 Jul 2026', autor: 'João Pinto' },
  { id: 'p15', titulo: 'Formas de Ingresso', slug: '/estudar-aqui/formas-de-ingresso', seccao: 'Estudar Aqui', estado: 'Publicado', atualizado: '03 Jul 2026', autor: 'João Pinto' },
  { id: 'p16', titulo: 'Calendário Escolar', slug: '/alunos/calendario-escolar', seccao: 'Alunos › Alunos da Instituição', estado: 'Publicado', atualizado: '01 Jul 2026', autor: 'Sara Silva' },
  { id: 'p17', titulo: 'Horários de Aulas', slug: '/alunos/horarios', seccao: 'Alunos › Alunos da Instituição', estado: 'Publicado', atualizado: '28 Jun 2026', autor: 'Sara Silva' },
  { id: 'p18', titulo: 'Mapa de Exames', slug: '/alunos/mapa-de-exames', seccao: 'Alunos › Alunos da Instituição', estado: 'Agendado', atualizado: '25 Jun 2026', autor: 'Carlos Mendes' },
  { id: 'p19', titulo: 'Contactos da Instituição', slug: '/contactos', seccao: 'Contactos', estado: 'Publicado', atualizado: '20 Jun 2026', autor: 'Sara Silva' },
  { id: 'p20', titulo: 'Secretaria Online', slug: '/secretaria-online', seccao: 'Secretaria Online', estado: 'Publicado', atualizado: '15 Jun 2026', autor: 'João Pinto' },
];

const initialNews: NewsItem[] = [
  { id: 'n1', titulo: 'Abertura das Inscrições para o Ano Letivo 2026/2027', categoria: 'Anúncios', data: '10 Ago 2026', estado: 'Publicado', autor: 'Sara Silva', destacada: true },
  { id: 'n2', titulo: 'Resultados do Concurso de Acesso ao Ensino Superior', categoria: 'Académico', data: '08 Ago 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: false },
  { id: 'n3', titulo: 'Feira de Ciências e Tecnologia — Edição 2026', categoria: 'Eventos', data: '05 Ago 2026', estado: 'Publicado', autor: 'João Pinto', destacada: true },
  { id: 'n4', titulo: 'Protocolo de Parceria com Universidade de Coimbra', categoria: 'Institucional', data: '02 Ago 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: false },
  { id: 'n5', titulo: 'Workshop de Pedagogia Digital para Docentes', categoria: 'Formação', data: '28 Jul 2026', estado: 'Rascunho', autor: 'Sara Silva', destacada: false },
  { id: 'n6', titulo: 'Campeonato Inter-Turmas de Atletismo', categoria: 'Desporto', data: '25 Jul 2026', estado: 'Agendado', autor: 'João Pinto', destacada: false },
  { id: 'n7', titulo: 'Entrega de Diplomas — Turma 2025/2026', categoria: 'Académico', data: '20 Jul 2026', estado: 'Publicado', autor: 'Carlos Mendes', destacada: true },
];

const seccoes = ['Todas', 'Home', 'A Instituição › Institucional', 'A Instituição › Departamentos', 'A Instituição › Serviços', 'Estudar Aqui', 'Alunos › Alunos da Instituição', 'Contactos', 'Secretaria Online'];

const statusChip = (estado: string): string => {
  const map: Record<string, string> = {
    'Publicado': 'bg-success/15 text-success',
    'Rascunho': 'bg-warning/15 text-warning',
    'Agendado': 'bg-info/15 text-info',
  };
  return map[estado] || 'bg-surface-container text-outline';
};

const seccaoIcon = (seccao: string): React.ReactNode => {
  if (seccao.startsWith('Home')) return <LayoutDashboard className="w-4 h-4" />;
  if (seccao.startsWith('A Instituição')) return <Building2 className="w-4 h-4" />;
  if (seccao.startsWith('Estudar Aqui')) return <GraduationCap className="w-4 h-4" />;
  if (seccao.startsWith('Alunos')) return <FileText className="w-4 h-4" />;
  if (seccao.startsWith('Contactos')) return <Phone className="w-4 h-4" />;
  if (seccao.startsWith('Secretaria')) return <MonitorSmartphone className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export const CmsView: React.FC<CmsViewProps> = ({ onShowToast }) => {
  const [tab, setTab] = useState<Tab>('paginas');
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [search, setSearch] = useState('');
  const [filterSeccao, setFilterSeccao] = useState('Todas');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [pageModal, setPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [confirmDeletePage, setConfirmDeletePage] = useState<PageItem | null>(null);
  const [newsModal, setNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState<NewsItem | null>(null);

  const [pageForm, setPageForm] = useState({ titulo: '', slug: '', seccao: 'Home', estado: 'Rascunho' as PageItem['estado'] });
  const [newsForm, setNewsForm] = useState({ titulo: '', categoria: 'Anúncios', estado: 'Rascunho' as NewsItem['estado'], destacada: false });

  const publishedCount = pages.filter((p) => p.estado === 'Publicado').length;
  const draftCount = pages.filter((p) => p.estado === 'Rascunho').length;
  const scheduledCount = pages.filter((p) => p.estado === 'Agendado').length;
  const newsPublishedCount = news.filter((n) => n.estado === 'Publicado').length;
  const featuredCount = news.filter((n) => n.destacada).length;

  const openCreatePage = () => {
    setEditingPage(null);
    setPageForm({ titulo: '', slug: '', seccao: 'Home', estado: 'Rascunho' });
    setPageModal(true);
  };

  const openEditPage = (page: PageItem) => {
    setEditingPage(page);
    setPageForm({ titulo: page.titulo, slug: page.slug, seccao: page.seccao, estado: page.estado });
    setPageModal(true);
  };

  const savePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      setPages(pages.map((p) => (p.id === editingPage.id ? { ...p, ...pageForm } : p)));
      onShowToast(`Página "${pageForm.titulo}" atualizada com sucesso!`);
    } else {
      const newPage: PageItem = {
        id: `p${Date.now()}`,
        titulo: pageForm.titulo,
        slug: pageForm.slug || `/${pageForm.titulo.toLowerCase().replace(/\s+/g, '-')}`,
        seccao: pageForm.seccao,
        estado: pageForm.estado,
        atualizado: '10 Ago 2026',
        autor: 'Sara Silva',
      };
      setPages([newPage, ...pages]);
      onShowToast(`Página "${pageForm.titulo}" criada com sucesso!`);
    }
    setPageModal(false);
  };

  const removePage = () => {
    if (!confirmDeletePage) return;
    setPages(pages.filter((p) => p.id !== confirmDeletePage.id));
    onShowToast(`Página "${confirmDeletePage.titulo}" removida.`);
    setConfirmDeletePage(null);
  };

  const openCreateNews = () => {
    setEditingNews(null);
    setNewsForm({ titulo: '', categoria: 'Anúncios', estado: 'Rascunho', destacada: false });
    setNewsModal(true);
  };

  const openEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({ titulo: item.titulo, categoria: item.categoria, estado: item.estado, destacada: item.destacada });
    setNewsModal(true);
  };

  const saveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      setNews(news.map((n) => (n.id === editingNews.id ? { ...n, ...newsForm } : n)));
      onShowToast(`Notícia "${newsForm.titulo}" atualizada com sucesso!`);
    } else {
      const newNews: NewsItem = {
        id: `n${Date.now()}`,
        titulo: newsForm.titulo,
        categoria: newsForm.categoria,
        data: '10 Ago 2026',
        estado: newsForm.estado,
        autor: 'Sara Silva',
        destacada: newsForm.destacada,
      };
      setNews([newNews, ...news]);
      onShowToast(`Notícia "${newsForm.titulo}" criada com sucesso!`);
    }
    setNewsModal(false);
  };

  const removeNews = () => {
    if (!confirmDeleteNews) return;
    setNews(news.filter((n) => n.id !== confirmDeleteNews.id));
    onShowToast(`Notícia "${confirmDeleteNews.titulo}" removida.`);
    setConfirmDeleteNews(null);
  };

  const toggleFeatured = (id: string) => {
    setNews(news.map((n) => (n.id === id ? { ...n, destacada: !n.destacada } : n)));
  };

  const filteredPages = useMemo(() => pages.filter((p) => {
    const matchSearch = `${p.titulo} ${p.slug} ${p.seccao} ${p.autor}`.toLowerCase().includes(search.toLowerCase());
    const matchSeccao = filterSeccao === 'Todas' || p.seccao === filterSeccao;
    const matchEstado = filterEstado === 'Todos' || p.estado === filterEstado;
    return matchSearch && matchSeccao && matchEstado;
  }), [pages, search, filterSeccao, filterEstado]);

  const filteredNews = useMemo(() => news.filter((n) => {
    const matchSearch = `${n.titulo} ${n.categoria} ${n.autor}`.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || n.estado === filterEstado;
    return matchSearch && matchEstado;
  }), [news, search, filterEstado]);

  return (
    <div className="mt-header-height p-4 w-full max-w-7xl mx-auto flex flex-col gap-4">
      {/* Banner de Título */}
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Globe className="w-5 h-5 text-secondary stroke-[1.75]" />
          CMS — Gestão de Conteúdo do Website
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={() => onShowToast('Pré-visualização do website aberta numa nova janela.')} className="bg-surface-white border border-border-subtle hover:bg-surface-container-low text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Eye className="w-4 h-4 stroke-[1.75]" />Pré-visualizar
          </button>
          {tab === 'paginas' && (
            <button onClick={openCreatePage} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[1.75]" />Nova Página
            </button>
          )}
          {tab === 'noticias' && (
            <button onClick={openCreateNews} className="bg-secondary text-surface-white hover:bg-secondary/90 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4 stroke-[1.75]" />Nova Notícia
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-success flex items-center justify-center">
            <FileText className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Páginas Publicadas</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{publishedCount}</p>
          </div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-warning flex items-center justify-center">
            <Edit3 className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Rascunhos</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{draftCount}</p>
          </div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-info flex items-center justify-center">
            <Newspaper className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Notícias Publicadas</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{newsPublishedCount}</p>
          </div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-transparent text-secondary flex items-center justify-center">
            <Clock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Conteúdo Agendado</p>
            <p className="font-headline-sm text-lg font-bold text-primary">{scheduledCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-white border border-border-subtle rounded-xl p-1 shadow-sm flex items-center gap-1 overflow-x-auto">
        {([
          { key: 'paginas', label: 'Páginas do Site', icon: <FileText className="w-4 h-4" /> },
          { key: 'noticias', label: 'Notícias & Conteúdo', icon: <Newspaper className="w-4 h-4" /> },
          { key: 'apariencia', label: 'Aparência do Website', icon: <Palette className="w-4 h-4" /> },
          { key: 'configuracao', label: 'Configurar Portal', icon: <Settings className="w-4 h-4" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSearch(''); setFilterSeccao('Todas'); setFilterEstado('Todos'); }}
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

      {/* Tab: Páginas do Site */}
      {tab === 'paginas' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          {/* Filtros */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterSeccao} onChange={(e) => setFilterSeccao(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                {seccoes.map((s) => <option key={s} value={s}>{s === 'Todas' ? 'Secção: Todas' : s}</option>)}
              </select>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                <option value="Todos">Estado: Todos</option>
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Agendado">Agendado</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar páginas..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Página</th>
                  <th className="px-3.5 py-3 text-left">Secção</th>
                  <th className="px-3.5 py-3 text-left">Slug (URL)</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-left">Atualizado</th>
                  <th className="px-3.5 py-3 text-left">Autor</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredPages.length ? filteredPages.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">{seccaoIcon(p.seccao)}</div>
                        <span className="font-bold text-primary">{p.titulo}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{p.seccao}</span></td>
                    <td className="px-3.5 py-3"><span className="text-on-surface-variant font-mono text-[11px]">{p.slug}</span></td>
                    <td className="px-3.5 py-3 text-center"><span className={`${statusChip(p.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{p.estado}</span></td>
                    <td className="px-3.5 py-3 text-outline">{p.atualizado}</td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{p.autor}</td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onShowToast(`Pré-visualização de "${p.titulo}" aberta.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Pré-visualizar"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditPage(p)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeletePage(p)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">Nenhuma página encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Notícias & Conteúdo */}
      {tab === 'noticias' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="appearance-none bg-surface border border-border-subtle rounded-md pl-2 pr-7 text-xs focus:outline-none focus:border-secondary py-1 cursor-pointer">
                <option value="Todos">Estado: Todos</option>
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Agendado">Agendado</option>
              </select>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5 stroke-[2]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar notícias..." className="pl-9 pr-3 py-1.5 text-xs bg-surface-white border border-border-subtle rounded-lg focus:outline-none focus:border-secondary font-medium" />
            </div>
          </div>

          <div className="overflow-x-auto border border-border-subtle rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-3.5 py-3 text-left">Notícia</th>
                  <th className="px-3.5 py-3 text-left">Categoria</th>
                  <th className="px-3.5 py-3 text-left">Data</th>
                  <th className="px-3.5 py-3 text-center">Estado</th>
                  <th className="px-3.5 py-3 text-center">Destaque</th>
                  <th className="px-3.5 py-3 text-left">Autor</th>
                  <th className="px-3.5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredNews.length ? filteredNews.map((n) => (
                  <tr key={n.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center"><Newspaper className="w-4 h-4" /></div>
                        <span className="font-bold text-primary">{n.titulo}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{n.categoria}</span></td>
                    <td className="px-3.5 py-3 text-outline">{n.data}</td>
                    <td className="px-3.5 py-3 text-center"><span className={`${statusChip(n.estado)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>{n.estado}</span></td>
                    <td className="px-3.5 py-3 text-center">
                      <button onClick={() => toggleFeatured(n.id)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${n.destacada ? 'bg-secondary/15 text-secondary' : 'bg-surface-container text-outline'}`}>
                        {n.destacada ? '★ Destacada' : '☆ Não'}
                      </button>
                    </td>
                    <td className="px-3.5 py-3 text-on-surface-variant">{n.autor}</td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onShowToast(`Pré-visualização de "${n.titulo}" aberta.`)} className="p-1.5 text-outline hover:text-info rounded hover:bg-info/10 transition-colors cursor-pointer" title="Pré-visualizar"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditNews(n)} className="p-1.5 text-outline hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer" title="Editar"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDeleteNews(n)} className="p-1.5 text-outline hover:text-error rounded hover:bg-error/10 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant font-medium">Nenhuma notícia encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Aparência do Website */}
      {tab === 'apariencia' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Editar a Aparência do Website</h2>
            <p className="text-xs text-on-surface-variant">Personalize o tema, cores, tipografia e layout do portal institucional.</p>
          </div>

          {/* Tema Ativo */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Tema Ativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 't1', nome: 'Navy Corporate (Padrão)', desc: 'Tema institucional navy + laranja', ativo: true },
                { id: 't2', nome: 'Light Minimal', desc: 'Tema claro minimalista com acentos azuis', ativo: false },
                { id: 't3', nome: 'Dark Academic', desc: 'Tema escuro para modo noturno', ativo: false },
              ].map((t) => (
                <div key={t.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${t.ativo ? 'border-secondary bg-secondary/5 shadow-sm' : 'border-border-subtle hover:border-outline-variant hover:shadow-sm'}`} onClick={() => onShowToast(`Tema "${t.nome}" selecionado.`)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center"><Palette className="w-5 h-5" /></div>
                    {t.ativo && <span className="bg-success/15 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">Ativo</span>}
                  </div>
                  <h4 className="text-sm font-bold text-primary">{t.nome}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logótipo e Branding */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Logótipo e Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border-subtle rounded-lg p-4">
                <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-2">Logótipo Principal</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded bg-primary text-surface-white flex items-center justify-center font-bold text-lg">VS</div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onShowToast('Seletor de ficheiro de logótipo aberto.')} className="bg-secondary text-surface-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all"><ImageIcon className="w-3.5 h-3.5" />Carregar Logótipo</button>
                    <span className="text-[10px] text-outline">Recomendado: 512x512px, PNG transparente</span>
                  </div>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4">
                <span className="text-[10px] uppercase font-bold text-outline tracking-wider block mb-2">Favicon</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary text-surface-white flex items-center justify-center font-bold text-xs">VS</div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onShowToast('Seletor de favicon aberto.')} className="border border-border-subtle px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-surface-container transition-all"><ImageIcon className="w-3.5 h-3.5" />Carregar Favicon</button>
                    <span className="text-[10px] text-outline">Recomendado: 32x32px, ICO ou PNG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paleta de Cores */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Paleta de Cores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Cor Primária', color: '#041939' },
                { label: 'Cor Secundária', color: '#fe6b00' },
                { label: 'Fundo', color: '#f8f9fa' },
                { label: 'Texto', color: '#191c1d' },
              ].map((c) => (
                <div key={c.label} className="border border-border-subtle rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded border border-border-subtle" style={{ backgroundColor: c.color }} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider block">{c.label}</span>
                    <span className="text-xs font-mono font-bold text-primary">{c.color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipografia */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Tipografia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Fonte dos Títulos</label>
                <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Hanken Grotesk (Padrão)</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Fonte do Corpo de Texto</label>
                <select className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Hanken Grotesk (Padrão)</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opções de Layout */}
          <div className="mb-4">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Opções de Layout</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                <span className="font-medium">Exibir barra superior com contactos e redes sociais</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                <span className="font-medium">Mostrar banner de notícias em destaque na home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                <span className="font-medium">Ativar modo escuro automático (baseado no sistema)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-surface-container-low/30 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                <span className="font-medium">Exibir rodapé com links institucionais</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button onClick={() => onShowToast('Aparência do website guardada com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm">
              <Save className="w-4 h-4" />Guardar Aparência
            </button>
          </div>
        </div>
      )}

      {/* Tab: Configurar Portal */}
      {tab === 'configuracao' && (
        <div className="bg-surface-white border border-border-subtle  rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Configurar o Portal</h2>
            <p className="text-xs text-on-surface-variant">Definições gerais do portal institucional, SEO, domínio e integrações.</p>
          </div>

          {/* Estrutura do Menu */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Estrutura do Menu do Site</h3>
            <div className="border border-border-subtle rounded-lg p-4 bg-surface-container-low/30">
              <div className="space-y-1 text-xs">
                {[
                  { label: 'Home', icon: <LayoutDashboard className="w-4 h-4" />, level: 0 },
                  { label: 'A Instituição', icon: <Building2 className="w-4 h-4" />, level: 0 },
                  { label: 'Institucional', icon: <FileText className="w-3.5 h-3.5" />, level: 1 },
                  { label: 'Apresentação, Estatutos, Factos e Números, História, Informação Oficial, Organização, I&D, Localização', icon: null, level: 2 },
                  { label: 'Departamentos', icon: <Building2 className="w-3.5 h-3.5" />, level: 1 },
                  { label: 'Engenharia Civil, Engenharia Electrotécnica', icon: null, level: 2 },
                  { label: 'Serviços', icon: <FolderOpen className="w-3.5 h-3.5" />, level: 1 },
                  { label: 'Biblioteca, Serviços Académicos', icon: null, level: 2 },
                  { label: 'Notícias', icon: <Newspaper className="w-4 h-4" />, level: 0 },
                  { label: 'Estudar Aqui', icon: <GraduationCap className="w-4 h-4" />, level: 0 },
                  { label: 'Oferta Formativa, Formas de Ingresso', icon: null, level: 1 },
                  { label: 'Alunos', icon: <FileText className="w-4 h-4" />, level: 0 },
                  { label: 'Calendário Escolar, Horários, Mapa de Exames', icon: null, level: 1 },
                  { label: 'Contactos', icon: <Phone className="w-4 h-4" />, level: 0 },
                  { label: 'Secretaria Online', icon: <MonitorSmartphone className="w-4 h-4" />, level: 0 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2" style={{ paddingLeft: `${item.level * 20}px` }}>
                    {item.icon}
                    <span className={item.level === 0 ? 'font-bold text-primary' : item.level === 1 ? 'font-medium text-on-surface' : 'text-on-surface-variant text-[11px]'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Definições Gerais */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Definições Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Nome do Portal</label>
                <input type="text" defaultValue="Vendaia School® — Portal Institucional" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Domínio</label>
                <input type="text" defaultValue="www.vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Email de Contacto Geral</label>
                <input type="email" defaultValue="geral@vendaia.edu" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Telefone de Contacto</label>
                <input type="text" defaultValue="+244 923 000 000" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Configuração SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Meta Título (Title Tag)</label>
                <input type="text" defaultValue="Vendaia School® — Gestão Académica de Excelência" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Meta Descrição</label>
                <textarea rows={2} defaultValue="Portal institucional da Vendaia School®. Informações sobre matrículas, oferta formativa, serviços académicos e notícias da instituição." className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-outline font-bold text-xs mb-1">Palavras-chave (separadas por vírgula)</label>
                <input type="text" defaultValue="escola, gestão académica, matrículas, ensino secundário, Vendaia School" className="w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Estado do Portal */}
          <div className="mb-6">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Estado do Portal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-success/20 bg-success/5 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Portal Online</span>
                  <span className="text-sm font-bold text-success">Ativo</span>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-info" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Última Atualização</span>
                  <span className="text-sm font-bold text-primary">08 Ago 2026</span>
                </div>
              </div>
              <div className="border border-border-subtle rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-container-low/30 transition-colors" onClick={() => onShowToast('Modo de manutenção ativado. O portal está temporariamente indisponível.')}>
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block">Modo Manutenção</span>
                  <span className="text-sm font-bold text-warning">Ativar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrações */}
          <div className="mb-4">
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">Integrações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { nome: 'Google Analytics', desc: 'Tracking de visitantes e métricas', estado: 'Conectado' },
                { nome: 'Google Search Console', desc: 'Indexação e SEO', estado: 'Conectado' },
                { nome: 'Facebook Pixel', desc: 'Tracking de campanhas', estado: 'Desconectado' },
                { nome: 'Newsletter (Mailchimp)', desc: 'Envio de boletins informativos', estado: 'Conectado' },
              ].map((int) => (
                <div key={int.nome} className="border border-border-subtle rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-primary text-xs">{int.nome}</p>
                    <p className="text-[11px] text-on-surface-variant">{int.desc}</p>
                  </div>
                  <span className={`${int.estado === 'Conectado' ? 'bg-success/15 text-success' : 'bg-surface-container text-outline'} px-2 py-0.5 rounded-full text-[10px] font-bold`}>{int.estado}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button onClick={() => onShowToast('Configurações do portal guardadas com sucesso!')} className="bg-secondary text-surface-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-sm">
              <Save className="w-4 h-4" />Guardar Configurações
            </button>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Página */}
      {pageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><Globe className="w-5 h-5 text-secondary" />{editingPage ? `Editar Página: ${editingPage.titulo}` : 'Nova Página do Site'}</h2>
              <button onClick={() => setPageModal(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={savePage} className="space-y-3 text-xs">
              <label className="block text-outline font-bold">Título da Página<input type="text" required value={pageForm.titulo} onChange={(e) => setPageForm({ ...pageForm, titulo: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <label className="block text-outline font-bold">Slug (URL)<input type="text" value={pageForm.slug} onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="/instituicao/apresentacao" className="mt-1 w-full border border-border-subtle rounded p-2 text-xs font-mono focus:border-secondary focus:outline-none" /><span className="text-[10px] text-outline block mt-1">Deixe vazio para gerar automaticamente.</span></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">Secção do Site<select value={pageForm.seccao} onChange={(e) => setPageForm({ ...pageForm, seccao: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Home</option>
                  <option>A Instituição › Institucional</option>
                  <option>A Instituição › Departamentos</option>
                  <option>A Instituição › Serviços</option>
                  <option>Estudar Aqui</option>
                  <option>Alunos › Alunos da Instituição</option>
                  <option>Contactos</option>
                  <option>Secretaria Online</option>
                </select></label>
                <label className="block text-outline font-bold">Estado<select value={pageForm.estado} onChange={(e) => setPageForm({ ...pageForm, estado: e.target.value as PageItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Rascunho</option>
                  <option>Publicado</option>
                  <option>Agendado</option>
                </select></label>
              </div>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button type="button" onClick={() => setPageModal(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">{editingPage ? 'Guardar' : 'Criar Página'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Página */}
      {confirmDeletePage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeletePage(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover a página <strong className="text-primary">{confirmDeletePage.titulo}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeletePage(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removePage} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Criar/Editar Notícia */}
      {newsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-lg p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><Newspaper className="w-5 h-5 text-secondary" />{editingNews ? `Editar Notícia: ${editingNews.titulo}` : 'Nova Notícia'}</h2>
              <button onClick={() => setNewsModal(false)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={saveNews} className="space-y-3 text-xs">
              <label className="block text-outline font-bold">Título da Notícia<input type="text" required value={newsForm.titulo} onChange={(e) => setNewsForm({ ...newsForm, titulo: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-outline font-bold">Categoria<select value={newsForm.categoria} onChange={(e) => setNewsForm({ ...newsForm, categoria: e.target.value })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Anúncios</option>
                  <option>Académico</option>
                  <option>Eventos</option>
                  <option>Institucional</option>
                  <option>Formação</option>
                  <option>Desporto</option>
                </select></label>
                <label className="block text-outline font-bold">Estado<select value={newsForm.estado} onChange={(e) => setNewsForm({ ...newsForm, estado: e.target.value as NewsItem['estado'] })} className="mt-1 w-full border border-border-subtle rounded p-2 text-xs focus:border-secondary focus:outline-none bg-surface-white">
                  <option>Rascunho</option>
                  <option>Publicado</option>
                  <option>Agendado</option>
                </select></label>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newsForm.destacada} onChange={(e) => setNewsForm({ ...newsForm, destacada: e.target.checked })} className="rounded border-outline-variant text-secondary focus:ring-secondary" />
                <span className="font-bold">Marcar como notícia em destaque (banner da home)</span>
              </label>
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-3">
                <button type="button" onClick={() => setNewsModal(false)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
                <button type="submit" className="bg-secondary text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-secondary/90 transition-all">{editingNews ? 'Guardar' : 'Criar Notícia'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Remoção de Notícia */}
      {confirmDeleteNews && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-white rounded-xl shadow-2xl border border-border-subtle w-full max-w-md p-6 my-8">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Confirmar Remoção</h2>
              <button onClick={() => setConfirmDeleteNews(null)} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Esta ação não pode ser desfeita. Deseja remover a notícia <strong className="text-primary">{confirmDeleteNews.titulo}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteNews(null)} className="border border-border-subtle px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-surface-container transition-all">Cancelar</button>
              <button onClick={removeNews} className="bg-error text-surface-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-error/90 transition-all">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
