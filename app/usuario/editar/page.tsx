"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  nome: string;
  email: string;
};

export default function EditarPerfil() {
  const [user, setUser] = useState<UserData>({ nome: "", email: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    try {
      if (stored) setUser(JSON.parse(stored));
    } catch {
      setUser({ nome: "", email: "" });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    setMsg("Perfil atualizado com sucesso!");
    setTimeout(() => {
      router.push("/usuario");
    }, 1000);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome" className="block font-semibold mb-1">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={user.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="border rounded px-3 py-2 w-full"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition"
        >
          Salvar
        </button>
        {msg && <div className="text-green-600">{msg}</div>}
      </form>
    </main>
  );
}