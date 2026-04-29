import { Navigate, useLocation } from 'react-router-dom';

import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <main className="grid min-h-96 place-items-center bg-zinc-100 px-5 py-20">
        <div className="rounded-lg border border-zinc-200 bg-white px-6 py-5 text-sm font-semibold text-zinc-600 shadow-sm shadow-zinc-950/5">
          Checking admin session
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
