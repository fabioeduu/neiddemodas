'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import data from '../../data/products.json'

export default function WishlistPage() {
  const [ids, setIds] = useState<number[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]')
      if (Array.isArray(stored)) {
        setIds(stored.map(Number).filter(n => !isNaN(n)))
      }
    } catch {
      setIds([])
    }
  }, [])

  const items = useMemo(
    () => (Array.isArray(data) ? (data as any[]).filter(p => ids.includes(p.id)) : []),
    [ids]
  )

  const remove = (id: number) => {
    const next = ids.filter(x => x !== id)
    localStorage.setItem('wishlist', JSON.stringify(next))
    setIds(next)
  }

  if (items.length === 0) {
    return (
      <div className="text-gray-600">
        Sua lista de desejos está vazia. <Link href="/">Ver produtos</Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="border rounded p-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} className="w-24 h-24 object-cover rounded" alt={p.title} />
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.brand} • {p.category}</div>
            </div>
            <div className="font-semibold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
            <div className="flex gap-2">
              <button className="border rounded px-3 py-1" onClick={() => remove(p.id)}>Remover</button>
              <Link href={`/produto/${p.id}`} className="border rounded px-3 py-1">Ver</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}