import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ApiError } from '../api/apiClient.js';
import {
  getAdminCsrfToken,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from '../api/adminAuthApi.js';

const AdminAuthContext = createContext(null);

function getErrorMessage(error) {
  const errors = error.details?.errors;

  if (Array.isArray(errors)) {
    return errors.join(' ');
  }

  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().join(' ');
  }

  return error.message || 'Admin authentication failed.';
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const refreshCsrfToken = useCallback(async () => {
    const response = await getAdminCsrfToken();
    setCsrfToken(response.csrfToken);
    return response.csrfToken;
  }, []);

  const refreshAdmin = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const currentAdmin = await getCurrentAdmin();
      await refreshCsrfToken();
      setAdmin(currentAdmin);
    } catch (error) {
      setAdmin(null);
      setCsrfToken(null);

      if (!(error instanceof ApiError && error.status === 401)) {
        setAuthError(getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshCsrfToken]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await loginAdmin({ email, password });
      await refreshCsrfToken();
      setAdmin(response.admin);
      return response.admin;
    } catch (error) {
      setAdmin(null);
      setCsrfToken(null);
      const message = getErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCsrfToken]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      await logoutAdmin();
    } catch {
      // The local admin state should still be cleared if the session is gone.
    } finally {
      setAdmin(null);
      setCsrfToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      csrfToken,
      isLoading,
      authError,
      isAuthenticated: Boolean(admin),
      login,
      logout,
      refreshAdmin,
      refreshCsrfToken,
    }),
    [
      admin,
      authError,
      csrfToken,
      isLoading,
      login,
      logout,
      refreshAdmin,
      refreshCsrfToken,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }

  return context;
}
