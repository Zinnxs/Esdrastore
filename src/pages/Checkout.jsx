import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/format';

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

export function Checkout() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const session = useStore((state) => state.session);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (session.role === 'customer') {
      setForm((current) => ({
        ...current,
        name: session.name || current.name,
        email: session.email || current.email,
      }));
    }
  }, [session.email, session.name, session.role]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0 || isSubmitting) {
      return;
    }

    const isValid = validate();
    if (!isValid) {
      return;
    }

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

    try {
      setIsSubmitting(true);
      setApiError('');

      sessionStorage.setItem(
        'esdras_stripe_checkout',
        JSON.stringify({
          customer,
          items: cart,
          total: subtotal,
        }),
      );

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível iniciar o checkout da Stripe.');
      }

      if (!data.url) {
        throw new Error('A Stripe não retornou uma URL de checkout.');
      }

      window.location.assign(data.url);
    } catch (error) {
      setApiError(error.message || 'Falha ao iniciar o pagamento.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Checkout</p>
          <h1 className="shop-title sm:max-w-none">Pagamento seguro com Stripe</h1>
        </div>
        <Link to="/carrinho" className="text-sm font-semibold text-black underline underline-offset-4">Revisar carrinho</Link>
      </div>

      {session.role !== 'customer' ? (
        <div className="panel mb-8 p-5">
          <p className="font-semibold">Você precisa entrar como cliente para finalizar a compra.</p>
          <p className="mt-1 text-sm">Use a área de login para acessar como usuário público e continuar para o pagamento.</p>
          <Link to="/login" className="mt-4 btn-primary inline-flex">Ir para login</Link>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="panel space-y-6 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Dados do comprador</p>
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

          <div className="panel-soft p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Stripe Checkout</p>
            <p className="mt-3 text-base leading-7 muted">
              Você será redirecionado para a página segura da Stripe, onde poderá pagar com os métodos disponíveis na sua conta.
            </p>
            <p className="mt-3 text-sm muted">Este fluxo substitui o pagamento falso e mantém a confirmação no retorno do Stripe.</p>
          </div>

          <button type="submit" disabled={cart.length === 0 || isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Redirecionando para a Stripe...' : 'Ir para pagamento seguro'}
          </button>

          {apiError ? <div className="rounded-2xl p-4 text-sm font-medium text-rose-700 bg-rose-100">{apiError}</div> : null}
        </form>

        <aside className="panel h-fit p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Resumo final</p>
          <div className="mt-4 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.cartId} className="flex items-start justify-between gap-4 border-b border-black/10 pb-3">
                  <div>
                    <p className="font-semibold text-black">{item.name}</p>
                    <p className="text-sm muted">{item.quantity}x • {item.size} • {item.color}</p>
                  </div>
                  <p className="font-semibold text-black">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-[#f2f0f1] p-4 text-sm muted">O carrinho está vazio. Adicione produtos antes de concluir o pagamento.</div>
            )}

            <div className="flex items-center justify-between border-t border-black/10 pt-4 text-lg font-black text-black">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="rounded-2xl p-4 text-sm leading-6 muted">Após a aprovação no Stripe, você retorna para uma tela de confirmação e o pedido entra no painel administrativo.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder, className = '', maxLength }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium muted">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="shop-input"
      />
      {error ? <span className="mt-1 block text-xs font-medium text-rose-700">{error}</span> : null}
    </label>
  );
}
