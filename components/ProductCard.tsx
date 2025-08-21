'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export type Product = {
  id: number
  slug: string
  title: string
  brand: string
  category: string
  price: number
  originalPrice: number
  discount: number
  sizes: string[]
  colors: string[]
  image: string
  rating: number
  installments: number
  new: boolean
}

export default function ProductCard({ p }: { p: Product }) {
  const perInstallment = (p.price / p.installments).toFixed(2).replace('.', ',')
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const w: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setInWishlist(w.includes(p.id))
    // Atualiza o estado se o wishlist mudar em outra aba
    const onStorage = () => {
      const w: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setInWishlist(w.includes(p.id))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [p.id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    const w: number[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (!w.includes(p.id)) w.push(p.id)
    else {
      const idx = w.indexOf(p.id)
      if (idx > -1) w.splice(idx, 1)
    }
    localStorage.setItem('wishlist', JSON.stringify(w))
    setInWishlist(!inWishlist)
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <article className="border rounded-lg overflow-hidden bg-white flex flex-col card-shadow">
      <Link href={`/produto/${p.id}`} className="block aspect-[3/4] overflow-hidden bg-slate-50 relative">
        {p.discount ? (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{p.discount}%
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-150 hover:scale-[1.02]" />
      </Link>
      <div className="p-3 grid gap-1">
        <div className="text-xs text-gray-500">{p.brand} • {p.category}</div>
        <Link href={`/produto/${p.id}`} className="font-semibold leading-tight">{p.title}</Link>
        <div className="flex items-baseline gap-2">
          <div className="font-bold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
          <div className="text-gray-500 line-through text-sm">R$ {p.originalPrice.toFixed(2).replace('.', ',')}</div>
        </div>
        <div className="text-xs text-gray-600">ou {p.installments}x de R$ {perInstallment} sem juros</div>
      </div>
      <div className="px-3 pb-3 flex gap-2 flex-wrap">
        {p.sizes.map(s => <span key={s} className="border rounded px-1.5 py-0.5 text-xs">{s}</span>)}
      </div>
      <div className="px-3 pb-3 mt-auto flex items-center justify-between border-t pt-3">
        <form action={`/carrinho?add=${p.id}`}>
          <button className="bg-blue-600 text-white rounded px-3 py-2 text-sm">Comprar</button>
        </form>
        <button
          onClick={toggleWishlist}
          className={`border rounded px-3 py-2 text-sm ${inWishlist ? 'bg-pink-100 border-pink-400 text-pink-600' : ''}`}
          aria-label={inWishlist ? 'Remover da wishlist' : 'Adicionar à wishlist'}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}