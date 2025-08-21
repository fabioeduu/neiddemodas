'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Header(){
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(()=>{
    setUser(localStorage.getItem('user'))
    const w = JSON.parse(localStorage.getItem('wishlist') || '[]') as number[]
    setWishlistCount(w.length)
    const onStorage = ()=>{
      setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length)
      setUser(localStorage.getItem('user'))
    }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  }, [])

  const toggleAuth = ()=>{
    if(localStorage.getItem('user')){
      localStorage.removeItem('user')
      setUser(null)
    } else {
      localStorage.setItem('user', 'Fabio')
      setUser('Fabio')
    }
    // trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <header className="border-b">
      <div className="container flex items-center gap-3 py-3">
        <button className="lg:hidden border px-3 py-2 rounded" onClick={()=>setOpen(v=>!v)} aria-label="Abrir filtros">☰</button>
        <Link href="/" className="shrink-0"><Image src="/logo.svg" width={150} height={32} alt="Myh Concept"/></Link>
        <form className="hidden md:flex flex-1 gap-2" onSubmit={e=>e.preventDefault()}>
          <input id="q" className="flex-1 border rounded px-3 py-2" placeholder="Buscar produtos, marcas e mais..." />
          <Link href={{pathname: '/', query: { q: '' }}} className="bg-blue-600 text-white rounded px-4 py-2">Buscar</Link>
        </form>
        <nav className="flex gap-2 items-center">
          <Link href="/wishlist" className="border rounded px-3 py-2">♡ <span className="ml-1 text-sm">({wishlistCount})</span></Link>
          <Link href="/carrinho" className="border rounded px-3 py-2">🛒</Link>
          <button onClick={toggleAuth} className="border rounded px-3 py-2">{user ? `Olá, ${user}` : 'Entrar'}</button>
        </nav>
      </div>
    </header>
  )
}
