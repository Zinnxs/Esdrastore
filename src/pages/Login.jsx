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

    const adminEmails = ['admin@xls.com', 'admin@esdrasstore.com'];

    if (name.toUpperCase() === 'ADMIN' && adminEmails.includes(email.toLowerCase())) {
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
      <div className="rounded-[32px] border border-white/10 bg-[#111827] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c6ad7e]">Área de login</p>
        <h1 className="mt-3 text-3xl font-black text-[#f8f1e3] sm:text-4xl">Entrar como usuário</h1>
        <p className="mt-4 text-base leading-7 text-[#d8c8aa]">
          Use seu nome e e-mail para acessar os pedidos. O admin também entra por aqui usando <strong>ADMIN</strong> e <strong>admin@xls.com</strong>.
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
            className="inline-flex w-full items-center justify-center rounded-full bg-[#f2e7d5] px-6 py-3 text-sm font-semibold text-[#111827]"
          >
            Entrar
          </button>

          {error ? <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">{error}</p> : null}

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-[#0b1020] px-6 py-3 text-sm font-semibold text-[#f8f1e3]"
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
      <span className="mb-2 block text-sm font-medium text-[#d8c8aa]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-[#f8f1e3] outline-none transition placeholder:text-[#8a7f72] focus:border-[#c6ad7e]"
      />
    </label>
  );
}
