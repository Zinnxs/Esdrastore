import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useStore((state) => state.session.role);
  const login = useStore((state) => state.login);
  const clearSession = useStore((state) => state.logout);

  const [customerForm, setCustomerForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'customer' || role === 'admin') {
      const from = location.state?.from || '/pedidos';
      navigate(from, { replace: true });
    }
  }, [location.state, navigate, role]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = customerForm.name.trim();
    const email = customerForm.email.trim();

    if (!name) {
      setError('Informe seu nome.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (name.toUpperCase() === 'ADMIN' && email.toLowerCase() === 'admin@esdrasstore.com') {
      login({ role: 'admin', name: 'ADMIN', email });
      navigate('/admin', { replace: true });
      return;
    }

    login({ role: 'customer', name, email });
    navigate('/pedidos', { replace: true });
  };

  const onLogout = () => {
    clearSession();
    setCustomerForm({ name: '', email: '' });
    setError('');
  };

  if (role === 'customer' || role === 'admin') {
    return <Navigate to={location.state?.from || '/pedidos'} replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] muted">Área de login</p>
        <h1 className="shop-title mt-3 sm:max-w-none">Entrar como usuário</h1>
        <p className="mt-4 text-base leading-7 muted">
          Use seu nome e e-mail para acessar os pedidos. O admin também entra por aqui usando <strong>ADMIN</strong> e <strong>admin@esdrasstore.com</strong>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Field
            label="Nome"
            value={customerForm.name}
            onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Seu nome"
          />
          <Field
            label="E-mail"
            type="email"
            value={customerForm.email}
            onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="voce@email.com"
          />

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Entrar
          </button>

          {error ? <p className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 btn-ghost w-full"
          >
            Limpar sessão local
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="shop-input"
      />
    </label>
  );
}
