import Filters from '../components/Filters'
import ProductCard, { type Product } from '../components/ProductCard'
import Pagination from '../components/Pagination'
import localData from '../data/products.json'

// Número de produtos por página
const PAGE_SIZE = 12

// Função para normalizar strings (remove acentos e deixa minúsculo)
function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Busca produtos da API externa, se configurada
async function fetchProductsFromApi() {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) return null
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/products`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Filtra e ordena os produtos conforme os parâmetros de busca/filtro
function filterAndSort(list: Product[], searchParams: URLSearchParams) {
  let arr = list.slice()

  const cat = searchParams.getAll('cat')
  const size = searchParams.getAll('size')
  const color = searchParams.getAll('color')
  const min = parseInt(searchParams.get('min') || '0')
  const max = parseInt(searchParams.get('max') || '0')
  const sort = searchParams.get('sort') || 'offers'
  const q = normalize(searchParams.get('q') || '')

  if (q)
    arr = arr.filter(p =>
      [p.title, p.brand, p.category].some(x => normalize(x).includes(q))
    )
  if (cat.length) arr = arr.filter(p => cat.includes(p.category))
  if (size.length) arr = arr.filter(p => p.sizes.some(s => size.includes(s)))
  if (color.length) arr = arr.filter(p => p.colors.some(c => color.includes(c)))
  if (min) arr = arr.filter(p => p.price >= min)
  if (max) arr = arr.filter(p => p.price <= max)

  switch (sort) {
    case 'offers': arr.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break
    case 'low': arr.sort((a, b) => a.price - b.price); break
    case 'high': arr.sort((a, b) => b.price - a.price); break
    case 'new': arr.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0)); break
  }
  return arr
}

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Converte searchParams para URLSearchParams
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach(x => params.append(k, x))
    else if (typeof v === 'string') params.set(k, v)
  })

  // Busca produtos da API externa ou do JSON local
  const external = await fetchProductsFromApi()
  const products: Product[] = (external && external.length) ? external : (localData as Product[])
  const all = filterAndSort(products, params)
  const page = Math.max(1, parseInt(String(searchParams.page || '1')))
  const total = all.length
  const pageItems = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Gera filtros únicos
  const categories = [...new Set(products.map(p => p.category))].sort()
  const sizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => parseInt(a) - parseInt(b))
  const colors = [...new Set(products.flatMap(p => p.colors))].sort()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <Filters categories={categories} sizes={sizes} colors={colors} />
      <section>
        <div className="flex items-center justify-between border-b pb-3 sticky top-[64px] bg-white z-10">
          <div className="text-sm text-gray-600">{total} produtos</div>
          {/* chips de filtros ativos (resumo simples) */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 py-4">
          {pageItems.map(p => <ProductCard key={p.id} p={p} />)}
        </div>

        <Pagination total={total} pageSize={PAGE_SIZE} />
      </section>
    </div>
  )
}