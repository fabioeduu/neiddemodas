import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'


export const metadata = {
  title: 'Neidde Modas',
  description: 'Site de moda feminina feito por Neidde Modas',
}
export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-neutral-900">
        <Header/>
        <main className="container py-4">{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
