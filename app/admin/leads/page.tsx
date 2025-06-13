'use client';

import { LeadsTable } from '@/components/LeadsTable';
import { LogoutButton } from '@/components/LogoutButton';
import { HomeButton } from '@/components/HomeButton';
import { useEffect, useState } from 'react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLeads();
      }
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listagem de Leads</h1>
        <div className="flex gap-4">
          <HomeButton />
          <LogoutButton />
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar leads..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <LeadsTable leads={leads} onDelete={handleDelete} searchTerm={searchTerm} />
      )}
    </div>
  );
} 