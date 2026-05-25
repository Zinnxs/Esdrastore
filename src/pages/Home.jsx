import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 rounded-2xl p-6 bg-white shadow-md sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white">
            Coleção 2026
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--text)] sm:text-5xl lg:text-7xl">
              XLS mistura streetwear com estética neo-brutal, em um catálogo direto, agressivo e fácil de navegar.
            </h1>
            <p className="max-w-xl text-base leading-7 muted sm:text-lg">
              Catálogo real, filtros em tempo real, carrinho persistente e checkout integrado para navegar e comprar com segurança.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogo" className="btn-primary">Explorar catálogo</Link>
            <Link to="/carrinho" className="btn-ghost">Ver carrinho</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-[color:var(--text)]">8</p>
              <p className="text-sm muted">produtos mockados</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-[color:var(--text)]">100%</p>
              <p className="text-sm muted">fluxo funcional</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-[color:var(--text)]">Live</p>
              <p className="text-sm muted">pedido no admin</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {featured.map((product, index) => (
            <article key={product.id} className={`product-card ${index === 0 ? 'xl:translate-y-2' : ''}`}>
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] muted">Destaque</p>
                <h2 className="text-xl font-bold text-[color:var(--text)]">{product.name}</h2>
                <p className="text-sm leading-6 muted">{product.description}</p>
                <Link to={`/produto/${product.id}`} className="inline-flex text-sm font-semibold text-[color:var(--primary)] underline underline-offset-4">
                  Ver detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Mais procurados</p>
            <h2 className="mt-2 text-2xl font-bold text-[color:var(--text)] sm:text-3xl">Seleção pronta para o catálogo</h2>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold muted underline underline-offset-4 sm:inline">
            Abrir catálogo completo
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
