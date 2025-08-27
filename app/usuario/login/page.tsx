"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMsg("");

    if (!email.trim()) {
      setErro("Preencha o e-mail.");
      emailRef.current?.focus();
      return;
    }
    if (!validarEmail(email)) {
      setErro("E-mail inválido.");
      emailRef.current?.focus();
      return;
    }
    if (!senha) {
      setErro("Preencha a senha.");
      senhaRef.current?.focus();
      return;
    }

    // Busca usuário cadastrado no localStorage
    const stored = localStorage.getItem("user");
    if (!stored) {
      setErro("Usuário não encontrado. Cadastre-se.");
      return;
    }
    const user = JSON.parse(stored);
    if (user.email !== email) {
      setErro("E-mail não cadastrado.");
      emailRef.current?.focus();
      return;
    }
    if (user.senha && user.senha !== senha) {
      setErro("Senha incorreta.");
      senhaRef.current?.focus();
      return;
    }

    setLoading(true);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    setMsg("Login realizado!");
    setTimeout(() => {
      setLoading(false);
      router.push("/usuario");
    }, 1000);
  };

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form className="grid gap-4" onSubmit={handleLogin} autoComplete="off">
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="border rounded px-3 py-2 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            ref={emailRef}
            aria-required="true"
            aria-invalid={!!erro && (!email.trim() || !validarEmail(email))}
          />
        </div>
        <div>
          <label htmlFor="senha" className="block font-semibold mb-1">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            className="border rounded px-3 py-2 w-full"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            ref={senhaRef}
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {erro && <div className="text-red-600 font-semibold">{erro}</div>}
        {msg && <div className="text-green-600 font-semibold">{msg}</div>}
      </form>
      <p className="mt-4 text-sm">
        Não tem conta?{" "}
        <a
          href="/usuario/cadastro"
          className="text-blue-600 hover:underline"
        >
          Cadastre-se
        </a>
      </p>
    </main>
  );
}