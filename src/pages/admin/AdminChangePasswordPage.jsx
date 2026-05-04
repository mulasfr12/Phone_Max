import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { changeAdminPassword } from '../../api/adminAuthApi.js';
import AdminShell from '../../components/admin/AdminShell.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  adminSecurityTokenNotReadyMessage,
  getAdminMutationErrorMessage,
} from '../../utils/adminSecurity.js';

const inputClassName =
  'mt-2 min-h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-950/10';

function getErrorMessage(error) {
  const errors = error.details?.errors;

  if (Array.isArray(errors)) {
    return errors.join(' ');
  }

  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().join(' ');
  }

  return error.message || 'Password could not be changed.';
}

export default function AdminChangePasswordPage() {
  const navigate = useNavigate();
  const { csrfToken, logout } = useAdminAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: null,
  });

  const canSubmit =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmNewPassword &&
    csrfToken &&
    !status.isSubmitting;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setStatus((currentStatus) => ({
      ...currentStatus,
      error: null,
      success: null,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!csrfToken) {
      setStatus({
        isSubmitting: false,
        error: adminSecurityTokenNotReadyMessage,
        success: null,
      });
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: null });

    try {
      await changeAdminPassword(formData, csrfToken);
      setStatus({
        isSubmitting: true,
        error: null,
        success: 'Password updated. Please sign in again.',
      });
      await logout();
      navigate('/admin/login', {
        replace: true,
        state: { message: 'Password updated. Please sign in again.' },
      });
    } catch (error) {
      setStatus({
        isSubmitting: false,
        error: getAdminMutationErrorMessage(
          error,
          getErrorMessage(error),
        ),
        success: null,
      });
    }
  }

  return (
    <AdminShell
      eyebrow="Account security"
      title="Change admin password."
      description="Update the current admin password without exposing credentials or storing tokens in the browser."
    >
      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 sm:p-7">
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Passwords are sent only to the API over the active admin session and
            are never stored in localStorage or sessionStorage.
          </div>

          {!csrfToken && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <p className="font-semibold">Admin security token is not ready.</p>
              <p className="mt-1">{adminSecurityTokenNotReadyMessage}</p>
            </div>
          )}

          {status.error && (
            <div
              className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
              role="alert"
            >
              {status.error}
            </div>
          )}

          {status.success && (
            <div
              className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
              role="status"
            >
              {status.success}
            </div>
          )}

          <label className="mt-6 block text-sm font-semibold text-zinc-800">
            Current password
            <input
              required
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Enter current password"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-zinc-800">
            New password
            <input
              required
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={handleChange}
              className={inputClassName}
              placeholder="At least 8 characters with mixed character types"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-zinc-800">
            Confirm new password
            <input
              required
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Repeat the new password"
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-7 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            {status.isSubmitting ? 'Changing password...' : 'Change password'}
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
