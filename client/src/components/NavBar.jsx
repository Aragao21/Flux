import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/pix', label: 'PIX' },
  { to: '/pagamentos', label: 'Pagamentos' },
  { to: '/recarga', label: 'Recarga' },
  { to: '/servicos/compras', label: 'Compras + cashback' },
  { to: '/servicos/seguro', label: 'Seguro' },
  { to: '/servicos/emprestimo', label: 'Empréstimo' },
  { to: '/extrato', label: 'Extrato' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/perfil', label: 'Perfil' },
]

export default function NavBar() {
  const { pathname } = useLocation()
  return (
    <nav className="flex gap-2 bg-white border border-gray-100 px-3 py-2 rounded-2xl shadow-sm text-sm font-medium overflow-x-auto">
      <div className="flex gap-2 min-w-full sm:min-w-0">
        {links.map((link) => {
          const active = pathname === link.to
          return (
            <Link
              key={link.to}
              className={`px-3 py-2 rounded-xl transition whitespace-nowrap ${
                active ? 'bg-flux text-white shadow' : 'text-soft hover:bg-gray-100'
              }`}
              to={link.to}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
