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
      <section className="space-y-6 rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Catálogo</p>
            <h1 className="mt-2 text-3xl font-black text-[#f8f1e3] sm:text-5xl">Explore a coleção completa</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm font-medium text-[#d8c8aa]">
            {filteredProducts.length} produto(s) encontrados
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#d8c8aa]">Buscar por nome ou descrição</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: oversized, jeans, puffer..."
              className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-[#f8f1e3] outline-none transition placeholder:text-[#8a7f72] focus:border-[#c6ad7e]"
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
                    ? 'bg-[#f2e7d5] text-[#111827] shadow-glow'
                    : 'bg-white/5 text-[#f2e7d5] hover:bg-white/10'
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
          <div className="rounded-[32px] border border-dashed border-white/20 bg-[#111827] p-10 text-center">
            <p className="text-xl font-bold text-[#f8f1e3]">Nenhum produto encontrado.</p>
            <p className="mt-2 text-[#d8c8aa]">Tente outra palavra-chave ou limpe o filtro de categoria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
