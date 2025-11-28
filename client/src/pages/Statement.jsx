import React, { useEffect, useState } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryChart from '../components/CategoryChart';
import useFluxStore from '../store/useFluxStore';

export default function Statement() {
  const { transactions, totals, refreshData, balance, tags, createTag, setTagFilter, tagFilter } = useFluxStore();
  const [newTag, setNewTag] = useState({ name: '', color: '#ED1C24' });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) return;
    await createTag(newTag);
    setNewTag({ name: '', color: '#ED1C24' });
  };

  const handleFilter = async (value) => {
    setTagFilter(value);
    await refreshData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Extrato inteligente</h2>
          <p className="text-sm text-soft">Categorias automáticas e etiquetas personalizadas para filtrar seu histórico</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm">
          Saldo atualizado: <span className="font-semibold">R$ {balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <form className="card p-4 space-y-3 md:col-span-2" onSubmit={handleCreateTag}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs uppercase text-soft tracking-wide">Criar etiqueta</p>
              <p className="text-sm text-ink font-semibold">Organize seus gastos por categorias próprias</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-soft">Cor</label>
              <input
                type="color"
                className="w-12 h-10 rounded-lg border border-gray-200"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                aria-label="Cor da etiqueta"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                className="input-base"
                placeholder="Ex.: Viagem, Educação, Saúde"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="button-primary">Salvar etiqueta</button>
          </div>
          <p className="text-xs text-soft">As etiquetas ficam disponíveis em PIX, pagamentos e serviços.</p>
        </form>
        <div className="card p-4 space-y-2">
          <p className="text-xs uppercase text-soft tracking-wide">Filtrar por etiqueta</p>
          <select
            className="input-base"
            value={tagFilter}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option>Todas</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-soft">Use para focar em gastos ou créditos com etiquetas específicas.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
        <CategoryChart totals={totals} />
      </div>
    </div>
  );
}
