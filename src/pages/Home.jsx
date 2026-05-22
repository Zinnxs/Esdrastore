import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 rounded-[36px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-[#f2e7d5] px-4 py-2 text-sm font-semibold text-[#111827]">
            Coleção 2026
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-[#f8f1e3] sm:text-5xl lg:text-7xl">
              Moda urbana para comprar rápido, explorar fácil e finalizar sem fricção.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[#d8c8aa] sm:text-lg">
              Catálogo real, filtros em tempo real, carrinho persistente e checkout com PIX ou cartão. Tudo integrado para navegar e comprar sem sair da aplicação.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5"
            >
              Explorar catálogo
            </Link>
            <Link
              to="/carrinho"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-[#f8f1e3] transition hover:border-[#c6ad7e]"
            >
              Ver carrinho
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-4">
              <p className="text-2xl font-bold text-[#f8f1e3]">8</p>
              <p className="text-sm text-[#d8c8aa]">produtos mockados</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-4">
              <p className="text-2xl font-bold text-[#f8f1e3]">100%</p>
              <p className="text-sm text-[#d8c8aa]">fluxo funcional</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0b1020] p-4">
              <p className="text-2xl font-bold text-[#f8f1e3]">Live</p>
              <p className="text-sm text-[#d8c8aa]">pedido no admin</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {featured.map((product, index) => (
            <article
              key={product.id}
              className={`overflow-hidden rounded-[30px] border border-white/10 bg-[#171717] shadow-[0_20px_60px_rgba(15,23,42,0.25)] ${index === 0 ? 'xl:translate-y-8' : ''}`}
            >
              <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Destaque</p>
                <h2 className="text-xl font-bold text-[#f8f1e3]">{product.name}</h2>
                <p className="text-sm leading-6 text-[#d8c8aa]">{product.description}</p>
                <Link to={`/produto/${product.id}`} className="inline-flex text-sm font-semibold text-[#f2e7d5] underline decoration-[#c6ad7e] underline-offset-4">
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Mais procurados</p>
            <h2 className="mt-2 text-2xl font-bold text-[#f8f1e3] sm:text-3xl">Seleção pronta para o catálogo</h2>
          </div>
          <Link to="/catalogo" className="hidden text-sm font-semibold text-[#d8c8aa] underline decoration-[#c6ad7e] underline-offset-4 sm:inline">
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
