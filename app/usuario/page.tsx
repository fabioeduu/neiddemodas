"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserData = {
  nome: string;
  email: string;
};

type Pedido = {
  id: string;
  data: string;
  status: string;
  total: number;
};

export default function UsuarioPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [pedidos] = useState<Pedido[]>([
    {
      id: "12345",
      data: "2025-08-10",
      status: "Entregue",
      total: 199.9,
    },
    {
      id: "12344",
      data: "2025-07-22",
      status: "Em transporte",
      total: 89.5,
    },
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    const onStorage = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogin = () => {
    const userData = { nome: "Usuario", email: "usuario@email.com" };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event("storage"));
  };

  if (!user) {
    return (
      <main className="max-w-md mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
        <p className="mb-4">Você não está logado.</p>
        <button
          className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Entrar
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
      <section className="mb-6">
        <div className="mb-2">
          <span className="font-semibold">Nome:</span> {user.nome}
        </div>
        <div className="mb-2">
          <span className="font-semibold">E-mail:</span> {user.email}
        </div>
        <Link
          href="/usuario/editar"
          className="text-blue-600 hover:underline text-sm"
          title="Editar perfil"
        >
          Editar perfil
        </Link>
      </section>
      <ul className="mb-6 space-y-2">
        <li>
          <Link href="/wishlist" className="text-blue-600 hover:underline">
            Minha Wishlist
          </Link>
        </li>
        <li>
          <Link href="/carrinho" className="text-blue-600 hover:underline">
            Meu Carrinho
          </Link>
        </li>
      </ul>
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Histórico de pedidos</h2>
        {pedidos.length === 0 ? (
          <div className="text-gray-500 text-sm">Nenhum pedido encontrado.</div>
        ) : (
          <ul className="space-y-2">
            {pedidos.map((p) => (
              <li key={p.id} className="border rounded p-3">
                <div>
                  <span className="font-semibold">Pedido:</span> #{p.id}
                </div>
                <div>
                  <span className="font-semibold">Data:</span> {p.data}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {p.status}
                </div>
                <div>
                  <span className="font-semibold">Total:</span> R$ {p.total.toFixed(2).replace('.', ',')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <button
        className="border border-blue-600 text-blue-600 rounded px-6 py-2 font-semibold hover:bg-blue-50 transition"
        onClick={handleLogout}
      >
        Sair
      </button>
    </main>
  );
}