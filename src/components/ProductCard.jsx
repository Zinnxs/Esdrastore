import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';
import { getVariantImageUrl } from '../utils/productImage';

export function ProductCard({ product }) {
  const defaultColor = useMemo(() => product.colors?.[0], [product.colors]);
  const [imageSrc, setImageSrc] = useState(product.image);

  useEffect(() => {
    let isActive = true;

    async function updateImage() {
      if (!product.image || !defaultColor?.hex) {
        setImageSrc(product.image);
        return;
      }

      try {
        const variantUrl = await getVariantImageUrl(product.image, defaultColor.hex);

        if (isActive) {
          setImageSrc(variantUrl);
        }
      } catch {
        if (isActive) {
          setImageSrc(product.image);
        }
      }
    }

    updateImage();

    return () => {
      isActive = false;
    };
  }, [defaultColor, product.image]);

  return (
    <article className="product-card group">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="product-image">
          <img src={imageSrc} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <span key={category} className="product-category">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{product.name}</h3>
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
