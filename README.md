# Myh Concept — Next.js (App Router) + Tailwind

Protótipo inspirado no layout de listagem da Posthaus (ex.: Tigor T. Tigre), com:
- Lista de produtos com **filtros**, **ordenar**, **pagina**ção e **badges de desconto**
- Página de **detalhe do produto**
- **Carrinho** com `localStorage`
- **Wishlist** com `localStorage`
- **Checkout** simulado
- **API interna** `/api/produtos` (retorna o JSON)

## Rodando localmente
```bash
npm i
npm run dev
# abra http://localhost:3000
```

## Novas funcionalidades adicionadas
- Página **/wishlist** (lista de desejos) — salva itens no `localStorage`.
- Página **/checkout** — formulário simples que simula o final de compra.
- Mock de login no cabeçalho (localStorage) para testes rápidos.

## Deploy no Vercel (passo a passo)
1. Crie uma conta em https://vercel.com/ (se ainda não tiver).  
2. Faça push do repositório para o GitHub.  
3. No Vercel: "New Project" → importe o repositório.  
4. O Vercel detecta Next.js automaticamente. Defina `NODE_ENV=production` se quiser.  
5. Clique em Deploy — a cada push o Vercel redeploya automaticamente.

Dica: Depois de publicado, nas "Environment Variables" do Vercel você pode adicionar chaves de API (pagamento, etc.) e conectar seu backend real.


## Conectar com backend

Para usar um backend externo (ex.: NestJS) rode o backend em `http://localhost:3001` e inicie o frontend com:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
```

No Vercel configure a variável de ambiente `NEXT_PUBLIC_API_URL` apontando para a URL do backend.
