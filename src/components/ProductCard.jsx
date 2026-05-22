import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_18px_40px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0b1020]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span key={category} className="rounded-full bg-[#f2e7d5] px-3 py-1 text-xs font-semibold text-[#111827]">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#f8f1e3]">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#d8c8aa]">{product.description}</p>
            </div>
            <p className="shrink-0 text-lg font-bold text-[#f8f1e3]">{formatCurrency(product.price)}</p>
          </div>
          <span className="inline-flex rounded-full bg-[#111827] px-4 py-2 text-sm font-medium text-[#f2e7d5]">
            Ver produto
          </span>
        </div>
      </Link>
    </article>
  );
}
