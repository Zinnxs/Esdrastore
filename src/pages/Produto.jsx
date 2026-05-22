import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

export function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => products.find((item) => item.id === Number(id)), [id]);
  const addToCart = useStore((state) => state.addToCart);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      setQuantity(1);
      setActiveImage(0);
      setFeedback('');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="panel p-10 text-center">
          <p className="text-2xl font-black text-black">Produto não encontrado.</p>
          <p className="mt-3 muted">Volte para o catálogo e escolha outro item.</p>
          <button type="button" onClick={() => navigate('/catalogo')} className="mt-6 btn-primary">
            Ir para o catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setFeedback('Produto adicionado ao carrinho com a variação selecionada.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3 text-sm text-black/55">
        <Link to="/catalogo" className="font-medium text-black underline underline-offset-4">
          Home
        </Link>
        <span>›</span>
        <span>Shop</span>
        <span>›</span>
        <span>Men</span>
        <span>›</span>
        <span className="text-black">T-shirts</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="grid gap-4 lg:grid-cols-[96px_1fr]">
          <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
            {[0, 1, 2].map((thumbIndex) => (
              <button
                key={thumbIndex}
                type="button"
                onClick={() => setActiveImage(thumbIndex)}
                className={`shop-swatch h-20 w-20 rounded-[20px] bg-[#f2f0f1] ${activeImage === thumbIndex ? 'shop-swatch--active' : ''}`}
              >
                <img src={product.image} alt={product.name} className="h-full w-full rounded-[18px] object-contain p-2" />
              </button>
            ))}
          </div>

          <div className="order-1 panel-soft flex min-h-[520px] items-center justify-center p-6 lg:order-2">
            <img src={product.image} alt={product.name} className="max-h-[460px] w-full object-contain" />
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h1 className="shop-title max-w-[12ch]">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm rating-star">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="ml-1 text-black/55">4.5/5</span>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-3xl font-black text-black">{formatCurrency(product.price)}</p>
              <p className="text-2xl font-black text-black/30 line-through">{formatCurrency(product.price * 1.18)}</p>
              <span className="rounded-full bg-[#ff5353]/15 px-3 py-1 text-sm font-semibold text-[#ff5353]">-40%</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">{product.description}</p>
          </div>

          <div className="border-t border-black/10 pt-6">
            <p className="mb-3 text-sm font-medium text-black/60">Select Colors</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const selected = selectedColor === color.name;

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`shop-swatch ${selected ? 'shop-swatch--active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  >
                    {selected ? <span className="text-xs font-black text-white">✓</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-black/10 pt-6">
            <p className="mb-3 text-sm font-medium text-black/60">Choose Size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`shop-size ${selectedSize === size ? 'shop-size--active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row">
            <div className="shop-quantity">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button>
              <span className="min-w-12 px-4 text-center text-sm font-semibold text-black">{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>
            <button type="button" onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
          </div>

          <div className="border-t border-black/10 pt-6">
            <div className="flex flex-wrap gap-2 border-b border-black/10">
              <button type="button" className="shop-tab shop-tab--active">Product Details</button>
              <button type="button" className="shop-tab">Rating & Reviews</button>
              <button type="button" className="shop-tab">FAQs</button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="panel-soft p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">Product Details</p>
                <p className="mt-3 text-sm leading-7 text-black/60">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <span key={category} className="product-category">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-black">All Reviews</h2>
                  <button type="button" className="btn-ghost">Write a Review</button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="review-card">
                    <div className="flex items-center gap-1 text-sm rating-star">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-black">Alex M.</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">Produto bem acabado, ótimo caimento e visual limpo.</p>
                    <p className="mt-4 text-xs text-black/50">Posted on August 15, 2023</p>
                  </article>
                  <article className="review-card">
                    <div className="flex items-center gap-1 text-sm rating-star">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-black">Sam K.</p>
                    <p className="mt-2 text-sm leading-6 text-black/60">A peça ficou exatamente como eu esperava.</p>
                    <p className="mt-4 text-xs text-black/50">Posted on August 14, 2023</p>
                  </article>
                </div>
              </div>
            </div>
          </div>

          {feedback ? (
            <p className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white">{feedback}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
