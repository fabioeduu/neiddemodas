"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validarSenha(senha: string) {
  // Pelo menos 6 caracteres, 1 letra e 1 número
  return senha.length >= 6 && /[a-zA-Z]/.test(senha) && /\d/.test(senha);
}

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const confirmarSenhaRef = useRef<HTMLInputElement>(null);

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMsg("");

    if (!nome.trim()) {
      setErro("Preencha o nome.");
      nomeRef.current?.focus();
      return;
    }
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
    if (!validarSenha(senha)) {
      setErro("A senha deve ter pelo menos 6 caracteres, incluindo letras e números.");
      senhaRef.current?.focus();
      return;
    }
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      confirmarSenhaRef.current?.focus();
      return;
    }
    // Simula verificação de usuário já cadastrado
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === email) {
        setErro("Este e-mail já está cadastrado.");
        emailRef.current?.focus();
        return;
      }
    }
    setLoading(true);
    localStorage.setItem("user", JSON.stringify({ nome, email, senha }));
    window.dispatchEvent(new Event("storage"));
    setMsg("Cadastro realizado com sucesso!");
    setTimeout(() => {
      setLoading(false);
      router.push("/usuario");
    }, 1200);
  };

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form className="grid gap-4" onSubmit={handleCadastro} autoComplete="off">
        <div>
          <label htmlFor="nome" className="block font-semibold mb-1">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            ref={nomeRef}
            aria-required="true"
            aria-invalid={!!erro && !nome.trim()}
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
            aria-invalid={!!erro && (!senha || !validarSenha(senha))}
            minLength={6}
            autoComplete="new-password"
          />
          <span className="text-xs text-gray-500">
            Mínimo 6 caracteres, letras e números.
          </span>
        </div>
        <div>
          <label htmlFor="confirmarSenha" className="block font-semibold mb-1">
            Confirmar senha
          </label>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            className="border rounded px-3 py-2 w-full"
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            required
            ref={confirmarSenhaRef}
            aria-required="true"
            aria-invalid={!!erro && senha !== confirmarSenha}
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        {erro && <div className="text-red-600 font-semibold">{erro}</div>}
        {msg && <div className="text-green-600 font-semibold">{msg}</div>}
      </form>
      <p className="mt-4 text-sm">
        Já tem conta?{" "}
        <a
          href="/usuario/login"
          className="text-blue-600 hover:underline"
        >
          Entrar
        </a>
      </p>
    </main>
  );
}