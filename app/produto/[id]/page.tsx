import data from '../../../data/products.json'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'

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

  // Para SSR/SSG, use um estado fake só para exemplo
  // Em produção, use um componente Client para interatividade
  // Aqui, só para mostrar a ideia:
  // const [selectedSize, setSelectedSize] = useState(p.sizes[0])
  // const [selectedColor, setSelectedColor] = useState(p.colors[0])

  const perInstallment = (p.price / p.installments).toFixed(2).replace('.', ',')

  return (
    <div className="grid md:grid-cols-2 gap-8 py-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt={`Foto do produto ${p.title}`}
        className="w-full aspect-[3/4] object-cover border rounded-md shadow"
        loading="eager"
      />
      <div className="grid gap-5">
        <div className="text-sm text-gray-600">{p.brand} • {p.category}</div>
        <h1 className="text-3xl font-bold">{p.title}</h1>
        <div className="flex items-baseline gap-4">
          <div className="text-2xl font-bold text-blue-700">R$ {p.price.toFixed(2).replace('.', ',')}</div>
          <div className="text-gray-500 line-through">R$ {p.originalPrice.toFixed(2).replace('.', ',')}</div>
          {p.discount ? (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-{p.discount}%</span>
          ) : null}
        </div>
        <div className="text-sm text-gray-600">ou {p.installments}x de R$ {perInstallment} sem juros</div>

        {/* Tamanhos */}
        <div>
          <div className="font-semibold mb-1">Tamanhos</div>
          <div className="flex gap-2 flex-wrap">
            {p.sizes.map((s: string) => (
              <span
                key={s}
                className="border rounded px-3 py-1 text-sm cursor-pointer hover:bg-blue-100 transition"
                // onClick={() => setSelectedSize(s)}
                // aria-selected={selectedSize === s}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Cores */}
        {p.colors.length > 0 && (
          <div>
            <div className="font-semibold mb-1">Cores</div>
            <div className="flex gap-2 flex-wrap">
              {p.colors.map((c: string) => (
                <span
                  key={c}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: c }}
                  title={c}
                  // onClick={() => setSelectedColor(c)}
                  // aria-selected={selectedColor === c}
                >
                  {/* {selectedColor === c ? '✓' : ''} */}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 mt-4">
          <form action={`/carrinho?add=${p.id}`}>
            <button className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition w-full md:w-auto">
              COMPRAR
            </button>
          </form>
          <form action={`/wishlist?add=${p.id}`} method="POST">
            <button
              type="submit"
              className="border border-blue-600 text-blue-600 rounded px-4 py-2 font-semibold hover:bg-blue-50 transition"
              title="Adicionar à wishlist"
            >
              ♥
            </button>
          </form>
        </div>

        <div className="pt-6 border-t mt-4">
          <Link href="/" className="text-blue-600 hover:underline">← Voltar ao catálogo</Link>
        </div>
      </div>
    </div>
  )
}