import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 py-2 lg:py-10">
          <h1 className="shop-title max-w-[11ch] sm:max-w-[12ch]">
            Moda urbana para comprar rápido, explorar fácil e finalizar sem fricção.
          </h1>
          <p className="shop-subtitle max-w-2xl">
            Catálogo real, filtros em tempo real, carrinho persistente e checkout integrado para navegar e comprar com segurança.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/catalogo" className="btn-primary">Explorar catálogo</Link>
            <Link to="/carrinho" className="btn-ghost">Ver carrinho</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="summary-card">
              <p className="text-3xl font-black text-black">8</p>
              <p className="text-sm muted">produtos mockados</p>
            </div>
            <div className="summary-card">
              <p className="text-3xl font-black text-black">100%</p>
              <p className="text-sm muted">fluxo funcional</p>
            </div>
            <div className="summary-card">
              <p className="text-3xl font-black text-black">Live</p>
              <p className="text-sm muted">pedido no admin</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((product, index) => (
            <article key={product.id} className={`product-card ${index === 0 ? 'sm:col-span-2' : ''}`}>
              <div className={index === 0 ? 'product-image min-h-[420px]' : 'product-image min-h-[240px]'}>
                <img src={product.image} alt={product.name} className="max-h-full w-auto object-contain" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] muted">Destaque</p>
                <h2 className="text-xl font-black uppercase tracking-[-0.04em] text-black">{product.name}</h2>
                <p className="text-sm leading-6 muted">{product.description}</p>
                <Link to={`/produto/${product.id}`} className="inline-flex text-sm font-semibold text-black underline underline-offset-4">
                  Ver detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Mais procurados</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-black sm:text-3xl">Seleção pronta para o catálogo</h2>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-black underline underline-offset-4 sm:inline">
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
