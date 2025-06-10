import { SimulationForm } from '@/components/SimulationForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
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