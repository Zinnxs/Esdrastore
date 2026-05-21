import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const customerSeed = {
  name: '',
  email: '',
};

const adminSeed = {
  email: 'admin@esdrasstore.com',
  password: '',
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useStore((state) => state.session.role);
  const login = useStore((state) => state.login);
  const clearSession = useStore((state) => state.logout);

  const [mode, setMode] = useState('customer');
  const [customerForm, setCustomerForm] = useState(customerSeed);
  const [adminForm, setAdminForm] = useState(adminSeed);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'customer' || role === 'admin') {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [location.state, navigate, role]);

  const handleCustomerSubmit = (event) => {
    event.preventDefault();

    if (customerForm.name.trim().length < 3) {
      setError('Informe seu nome completo.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    login({
      role: 'customer',
      name: customerForm.name.trim(),
      email: customerForm.email.trim(),
    });

    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };

  const handleAdminSubmit = (event) => {
    event.preventDefault();

    if (adminForm.email.trim() !== 'admin@esdrasstore.com' || adminForm.password !== 'admin123') {
      setError('Credenciais de admin inválidas.');
      return;
    }

    login({
      role: 'admin',
      name: 'Administrador',
      email: adminForm.email.trim(),
    });

    navigate('/admin', { replace: true });
  };

  const onLogout = () => {
    clearSession();
    setCustomerForm(customerSeed);
    setAdminForm(adminSeed);
    setError('');
  };

  if (role === 'customer' || role === 'admin') {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Área de login</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">Entre como cliente ou admin</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Clientes entram para comprar. O admin entra para acompanhar e organizar os pedidos pagos.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('customer')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'customer' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Cliente público
            </button>
            <button
              type="button"
              onClick={() => setMode('admin')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'admin' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="mt-6 rounded-[28px] bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">Credenciais de teste do admin</p>
            <p>Email: admin@esdrasstore.com</p>
            <p>Senha: admin123</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-glow sm:p-8">
          {mode === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Entrar como cliente</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Comprar com acesso público</h2>
              </div>
              <Field
                label="Nome"
                value={customerForm.name}
                onChange={(event) => setCustomerForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Seu nome completo"
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
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Entrar e comprar
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Entrar como admin</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Acessar painel de pedidos</h2>
              </div>
              <Field
                label="E-mail"
                type="email"
                value={adminForm.email}
                onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@esdrasstore.com"
              />
              <Field
                label="Senha"
                type="password"
                value={adminForm.password}
                onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Digite a senha"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Entrar no painel
              </button>
            </form>
          )}

          {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Limpar sessão local
          </button>
        </section>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
      />
    </label>
  );
}
