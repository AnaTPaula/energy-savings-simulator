'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadData } from '@/lib/validations/leadSchema';

export function SimulationForm() {
  const form = useForm<LeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      consumption: {
        monthlyBill: 0,
        city: '',
        state: '',
        supplyType: 'Monofásico'
      }
    }
  });

  const calculateSavings = (monthlyBill: number) => {
    const discount = 0.25; // 25% de desconto
    const monthlySavings = monthlyBill * discount;
    
    return {
      oneYear: monthlySavings * 12,
      threeYears: monthlySavings * 36,
      fiveYears: monthlySavings * 60
    };
  };

  const onSubmit = async (data: LeadData) => {
    try {
      // TODO: Implementar envio para API
      console.log('Dados do lead:', data);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dados de Consumo</h2>
        
        <div>
          <label className="block text-sm font-medium">Valor Mensal da Conta (R$)</label>
          <input
            type="number"
            {...form.register('consumption.monthlyBill', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {form.formState.errors.consumption?.monthlyBill && (
            <p className="text-red-500 text-sm">{form.formState.errors.consumption.monthlyBill.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Cidade</label>
          <input
            type="text"
            {...form.register('consumption.city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Estado (UF)</label>
          <input
            type="text"
            maxLength={2}
            {...form.register('consumption.state')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de Fornecimento</label>
          <select
            {...form.register('consumption.supplyType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="Monofásico">Monofásico</option>
            <option value="Bifásico">Bifásico</option>
            <option value="Trifásico">Trifásico</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Seus Dados</h2>
        
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            {...form.register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            {...form.register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            type="tel"
            {...form.register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">CPF</label>
          <input
            type="text"
            maxLength={11}
            {...form.register('cpf')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {form.watch('consumption.monthlyBill') > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Simulação de Economia</h3>
          <div className="space-y-2">
            <p>Economia em 1 ano: R$ {calculateSavings(form.watch('consumption.monthlyBill')).oneYear.toFixed(2)}</p>
            <p>Economia em 3 anos: R$ {calculateSavings(form.watch('consumption.monthlyBill')).threeYears.toFixed(2)}</p>
            <p>Economia em 5 anos: R$ {calculateSavings(form.watch('consumption.monthlyBill')).fiveYears.toFixed(2)}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Simular Economia
      </button>
    </form>
  );
} 