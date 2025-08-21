export default function Footer(){
  return (
    <footer className="border-t py-8 mt-10 text-sm text-gray-600">
      <div className="container flex items-center justify-between flex-wrap gap-3">
        <p>© {new Date().getFullYear()} Myh Concept — Protótipo educacional inspirado em Posthaus.</p>
        <nav className="flex gap-4">
          <a href="#">Privacidade</a>
          <a href="#">Trocas & Devoluções</a>
          <a href="#">Contato</a>
        </nav>
      </div>
    </footer>
  )
}
