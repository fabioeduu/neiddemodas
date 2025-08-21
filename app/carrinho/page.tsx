'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import data from '../../data/products.json'

type Product = typeof data[number]

export default function CarrinhoPage() {
  const [ids, setIds] = useState<number[]>([])

  // Carrega e atualiza o carrinho ao abrir a página
  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    const add = url.searchParams.get('add')
    let stored: number[] = []
    try {
      const parsed = JSON.parse(localStorage.getItem('cart') || '[]')
      if (Array.isArray(parsed)) {
        stored = parsed.map(Number).filter(n => !isNaN(n))
      }
    } catch {
      stored = []
    }

    if (add) {
      const idn = parseInt(add)
      if (!stored.includes(idn) && !isNaN(idn)) stored.push(idn)
      url.searchParams.delete('add')
      window.history.replaceState({}, '', url.toString())
    }
    // Garante IDs únicos e válidos
    stored = Array.from(new Set(stored.map(Number).filter(n => !isNaN(n))))
    localStorage.setItem('cart', JSON.stringify(stored))
    setIds(stored)
  }, [])

  // Busca os produtos do carrinho
  const items = useMemo(
    () => (Array.isArray(data) ? (data as Product[]).filter(p => ids.includes(p.id)) : []),
    [ids]
  )
  const total = items.reduce((acc, p) => acc + p.price, 0)

  // Remove produto do carrinho
  const remove = (id: number) => {
    const next = ids.filter(x => x !== id)
    localStorage.setItem('cart', JSON.stringify(next))
    setIds(next)
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Carrinho</h1>
      {items.length === 0 ? (
        <div className="text-gray-600">
          Seu carrinho está vazio. <Link href="/" className="text-blue-600">Ver produtos</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="grid gap-3">
            {items.map((p) => (
              <div key={p.id} className="border rounded p-3 flex gap-3 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded border" />
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.brand} • {p.category}</div>
                </div>
                <div className="font-semibold w-28">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                <button
                  onClick={() => remove(p.id)}
                  className="border rounded px-3 py-1 hover:bg-red-50 hover:border-red-400 transition"
                  aria-label={`Remover ${p.title} do carrinho`}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <aside className="border rounded p-4 h-fit sticky-top">
            <div className="flex items-center justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-semibold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <Link href="/checkout">
              <button className="bg-blue-600 text-white rounded px-4 py-2 w-full mt-4 hover:bg-blue-700 transition">
                Finalizar compra
              </button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}