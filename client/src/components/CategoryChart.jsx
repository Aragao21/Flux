import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ totals }) {
  const labels = Object.keys(totals || {});
  const dataValues = Object.values(totals || {});
  const palette = ['#ED1C24', '#0ea5e9', '#16a34a', '#f97316', '#6b7280'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total por categoria',
        data: dataValues.map((v) => Math.abs(v)),
        backgroundColor: labels.map((_, idx) => palette[idx % palette.length]),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="card p-4 flex flex-col gap-4 h-full">
      <div>
        <p className="text-sm text-soft">Gastos por categoria</p>
        <p className="text-lg font-semibold">Extrato inteligente</p>
      </div>
      {labels.length ? (
        <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
      ) : (
        <p className="text-soft text-sm">Nenhuma transação ainda.</p>
      )}
    </div>
  );
}
