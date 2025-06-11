'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, AdminLoginData } from '@/lib/validations/adminLoginSchema';

export default function AdminLoginPage() {
  const form = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: AdminLoginData) => {
    // TODO: Implementar autenticação real
    alert(`Login: ${data.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login Administrador</h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            {...form.register('email')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            {...form.register('password')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!form.formState.isValid}
          className={`w-full py-3 px-4 rounded-md transition-all transform hover:scale-[1.02] ${
            form.formState.isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Entrar
        </button>
      </form>
    </div>
  );
} 