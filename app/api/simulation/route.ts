import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert lead
      const leadResult = await client.query(
        `INSERT INTO leads (name, email, phone, cpf)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [data.name, data.email, data.phone, data.cpf]
      );

      const leadId = leadResult.rows[0].id;

      // Insert consumption
      await client.query(
        `INSERT INTO consumption (lead_id, monthly_bill_value, city, state, supply_type)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          leadId,
          data.consumption.monthlyBill,
          data.consumption.city,
          data.consumption.state,
          data.consumption.supplyType
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({ success: true, leadId });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao salvar simulação:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar simulação' },
      { status: 500 }
    );
  }
} 