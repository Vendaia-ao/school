import React, { createContext, useContext, useState } from 'react';
import { Structure, UserStructureAccess } from '../types';

export const initialStructures: Structure[] = [
  {
    id: 'str-01',
    institutionId: 'inst-01',
    codigo: 'COL-01',
    nome: 'Colégio Kilamba (Sede)',
    tipo: 'college',
    tipoLabel: 'Colégio',
    morada: 'Centralidade do Kilamba, Bloco B, Luanda',
    diretorResponsavel: 'Dra. Sara Silva',
    estudantesCount: 1250,
    professoresCount: 84,
    estado: 'Ativo',
    criadoEm: '15 Jan 2024',
  },
  {
    id: 'str-02',
    institutionId: 'inst-01',
    codigo: 'COL-02',
    nome: 'Colégio Talatona',
    tipo: 'college',
    tipoLabel: 'Colégio',
    morada: 'Via S10, Talatona, Luanda',
    diretorResponsavel: 'Prof. Carlos Mendes',
    estudantesCount: 980,
    professoresCount: 62,
    estado: 'Ativo',
    criadoEm: '20 Fev 2024',
  },
  {
    id: 'str-03',
    institutionId: 'inst-01',
    codigo: 'COL-03',
    nome: 'Colégio Viana',
    tipo: 'college',
    tipoLabel: 'Colégio',
    morada: 'Km 14, Viana, Luanda',
    diretorResponsavel: 'Prof. João Pinto',
    estudantesCount: 870,
    professoresCount: 55,
    estado: 'Ativo',
    criadoEm: '10 Mar 2024',
  },
  {
    id: 'str-04',
    institutionId: 'inst-01',
    codigo: 'CAM-01',
    nome: 'Campus Universitário Central',
    tipo: 'campus',
    tipoLabel: 'Campus Universitário',
    morada: 'Av. 4 de Fevereiro, Marginal de Luanda',
    diretorResponsavel: 'Dr. Fernando Rocha',
    estudantesCount: 1050,
    professoresCount: 75,
    estado: 'Ativo',
    criadoEm: '05 Jan 2025',
  },
  {
    id: 'str-05',
    institutionId: 'inst-01',
    codigo: 'POL-01',
    nome: 'Polo de Formação Benguela',
    tipo: 'polo',
    tipoLabel: 'Polo de Formação',
    morada: 'Bairro Benfica, Benguela',
    diretorResponsavel: 'Dra. Maria Antónia',
    estudantesCount: 700,
    professoresCount: 44,
    estado: 'Ativo',
    criadoEm: '18 Mai 2025',
  },
];

interface AccessContextType {
  institutionName: string;
  structures: Structure[];
  userStructures: Structure[];
  currentStructureId: string; // 'all' ou id da estrutura
  currentStructure: Structure | null;
  isConsolidated: boolean;
  switchStructure: (structureId: string) => void;
  addStructure: (newStruct: Omit<Structure, 'id' | 'criadoEm'>) => void;
  updateStructure: (id: string, updated: Partial<Structure>) => void;
  toggleStructureStatus: (id: string) => void;
  userAccesses: UserStructureAccess[];
  setUserAccesses: React.Dispatch<React.SetStateAction<UserStructureAccess[]>>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutionName] = useState('Grupo Educacional Vendaia®');
  const [structures, setStructures] = useState<Structure[]>(initialStructures);
  const [currentStructureId, setCurrentStructureId] = useState<string>('all');
  const [userAccesses, setUserAccesses] = useState<UserStructureAccess[]>([
    { id: 'acc-1', userId: 'u1', institutionId: 'inst-01', structureId: undefined, isPrimary: true }, // Acesso Global
  ]);

  const activeStructures = structures.filter((s) => s.estado === 'Ativo');

  const isConsolidated = currentStructureId === 'all';
  const currentStructure = isConsolidated ? null : structures.find((s) => s.id === currentStructureId) || null;

  const switchStructure = (structureId: string) => {
    setCurrentStructureId(structureId);
  };

  const addStructure = (newStruct: Omit<Structure, 'id' | 'criadoEm'>) => {
    const created: Structure = {
      ...newStruct,
      id: `str-${Date.now()}`,
      criadoEm: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setStructures((prev) => [created, ...prev]);
  };

  const updateStructure = (id: string, updated: Partial<Structure>) => {
    setStructures((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const toggleStructureStatus = (id: string) => {
    setStructures((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: s.estado === 'Ativo' ? 'Inativo' : 'Ativo' } : s))
    );
  };

  return (
    <AccessContext.Provider
      value={{
        institutionName,
        structures,
        userStructures: activeStructures,
        currentStructureId,
        currentStructure,
        isConsolidated,
        switchStructure,
        addStructure,
        updateStructure,
        toggleStructureStatus,
        userAccesses,
        setUserAccesses,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess deve ser utilizado dentro de um AccessProvider');
  }
  return context;
};
