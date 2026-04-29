import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

const inputClassName =
  'mt-2 min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white';

export default function AdminLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authError, isAuthenticated, isLoading, login } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitError, setSubmitError] = useState(null);

  const intendedPath = location.state?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to={intendedPath} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setSubmitError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await login(formData.email, formData.password);
      navigate(intendedPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  return (
    <main className="bg-zinc-100 px-5 py-16 sm:px-8 sm:py-24">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 lg:grid-cols-[0.9fr_1fr]">
        <div className="relative hidden min-h-[34rem] bg-zinc-950 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_18%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,rgba(39,39,42,0.9),rgba(9,9,11,1)_60%)]" />
          <div className="absolute left-10 top-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Luxora
            </p>
            <h1 className="mt-3 max-w-sm text-4xl font-semibold tracking-tight">
              Admin access for the catalog floor.
            </h1>
          </div>
          <div className="absolute bottom-10 left-10 right-10 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-zinc-300">
            Admin sessions use an HttpOnly cookie managed by the browser. No
            token is stored in localStorage or sessionStorage.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Admin login
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            Sign in to continue.
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            Use your admin credentials to manage products, categories, and order
            requests.
          </p>

          {(submitError || authError) && (
            <div
              className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
              role="alert"
            >
              {submitError || authError}
            </div>
          )}

          <label className="mt-6 block text-sm font-semibold text-zinc-800">
            Email
            <input
              required
              name="email"
              type="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              className={inputClassName}
              placeholder="admin@example.com"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-zinc-800">
            Password
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-7 w-full rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
