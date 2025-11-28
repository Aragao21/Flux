import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickActionCard({ title, description, to, accent }) {
  return (
    <Link
      to={to}
      className="card p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition border-gray-200"
      style={{ borderColor: accent }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-soft text-xs">Acessar</p>
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <span className="text-2xl" aria-hidden>
          →
        </span>
      </div>
      <p className="text-sm text-soft">{description}</p>
    </Link>
  );
}
