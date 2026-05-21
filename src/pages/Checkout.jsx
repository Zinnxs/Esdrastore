import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency, generateOrderId } from '../utils/format';

const initialForm = {
  name: '',
  email: '',
  cpf: '',
  zip: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

const initialErrors = {
  name: '',
  email: '',
  cpf: '',
  zip: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
};

const paymentTabs = [
  { id: 'pix', label: 'PIX' },
  { id: 'card', label: 'Cartão de Crédito' },
];

export function Checkout() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const createOrder = useStore((state) => state.createOrder);
  const clearCart = useStore((state) => state.clearCart);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !successMessage) {
      setSuccessMessage('');
    }
  }, [cart.length, successMessage]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, successMessage]);

  const total = useMemo(() => subtotal, [subtotal]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    setCardForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = { ...initialErrors };
    const cpfDigits = form.cpf.replace(/\D/g, '');
    const zipDigits = form.zip.replace(/\D/g, '');

    if (form.name.trim().length < 3) nextErrors.name = 'Informe o nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Informe um e-mail válido.';
    if (cpfDigits.length !== 11) nextErrors.cpf = 'CPF deve conter 11 dígitos.';
    if (zipDigits.length !== 8) nextErrors.zip = 'CEP deve conter 8 dígitos.';
    if (form.street.trim().length < 3) nextErrors.street = 'Informe a rua.';
    if (form.number.trim().length < 1) nextErrors.number = 'Informe o número.';
    if (form.neighborhood.trim().length < 2) nextErrors.neighborhood = 'Informe o bairro.';
    if (form.city.trim().length < 2) nextErrors.city = 'Informe a cidade.';
    if (form.state.trim().length !== 2) nextErrors.state = 'Use a sigla do estado.';

    setErrors(nextErrors);

    return Object.values(nextErrors).every((message) => message === '');
  };

  const finalizeOrder = () => {
    const customer = {
      name: form.name.trim(),
      email: form.email.trim(),
      cpf: form.cpf.trim(),
      address: {
        zip: form.zip.trim(),
        street: form.street.trim(),
        number: form.number.trim(),
        complement: form.complement.trim(),
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
      },
    };

    createOrder({
      customer,
      paymentMethod,
      total,
      items: cart,
      id: generateOrderId(),
    });
    clearCart();
    setIsProcessing(false);
    setSuccessMessage('Pagamento aprovado e pedido enviado com sucesso. Você será redirecionado para a Home em instantes.');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0 || isProcessing || successMessage) {
      return;
    }

    const valid = validate();
    if (!valid) {
      return;
    }

    setIsProcessing(true);
    window.setTimeout(finalizeOrder, 900);
  };

  const isCard = paymentMethod === 'card';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Checkout</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Complete seus dados e pague</h1>
        </div>
        <Link to="/carrinho" className="text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4">
          Revisar carrinho
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Dados do comprador</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Nome" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              <Field label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
              <Field label="CPF" name="cpf" value={form.cpf} onChange={handleChange} error={errors.cpf} placeholder="000.000.000-00" />
              <Field label="CEP" name="zip" value={form.zip} onChange={handleChange} error={errors.zip} placeholder="00000-000" />
              <Field label="Rua" name="street" value={form.street} onChange={handleChange} error={errors.street} className="md:col-span-2" />
              <Field label="Número" name="number" value={form.number} onChange={handleChange} error={errors.number} />
              <Field label="Complemento" name="complement" value={form.complement} onChange={handleChange} />
              <Field label="Bairro" name="neighborhood" value={form.neighborhood} onChange={handleChange} error={errors.neighborhood} />
              <Field label="Cidade" name="city" value={form.city} onChange={handleChange} error={errors.city} />
              <Field label="Estado" name="state" value={form.state} onChange={handleChange} error={errors.state} maxLength={2} placeholder="SP" />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Forma de pagamento</p>
            <div className="flex flex-wrap gap-2">
              {paymentTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPaymentMethod(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    paymentMethod === tab.id
                      ? 'bg-slate-950 text-white shadow-glow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isCard ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Cartão de Crédito</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <CardField label="Número do cartão" name="number" value={cardForm.number} onChange={handleCardChange} placeholder="0000 0000 0000 0000" />
                <CardField label="Nome no cartão" name="name" value={cardForm.name} onChange={handleCardChange} placeholder="Como está no cartão" />
                <CardField label="Validade" name="expiry" value={cardForm.expiry} onChange={handleCardChange} placeholder="MM/AA" />
                <CardField label="CVV" name="cvv" value={cardForm.cvv} onChange={handleCardChange} placeholder="123" />
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">PIX</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr] md:items-center">
                <img src="/pix-qr.svg" alt="QR Code PIX" className="h-44 w-44 rounded-3xl border border-slate-200 bg-white p-3" />
                <div className="space-y-3">
                  <p className="text-base font-semibold text-slate-900">Escaneie o QR Code ou use a chave aleatória simulada.</p>
                  <p className="text-sm leading-6 text-slate-600">
                    O fluxo abaixo simula a aprovação imediata do PIX e registra o pedido no painel administrativo.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={cart.length === 0 || isProcessing || !!successMessage}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isCard ? 'Pagar e Finalizar' : 'Simular Pagamento Aprovado'}
          </button>

          {successMessage ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {successMessage}
            </div>
          ) : null}
        </form>

        <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Resumo final</p>
          <div className="mt-4 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.cartId} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.quantity}x • {item.size} • {item.color}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                O carrinho está vazio. Adicione produtos antes de concluir o pagamento.
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-950">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Após o pagamento, o pedido entra automaticamente no painel administrativo com status <strong>Pago</strong>.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder, className = '', maxLength }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

function CardField({ label, name, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        required
      />
    </label>
  );
}
