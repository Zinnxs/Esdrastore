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
      <section className="space-y-6 rounded-2xl p-6 bg-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Catálogo</p>
            <h1 className="mt-2 text-3xl font-black text-[color:var(--text)] sm:text-5xl">Explore a coleção completa</h1>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[color:var(--text)]">
            {filteredProducts.length} produto(s) encontrados
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium muted">Buscar por nome ou descrição</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: oversized, jeans, puffer..."
              className="w-full rounded-2xl border bg-white px-4 py-3 text-[color:var(--text)] outline-none transition placeholder:muted"
            />
          </label>

          <div className="flex flex-wrap gap-2 self-end">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category ? 'btn-primary' : 'btn-ghost'
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
          <div className="rounded-2xl border-dashed bg-white p-10 text-center">
            <p className="text-xl font-bold text-[color:var(--text)]">Nenhum produto encontrado.</p>
            <p className="mt-2 muted">Tente outra palavra-chave ou limpe o filtro de categoria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
