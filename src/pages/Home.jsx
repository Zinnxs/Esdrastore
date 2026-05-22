import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 rounded-[36px] border border-slate-200 bg-white/85 p-6 shadow-glow backdrop-blur sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
            Coleção 2026
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
              Moda urbana para comprar rápido, explorar fácil e finalizar sem fricção.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Catálogo real, filtros em tempo real, carrinho persistente e checkout com PIX ou cartão. Tudo integrado para navegar e comprar sem sair da aplicação.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Explorar catálogo
            </Link>
            <Link
              to="/carrinho"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Ver carrinho
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">8</p>
              <p className="text-sm text-slate-500">produtos mockados</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">100%</p>
              <p className="text-sm text-slate-500">fluxo funcional</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-950">Live</p>
              <p className="text-sm text-slate-500">pedido no admin</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {featured.map((product, index) => (
            <article
              key={product.id}
              className={`overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50 shadow-sm ${index === 0 ? 'xl:translate-y-8' : ''}`}
            >
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Destaque</p>
                <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                <p className="text-sm leading-6 text-slate-600">{product.description}</p>
                <Link to={`/produto/${product.id}`} className="inline-flex text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4">
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Mais procurados</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Seleção pronta para o catálogo</h2>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 sm:inline">
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
