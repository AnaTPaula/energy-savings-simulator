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
    },
    mode: 'onChange'
  });

  const calculateSavings = (monthlyBill: number) => {
    const discount = 0.25; // 25% de desconto
    const monthlySavings = monthlyBill * discount;
    const monthlyBillWithSavings = monthlyBill - monthlySavings;

    return {
      oneYearSavings: monthlySavings * 12,
      threeYearsSavings: monthlySavings * 36,
      fiveYearsSavings: monthlySavings * 60,
      
      oneYearTotalBill: monthlyBill * 12,
      threeYearsTotalBill: monthlyBill * 36,
      fiveYearsTotalBill: monthlyBill * 60,

      oneYearTotalWithSavings: monthlyBillWithSavings * 12,
      threeYearsTotalWithSavings: monthlyBillWithSavings * 36,
      fiveYearsTotalWithSavings: monthlyBillWithSavings * 60,
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
              <label htmlFor="monthlyBill" className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal da Conta (R$)*</label>
              <input
                id="monthlyBill"
                type="number"
                {...form.register('consumption.monthlyBill', { valueAsNumber: true })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.consumption?.monthlyBill
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.consumption?.monthlyBill && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.consumption.monthlyBill.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Cidade*</label>
              <input
                id="city"
                type="text"
                {...form.register('consumption.city')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.consumption?.city
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.consumption?.city && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.consumption.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)*</label>
              <input
                id="state"
                type="text"
                maxLength={2}
                {...form.register('consumption.state')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.consumption?.state
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.consumption?.state && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.consumption.state.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="supplyType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Fornecimento</label>
              <select
                id="supplyType"
                {...form.register('consumption.supplyType')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.consumption?.supplyType
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="Monofásico">Monofásico</option>
                <option value="Bifásico">Bifásico</option>
                <option value="Trifásico">Trifásico</option>
              </select>
              {form.formState.errors.consumption?.supplyType && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.consumption.supplyType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Seus Dados</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <input
                id="name"
                type="text"
                {...form.register('name')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
              <input
                id="email"
                type="email"
                {...form.register('email')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
              <input
                id="phone"
                type="tel"
                {...form.register('phone')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.phone
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF*</label>
              <input
                id="cpf"
                type="text"
                maxLength={11}
                {...form.register('cpf')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 transition-colors ${
                  form.formState.errors.cpf
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.cpf.message}</p>
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-md min-w-[280px]">
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2 text-center">1 ano</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Total Pago:</span>
              <span className="font-semibold text-gray-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).oneYearTotalBill)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Desconto:</span>
              <span className="font-semibold text-green-600 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).oneYearSavings)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-900 whitespace-nowrap">Total com Desconto:</span>
              <span className="font-bold text-lg text-blue-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).oneYearTotalWithSavings)}</span>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-md min-w-[280px]">
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2 text-center">3 anos</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Total Pago:</span>
              <span className="font-semibold text-gray-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).threeYearsTotalBill)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Desconto:</span>
              <span className="font-semibold text-green-600 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).threeYearsSavings)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-900 whitespace-nowrap">Total com Desconto:</span>
              <span className="font-bold text-lg text-blue-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).threeYearsTotalWithSavings)}</span>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-md min-w-[280px]">
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2 text-center">5 anos</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Total Pago:</span>
              <span className="font-semibold text-gray-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).fiveYearsTotalBill)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 whitespace-nowrap">Desconto:</span>
              <span className="font-semibold text-green-600 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).fiveYearsSavings)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-900 whitespace-nowrap">Total com Desconto:</span>
              <span className="font-bold text-lg text-blue-800 flex-grow text-right ml-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateSavings(form.watch('consumption.monthlyBill')).fiveYearsTotalWithSavings)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
} 