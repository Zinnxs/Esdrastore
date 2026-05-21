import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span key={category} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>
            </div>
            <p className="shrink-0 text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
          </div>
          <span className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Ver produto
          </span>
        </div>
      </Link>
    </article>
  );
}
