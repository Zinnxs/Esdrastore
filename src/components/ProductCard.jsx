import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export function ProductCard({ product }) {
  return (
    <article className="product-card group">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="product-image">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-1 text-sm leading-none rating-star">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span className="ml-1 text-xs font-semibold text-black/60">4.5/5</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span key={category} className="product-category">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-black">{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 muted">{product.description}</p>
            </div>
            <p className="shrink-0 price">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="product-cta">Ver produto</span>
            <button className="btn-ghost" type="button">Adicionar</button>
          </div>
        </div>
      </Link>
    </article>
  );
}
