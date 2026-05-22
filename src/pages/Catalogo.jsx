import { useMemo, useState } from 'react';
import { categories, products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Catalogo() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.categories.includes(selectedCategory);

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [product.name, product.description, ...product.categories]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="panel h-fit p-5 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <p className="text-lg font-black uppercase tracking-[-0.04em] text-black">Filters</p>
            <span className="text-sm muted">{filteredProducts.length}</span>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="mb-3 text-sm font-semibold text-black">Categories</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                      selectedCategory === category ? 'bg-black text-white' : 'bg-[#f2f0f1] text-black'
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-xs opacity-70">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-black">Price</p>
              <div className="rounded-full bg-[#f2f0f1] px-4 py-5">
                <div className="relative h-1 rounded-full bg-black">
                  <span className="absolute left-[10%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-black bg-white" />
                  <span className="absolute left-[78%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-black bg-white" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-black/60">
                  <span>$50</span>
                  <span>$200</span>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-black">Colors</p>
              <div className="flex flex-wrap gap-3">
                {['#12b76a', '#f04444', '#f79009', '#7c3aed', '#3b82f6', '#000000', '#ffffff', '#06b6d4'].map((color) => (
                  <span key={color} className="shop-swatch" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Catalog</p>
              <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-black sm:text-5xl">CASUAL</h1>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium muted">Buscar por nome ou descrição</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ex.: oversized, jeans, puffer..."
                  className="shop-input"
                />
              </label>

              <div className="flex items-end justify-between rounded-full bg-[#f2f0f1] px-4 py-3 text-sm font-medium text-black">
                <span>Showing {filteredProducts.length} products</span>
                <span>Sort by: Most Popular ▾</span>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="panel p-10 text-center">
              <p className="text-xl font-black text-black">Nenhum produto encontrado.</p>
              <p className="mt-2 muted">Tente outra palavra-chave ou limpe o filtro de categoria.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
