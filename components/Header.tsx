"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  nome: string;
  email: string;
};

function getInitials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Carrega usuário e wishlist do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    try {
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
    const w = JSON.parse(localStorage.getItem("wishlist") || "[]") as number[];
    setWishlistCount(w.length);
    const onStorage = () => {
      setWishlistCount(
        JSON.parse(localStorage.getItem("wishlist") || "[]").length
      );
      const stored = localStorage.getItem("user");
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fecha o menu do usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenu(false);
      }
    }
    if (userMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUserMenu(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(search)}`);
    setOpen(false);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-20 shadow-sm">
      <div className="container flex items-center gap-3 py-3">
        {/* Botão menu mobile */}
        <button
          className="lg:hidden border px-3 py-2 rounded"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir filtros"
        >
          ☰
        </button>
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="Ir para o início">
          <Image src="/logo.svg" width={150} height={32} alt="Myh Concept" />
        </Link>
        {/* Desktop search */}
        <form
          className="hidden md:flex flex-1 gap-2"
          onSubmit={handleSearch}
          role="search"
        >
          <input
            id="q"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Buscar produtos, marcas e mais..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar produtos"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2"
            aria-label="Buscar"
          >
            Buscar
          </button>
        </form>
        {/* Navegação */}
        <nav className="flex gap-2 items-center ml-auto">
          <Link href="/wishlist" className="border rounded px-3 py-2 relative" aria-label="Wishlist">
            ♡
            <span className="ml-1 text-sm">({wishlistCount})</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/carrinho" className="border rounded px-3 py-2" aria-label="Carrinho">
            🛒
          </Link>
          {/* Botão de usuário */}
          {!user ? (
            <button
              className="border rounded px-3 py-2"
              aria-label="Entrar"
              title="Clique para acessar sua conta"
              onClick={() => router.push("/usuario/login")}
            >
              Entrar
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 border rounded px-3 py-2"
                aria-label="Menu do usuário"
                onClick={() => setUserMenu((v) => !v)}
                title={user.email}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full font-bold">
                  {getInitials(user.nome)}
                </span>
                <span className="hidden sm:inline">Olá, {user.nome.split(" ")[0]}</span>
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg min-w-[180px] z-50">
                  <Link
                    href="/usuario"
                    className="block px-4 py-2 hover:bg-blue-50"
                    onClick={() => setUserMenu(false)}
                  >
                    Minha conta
                  </Link>
                  <Link
                    href="/usuario/editar"
                    className="block px-4 py-2 hover:bg-blue-50"
                    onClick={() => setUserMenu(false)}
                  >
                    Editar perfil
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-blue-50"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      {/* Mobile search */}
      <form
        className="flex md:hidden gap-2 px-3 pb-3"
        onSubmit={handleSearch}
        role="search"
      >
        <input
          id="q-mobile"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Buscar produtos, marcas e mais..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar produtos"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2"
          aria-label="Buscar"
        >
          Buscar
        </button>
      </form>
      {/* Menu lateral mobile */}
      {open && (
        <div className="fixed inset-0 z-30 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
          {/* Menu */}
          <aside className="relative bg-white w-64 max-w-[80vw] h-full shadow-lg p-6 animate-slide-in-left">
            <button
              className="absolute top-2 right-2 text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              ×
            </button>
            <h2 className="font-bold text-lg mb-4">Filtros</h2>
            {/* Exemplo de filtros */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Categorias</div>
              <ul className="space-y-1">
                <li>
                  <Link href="/?categoria=camisetas" onClick={() => setOpen(false)}>
                    Camisetas
                  </Link>
                </li>
                <li>
                  <Link href="/?categoria=calcas" onClick={() => setOpen(false)}>
                    Calças
                  </Link>
                </li>
                <li>
                  <Link href="/?categoria=acessorios" onClick={() => setOpen(false)}>
                    Acessórios
                  </Link>
                </li>
              </ul>
            </div>
            {/* Adicione mais filtros conforme necessário */}
          </aside>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.2s ease;
        }
      `}</style>
    </header>
  );
}