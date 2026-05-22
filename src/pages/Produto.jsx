import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';
import { getVariantImageUrl } from '../utils/productImage';

export function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => products.find((item) => item.id === Number(id)), [id]);
  const addToCart = useStore((state) => state.addToCart);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [displayImage, setDisplayImage] = useState('');
  const [feedback, setFeedback] = useState('');

  const selectedColorData = useMemo(
    () => product?.colors.find((color) => color.name === selectedColor),
    [product, selectedColor],
  );

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      setDisplayImage(product.image);
      setFeedback('');
    }
  }, [product]);

  useEffect(() => {
    let isActive = true;

    async function updateDisplayImage() {
      if (!product) {
        return;
      }

      const colorHex = selectedColorData?.hex;

      if (!colorHex) {
        setDisplayImage(product.image);
        return;
      }

      try {
        const variantUrl = await getVariantImageUrl(product.image, colorHex);

        if (isActive) {
          setDisplayImage(variantUrl);
        }
      } catch {
        if (isActive) {
          setDisplayImage(product.image);
        }
      }
    }

    updateDisplayImage();

    return () => {
      isActive = false;
    };
  }, [product, selectedColorData]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="text-2xl font-bold text-[color:var(--text)]">Produto não encontrado.</p>
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
      quantity: 1,
    });
    setFeedback('Produto adicionado ao carrinho com a variação selecionada.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to="/catalogo" className="text-sm font-semibold text-[color:var(--primary)] underline underline-offset-4">
          Voltar ao catálogo
        </Link>
        <p className="text-sm muted">Produto #{product.id}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-2xl product-card">
          <img src={displayImage || product.image} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <section className="space-y-6 rounded-2xl p-6 bg-white shadow-sm sm:p-8">
          <div>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="product-category">
                  {category}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-black text-[color:var(--text)] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 muted">{product.description}</p>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-5">
            <div>
              <p className="text-sm muted">Preço</p>
              <p className="text-3xl font-black text-[color:var(--text)]">{formatCurrency(product.price)}</p>
            </div>
            <p className="text-sm font-medium muted">Frete calculado no checkout</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Tamanho</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${selectedSize === size ? 'bg-[color:var(--primary)] text-white' : 'btn-ghost'}`}
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
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${selected ? 'bg-[color:var(--primary)] text-white' : 'btn-ghost'}`}
                  >
                    <span className="h-5 w-5 rounded-full border" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleAddToCart} className="btn-primary">Adicionar ao Carrinho</button>
            <Link to="/carrinho" className="btn-ghost">Ir para o Carrinho</Link>
          </div>

          {feedback ? (
            <p className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">{feedback}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
