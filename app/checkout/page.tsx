'use client'
import { useEffect, useMemo, useState } from 'react'
import data from '../../data/products.json'
import Link from 'next/link'

type Product = {
  id: number
  title: string
  price: number
}

export default function CheckoutPage() {
  const [ids, setIds] = useState<number[]>([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      if (Array.isArray(stored)) {
        // Garante que todos os IDs são números
        setIds(stored.map(Number).filter(n => !isNaN(n)))
      }
    } catch {
      setIds([])
    }
  }, [])

  const items = useMemo(() => {
    if (!Array.isArray(data)) return []
    return (data as Product[]).filter(p => ids.includes(p.id))
  }, [ids])

  const total = items.reduce((acc, p) => acc + p.price, 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.removeItem('cart')
    alert(`Obrigado ${name || 'cliente'}! Pedido de R$ ${total.toFixed(2).replace('.', ',')} recebido.`)
    window.location.href = '/'
  }

  if (items.length === 0) {
    return <div className="text-gray-600">Seu carrinho está vazio. <Link href="/">Ver produtos</Link></div>
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <form onSubmit={submit} className="border rounded p-4">
          <div className="grid gap-3">
            <label className="text-sm">
              Nome completo
              <input className="border rounded px-2 py-1 w-full" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label className="text-sm">
              Endereço
              <input className="border rounded px-2 py-1 w-full" value={address} onChange={e => setAddress(e.target.value)} required />
            </label>
            <div className="text-sm">Pagamento (simulado)</div>
            <button className="bg-blue-600 text-white rounded px-4 py-2 mt-2">
              Finalizar pedido de R$ {total.toFixed(2).replace('.', ',')}
            </button>
          </div>
        </form>
        <aside className="border rounded p-4 h-fit sticky-top">
          <div className="font-semibold mb-2">Resumo do pedido</div>
          <div className="grid gap-2">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="text-sm">{p.title}</div>
                <div className="font-semibold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
              </div>
            ))}
            <div className="border-t pt-2 flex items-center justify-between mt-2">
              <span>Total</span>
              <span className="font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}