import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Compras com cashback',
    description: 'Registre compras e receba 5% de volta instantaneamente.',
    to: '/servicos/compras',
    accent: '#8b5cf6',
  },
  {
    title: 'Seguro dedicado',
    description: 'Ative cobertura e veja o lançamento no extrato na hora.',
    to: '/servicos/seguro',
    accent: '#0f172a',
  },
  {
    title: 'Empréstimo',
    description: 'Libere crédito direto no saldo com recibo oficial.',
    to: '/servicos/emprestimo',
    accent: '#10b981',
  },
];

export default function Services() {
  return (
    <div className="space-y-4">
      <div className="card p-6 bg-ink text-white flex flex-col gap-2 shadow-lg">
        <h2 className="text-xl font-semibold">Serviços Flux</h2>
        <p className="text-sm text-gray-200">
          Escolha um serviço para lançar compras com cashback, seguros ou empréstimos em telas dedicadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link
            key={service.title}
            to={service.to}
            className="card p-5 space-y-2 border border-gray-100 hover:shadow-lg transition group"
            style={{ borderColor: '#f3f4f6' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">{service.title}</h3>
              <span className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold" style={{ background: service.accent }}>
                →
              </span>
            </div>
            <p className="text-sm text-soft">{service.description}</p>
            <p className="text-sm font-semibold text-flux">Acessar serviço</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
