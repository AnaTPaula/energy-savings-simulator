'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema, AdminLoginData } from '@/lib/validations/adminLoginSchema';
import { useRouter } from 'next/navigation';
import { HomeButton } from '@/components/HomeButton';

export default function AdminLoginPage() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: AdminLoginData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer login');
      }

      // Wait a moment to ensure the cookie is processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to the leads page
      router.push('/admin/leads');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-4 right-4">
        <HomeButton />
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login Administrador</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            {...form.register('email')}
            disabled={isLoading}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !form.formState.isValid}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
} 