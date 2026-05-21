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
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-glow">
          <p className="text-2xl font-bold text-slate-900">Produto não encontrado.</p>
          <p className="mt-3 text-slate-500">Volte para o catálogo e escolha outro item.</p>
          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
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
        <Link to="/catalogo" className="text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4">
          Voltar ao catálogo
        </Link>
        <p className="text-sm text-slate-400">Produto #{product.id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-glow">
          <img src={product.image} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <section className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {category}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{product.description}</p>
          </div>

          <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-5">
            <div>
              <p className="text-sm text-slate-500">Preço</p>
              <p className="text-3xl font-black text-slate-950">{formatCurrency(product.price)}</p>
            </div>
            <p className="text-sm font-medium text-slate-500">Frete calculado no checkout</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Tamanho</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 min-w-12 rounded-2xl border px-4 text-sm font-semibold transition ${
                    selectedSize === size
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Cor</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const selected = selectedColor === color.name;

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'
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
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Adicionar ao Carrinho
            </button>
            <Link
              to="/carrinho"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Ir para o Carrinho
            </Link>
          </div>

          {feedback ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{feedback}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
