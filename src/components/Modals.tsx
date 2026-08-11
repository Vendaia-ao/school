import React, { useState, useEffect } from 'react';
import { Student } from '../types';

// Add / Edit Student Modal
interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => void;
  initialData?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeSocial: '',
    dataNascimento: '',
    nacionalidade: 'Portuguesa',
    nif: '',
    cartaoCidadao: '',
    classe: '10º Ano',
    turma: 'Turma A',
    curso: 'Ciências Físicas',
    encarregadoNome: '',
    encarregadoParentesco: 'Pai',
    encarregadoTelefone: '',
    encarregadoEmail: '',
    contactoEstudante: '',
    emailEstudante: '',
    endereco: '',
    codigoPostal: '',
    localidade: 'Lisboa',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nomeCompleto: initialData.nomeCompleto || '',
        nomeSocial: initialData.nomeSocial || '',
        dataNascimento: initialData.dataNascimento || '',
        nacionalidade: initialData.nacionalidade || 'Portuguesa',
        nif: initialData.nif || '',
        cartaoCidadao: initialData.cartaoCidadao || '',
        classe: initialData.classe || '10º Ano',
        turma: initialData.turma || 'Turma A',
        curso: initialData.curso || 'Ciências Físicas',
        encarregadoNome: initialData.encarregadoNome || '',
        encarregadoParentesco: initialData.encarregadoParentesco || 'Pai',
        encarregadoTelefone: initialData.encarregadoTelefone || '',
        encarregadoEmail: initialData.encarregadoEmail || '',
        contactoEstudante: initialData.contactoEstudante || '',
        emailEstudante: initialData.emailEstudante || '',
        endereco: initialData.morada?.endereco || '',
        codigoPostal: initialData.morada?.codigoPostal || '',
        localidade: initialData.morada?.localidade || 'Lisboa',
      });
    } else {
      setFormData({
        nomeCompleto: '',
        nomeSocial: '',
        dataNascimento: '10 Maio 2008',
        nacionalidade: 'Portuguesa',
        nif: '254 111 222',
        cartaoCidadao: '14223981 1 ZX2',
        classe: '10º Ano',
        turma: 'Turma A',
        curso: 'Ciências Físicas',
        encarregadoNome: '',
        encarregadoParentesco: 'Mãe',
        encarregadoTelefone: '+351 912 345 678',
        encarregadoEmail: 'encarregado@email.com',
        contactoEstudante: '+351 912 345 678',
        emailEstudante: '',
        endereco: 'Rua Principal, nº 10',
        codigoPostal: '1000-001',
        localidade: 'Lisboa',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCompleto) return;

    onSave({
      nomeCompleto: formData.nomeCompleto,
      nomeSocial: formData.nomeSocial,
      dataNascimento: formData.dataNascimento,
      nacionalidade: formData.nacionalidade,
      nif: formData.nif,
      cartaoCidadao: formData.cartaoCidadao,
      classe: formData.classe,
      turma: formData.turma,
      curso: formData.curso,
      encarregadoNome: formData.encarregadoNome || 'Encarregado Principal',
      encarregadoParentesco: formData.encarregadoParentesco,
      encarregadoTelefone: formData.encarregadoTelefone,
      encarregadoEmail: formData.encarregadoEmail,
      contactoEstudante: formData.contactoEstudante,
      emailEstudante:
        formData.emailEstudante ||
        `${formData.nomeCompleto.toLowerCase().replace(/\s+/g, '.')}@student.vendaia.edu`,
      morada: {
        endereco: formData.endereco,
        codigoPostal: formData.codigoPostal,
        localidade: formData.localidade,
        concelhoDistrito: `${formData.localidade}, Lisboa`,
      },
      estadoMatricula: initialData ? initialData.estadoMatricula : 'Ativo',
      situacaoFinanceira: initialData ? initialData.situacaoFinanceira : 'Regularizada',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-white rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-border-subtle my-8">
        <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">
              {initialData ? 'edit_note' : 'person_add'}
            </span>
            {initialData ? 'Editar Ficha de Estudante' : 'Nova Inscrição de Estudante'}
          </h2>
          <button onClick={onClose} className="text-outline hover:text-primary p-1 rounded hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Dados Pessoais */}
          <div>
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">
              1. Dados Pessoais do Aluno
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-outline font-bold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  placeholder="Ex: João Miguel Santos Almeida"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Nome Social / Preferido</label>
                <input
                  type="text"
                  value={formData.nomeSocial}
                  onChange={(e) => setFormData({ ...formData, nomeSocial: e.target.value })}
                  placeholder="Ex: João Almeida"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Data de Nascimento</label>
                <input
                  type="text"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  placeholder="Ex: 15 Abril 2008"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Nacionalidade</label>
                <input
                  type="text"
                  value={formData.nacionalidade}
                  onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">NIF</label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Cartão de Cidadão / Passaporte</label>
                <input
                  type="text"
                  value={formData.cartaoCidadao}
                  onChange={(e) => setFormData({ ...formData, cartaoCidadao: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Enquadramento Académico */}
          <div>
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">
              2. Enquadramento Académico
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-outline font-bold mb-1">Classe</label>
                <select
                  value={formData.classe}
                  onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                >
                  <option value="10º Ano">10º Ano</option>
                  <option value="11º Ano">11º Ano</option>
                  <option value="12º Ano">12º Ano</option>
                </select>
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Turma</label>
                <select
                  value={formData.turma}
                  onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                >
                  <option value="Turma A">Turma A</option>
                  <option value="Turma B">Turma B</option>
                  <option value="Turma C">Turma C</option>
                </select>
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Curso / Especialização</label>
                <select
                  value={formData.curso}
                  onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                >
                  <option value="Ciências Físicas">Ciências Físicas</option>
                  <option value="Ciências e Tecnologias">Ciências e Tecnologias</option>
                  <option value="Economia">Economia</option>
                  <option value="Artes Visuais">Artes Visuais</option>
                  <option value="Engenharia Informática">Engenharia Informática</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Encarregado de Educação */}
          <div>
            <h3 className="font-bold text-secondary uppercase text-[10px] tracking-wider mb-2 border-b border-border-subtle/50 pb-1">
              3. Encarregado de Educação & Contactos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-outline font-bold mb-1">Nome do Encarregado</label>
                <input
                  type="text"
                  value={formData.encarregadoNome}
                  onChange={(e) => setFormData({ ...formData, encarregadoNome: e.target.value })}
                  placeholder="Ex: Maria Santos Almeida"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Parentesco</label>
                <select
                  value={formData.encarregadoParentesco}
                  onChange={(e) => setFormData({ ...formData, encarregadoParentesco: e.target.value })}
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                >
                  <option value="Mãe">Mãe</option>
                  <option value="Pai">Pai</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Contacto Telefónico</label>
                <input
                  type="text"
                  value={formData.encarregadoTelefone}
                  onChange={(e) => setFormData({ ...formData, encarregadoTelefone: e.target.value })}
                  placeholder="+351 912 345 678"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-outline font-bold mb-1">Email do Encarregado</label>
                <input
                  type="email"
                  value={formData.encarregadoEmail}
                  onChange={(e) => setFormData({ ...formData, encarregadoEmail: e.target.value })}
                  placeholder="encarregado@email.com"
                  className="w-full border border-border-subtle rounded p-2 focus:border-secondary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-border-subtle px-4 py-2 rounded-lg text-xs font-semibold hover:bg-surface-container"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-secondary text-surface-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 shadow-sm"
            >
              {initialData ? 'Guardar Alterações' : 'Concluir Inscrição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toast Notification Banner Component
export const ToastNotification: React.FC<{ message: string | null; onClose: () => void }> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-on-primary-container/30 animate-in fade-in slide-in-from-right duration-300 max-w-sm">
      <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
      <p className="text-xs font-medium leading-snug">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-on-primary-container/20 rounded-full transition-colors ml-auto">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
