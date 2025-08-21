import data from '../../../data/products.json'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

type Product = {
  id: number
  title: string
  brand: string
  category: string
  image: string
  price: number
  originalPrice: number
  discount?: number
  installments: number
  sizes: string[]
  colors: string[]
}

function getProductById(id: string): Product | undefined {
  if (!Array.isArray(data)) return undefined
  return (data as Product[]).find((x) => String(x.id) === id)
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = getProductById(params.id)
  if (!p) return { title: 'Produto não encontrado' }
  return { title: `${p.title} | Myh Concept` }
}

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const p = getProductById(params.id)
  if (!p) return notFound()

  const perInstallment = (p.price / p.installments).toFixed(2).replace('.', ',')

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt={p.title} className="w-full aspect-[3/4] object-cover border rounded-md" />
      <div className="grid gap-3">
        <div className="text-sm text-gray-600">{p.brand} • {p.category}</div>
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        <div className="flex items-baseline gap-3">
          <div className="text-2xl font-bold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
          <div className="text-gray-500 line-through">R$ {p.originalPrice.toFixed(2).replace('.', ',')}</div>
          {p.discount ? <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-{p.discount}%</span> : null}
        </div>
        <div className="text-sm text-gray-600">ou {p.installments}x de R$ {perInstallment} sem juros</div>

        <div>
          <div className="font-semibold mb-1">Tamanhos</div>
          <div className="flex gap-2 flex-wrap">{p.sizes.map((s: string) => <span key={s} className="border rounded px-2 py-1 text-sm">{s}</span>)}</div>
        </div>

        <form action={`/carrinho?add=${p.id}`}>
          <button className="bg-blue-600 text-white rounded px-4 py-2 w-full md:w-auto">COMPRAR</button>
        </form>

        <div className="pt-4 border-t">
          <Link href="/" className="text-blue-600">← Voltar ao catálogo</Link>
        </div>
      </div>
    </div>
  )
}