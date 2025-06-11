'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadData } from '@/lib/validations/leadSchema';
import { Modal } from './Modal';
import Link from 'next/link';

export function SimulationForm() {
  const [showSimulation, setShowSimulation] = useState(false);
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
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar simulação');
      }

      setShowSimulation(true);
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao salvar simulação. Por favor, tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setShowSimulation(false);
    form.reset();
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Dados de Consumo</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal da Conta (R$)</label>
              <input
                type="number"
                {...form.register('consumption.monthlyBill', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {form.formState.errors.consumption?.monthlyBill && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.consumption.monthlyBill.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                {...form.register('consumption.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                {...form.register('consumption.state')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Fornecimento</label>
              <select
                {...form.register('consumption.supplyType')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="Monofásico">Monofásico</option>
                <option value="Bifásico">Bifásico</option>
                <option value="Trifásico">Trifásico</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Seus Dados</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                {...form.register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                {...form.register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                {...form.register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                maxLength={11}
                {...form.register('cpf')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <button
            type="submit"
            disabled={!form.formState.isValid}
            className={`w-full py-3 px-4 rounded-md transition-all transform hover:scale-[1.02] ${
              form.formState.isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Simular Economia
          </button>
        </div>
      </form>

      <Modal
        isOpen={showSimulation && form.watch('consumption.monthlyBill') > 0}
        onClose={handleCloseModal}
        title="Simulação de Economia"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">Economia em 1 ano:</span>
            <span className="font-semibold text-green-600">R$ {calculateSavings(form.watch('consumption.monthlyBill')).oneYear.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">Economia em 3 anos:</span>
            <span className="font-semibold text-green-600">R$ {calculateSavings(form.watch('consumption.monthlyBill')).threeYears.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Economia em 5 anos:</span>
            <span className="font-semibold text-green-600">R$ {calculateSavings(form.watch('consumption.monthlyBill')).fiveYears.toFixed(2)}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
} 