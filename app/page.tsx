import { SimulationForm } from '@/components/SimulationForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center mb-4">
          <Link href="/admin/login">
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Área do Administrador"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" />
              </svg>
              <span className="hidden sm:inline">Área do Administrador</span>
            </button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          Simulador de Economia de Energia
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubra quanto você pode economizar com energia renovável. 
          Preencha os dados abaixo para fazer uma simulação personalizada.
        </p>
        <SimulationForm />
      </div>
    </main>
  );
} 