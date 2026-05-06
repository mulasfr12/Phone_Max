import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { contactConfig } from '../config/contactConfig.js';

function buildWhatsAppUrl() {
  const number = contactConfig.whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent(contactConfig.whatsappDefaultMessage);

  return `https://wa.me/${number}?text=${message}`;
}

export default function WhatsAppButton() {
  const location = useLocation();
  const href = useMemo(buildWhatsAppUrl, []);
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-zinc-950 text-emerald-200 shadow-2xl shadow-zinc-950/25 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="none"
      >
        <path
          d="M7.6 24.4 8.8 20A9.2 9.2 0 1 1 12 23.2l-4.4 1.2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12.8 11.6c.2-.5.4-.5.7-.5h.6c.2 0 .5 0 .7.5l.7 1.7c.1.3.1.6-.1.8l-.5.6c-.2.2-.2.4-.1.7.5 1 1.4 1.9 2.4 2.4.3.1.5.1.7-.1l.6-.5c.2-.2.5-.2.8-.1l1.7.7c.5.2.5.5.5.7v.6c0 .3 0 .5-.5.7-.5.3-1.2.5-1.9.4-3.3-.4-6.8-3.9-7.2-7.2-.1-.7.1-1.4.4-1.9Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
