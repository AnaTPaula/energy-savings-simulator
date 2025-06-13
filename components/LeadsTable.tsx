'use client';

import { useState } from 'react';

interface Lead {
  id: number;
  name: string;
  city: string;
  state: string;
  billValue: number;
}

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => Promise<void>;
  searchTerm: string;
}

export function LeadsTable({ leads, onDelete, searchTerm }: LeadsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [leadToDeleteId, setLeadToDeleteId] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Lead | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const openConfirmModal = (id: number) => {
    setLeadToDeleteId(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setLeadToDeleteId(null);
  };

  const handleDelete = async () => {
    if (leadToDeleteId === null) return;

    try {
      setIsDeleting(leadToDeleteId);
      closeConfirmModal();
      await onDelete(leadToDeleteId.toString());
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSort = (column: keyof Lead) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    return 0;
  });

  const filteredLeads = sortedLeads.filter((lead) =>
    Object.values(lead).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Nome
              {sortColumn === 'name' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('city')}
            >
              Cidade
              {sortColumn === 'city' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('state')}
            >
              Estado
              {sortColumn === 'state' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('billValue')}
            >
              Valor da Fatura
              {sortColumn === 'billValue' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.state}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(lead.billValue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => openConfirmModal(lead.id)}
                  disabled={isDeleting === lead.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {isDeleting === lead.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir este lead?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isDeleting === leadToDeleteId}
              >
                {isDeleting === leadToDeleteId ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 