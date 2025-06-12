import { LeadsTable } from '@/components/LeadsTable';
import db from '@/lib/db';

async function getLeads() {
  try {
    const leads = await db.query(`
      SELECT 
        l.id,
        l.name,
        c.city,
        c.state,
        c.monthly_bill_value AS "billValue"
      FROM leads l
      LEFT JOIN consumption c ON l.id = c.lead_id
      ORDER BY l.created_at DESC
    `);
    return leads.rows;
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Listagem de Leads</h1>
      <LeadsTable leads={leads} />
    </div>
  );
} 