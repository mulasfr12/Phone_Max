import { NavLink } from 'react-router-dom';

const adminLinks = [
  { label: 'Overview', to: '/admin', end: true },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Categories', to: '/admin/categories' },
];

export default function AdminShell({ eyebrow, title, description, children }) {
  return (
    <main className="bg-zinc-100 px-4 py-6 sm:px-8 sm:py-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="rounded-lg bg-zinc-950 p-4 text-white shadow-2xl shadow-zinc-950/15 lg:sticky lg:top-28 lg:self-start">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Luxora
            </p>
            <h2 className="mt-2 text-xl font-semibold">Admin</h2>
          </div>
          <nav className="mt-4 grid gap-1" aria-label="Admin navigation">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/80 ${
                    isActive
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-zinc-400">
            Frontend-only admin mockup. No protected access, persistence, or
            backend connection exists yet.
          </p>
        </aside>

        <div>
          <header className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
              {description}
            </p>
          </header>

          <div className="mt-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
