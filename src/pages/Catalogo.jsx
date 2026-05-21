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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Catálogo</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Explore a coleção completa</h1>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            {filteredProducts.length} produto(s) encontrados
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Buscar por nome ou descrição</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: oversized, jeans, puffer..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            />
          </label>

          <div className="flex flex-wrap gap-2 self-end">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-slate-950 text-white shadow-glow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-xl font-bold text-slate-900">Nenhum produto encontrado.</p>
            <p className="mt-2 text-slate-500">Tente outra palavra-chave ou limpe o filtro de categoria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
