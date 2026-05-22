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
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      setFeedback('');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-[#111827] p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <p className="text-2xl font-bold text-[#f8f1e3]">Produto não encontrado.</p>
          <p className="mt-3 text-[#d8c8aa]">Volte para o catálogo e escolha outro item.</p>
          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            className="mt-6 inline-flex rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]"
          >
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
      quantity: 1,
    });
    setFeedback('Produto adicionado ao carrinho com a variação selecionada.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to="/catalogo" className="text-sm font-semibold text-[#f2e7d5] underline decoration-[#c6ad7e] underline-offset-4">
          Voltar ao catálogo
        </Link>
        <p className="text-sm text-[#c6ad7e]">Produto #{product.id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#171717] shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <img src={product.image} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="rounded-full bg-[#f2e7d5] px-3 py-1 text-xs font-semibold text-[#111827]">
                  {category}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-black text-[#f8f1e3] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d8c8aa]">{product.description}</p>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#0b1020] p-5">
            <div>
              <p className="text-sm text-[#d8c8aa]">Preço</p>
              <p className="text-3xl font-black text-[#f8f1e3]">{formatCurrency(product.price)}</p>
            </div>
            <p className="text-sm font-medium text-[#c6ad7e]">Frete calculado no checkout</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Tamanho</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 min-w-12 rounded-2xl border px-4 text-sm font-semibold transition ${
                    selectedSize === size
                      ? 'border-[#f2e7d5] bg-[#f2e7d5] text-[#111827]'
                      : 'border-white/10 bg-white/5 text-[#f2e7d5] hover:border-[#c6ad7e]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Cor</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const selected = selectedColor === color.name;

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        selected ? 'border-[#f2e7d5] bg-[#f2e7d5] text-[#111827]' : 'border-white/10 bg-white/5 text-[#f2e7d5]'
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-white/60"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5"
            >
              Adicionar ao Carrinho
            </button>
            <Link
              to="/carrinho"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0b1020] px-6 py-3 text-sm font-semibold text-[#f8f1e3]"
            >
              Ir para o Carrinho
            </Link>
          </div>

          {feedback ? (
            <p className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">{feedback}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
