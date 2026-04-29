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
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const refreshAdmin = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const currentAdmin = await getCurrentAdmin();
      setAdmin(currentAdmin);
    } catch (error) {
      setAdmin(null);

      if (!(error instanceof ApiError && error.status === 401)) {
        setAuthError(getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await loginAdmin({ email, password });
      setAdmin(response.admin);
      return response.admin;
    } catch (error) {
      setAdmin(null);
      const message = getErrorMessage(error);
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      await logoutAdmin();
    } catch {
      // The local admin state should still be cleared if the session is gone.
    } finally {
      setAdmin(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isLoading,
      authError,
      isAuthenticated: Boolean(admin),
      login,
      logout,
      refreshAdmin,
    }),
    [admin, authError, isLoading, login, logout, refreshAdmin],
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
