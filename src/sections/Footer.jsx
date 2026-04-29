import { Link } from 'react-router-dom';

const footerGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'Phones', to: '/products' },
      { label: 'Accessories', to: '/products' },
      { label: 'Audio', to: '/products' },
      { label: 'Wearables', to: '/products' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Delivery', to: '/support' },
      { label: 'Returns', to: '/support' },
      { label: 'Warranty', to: '/support' },
      { label: 'Contact', to: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About' },
      { label: 'Journal' },
      { label: 'Stores' },
      { label: 'Careers' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 px-5 py-12 text-zinc-300 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_1.4fr]">
        <div>
          <a
            href="#top"
            className="text-base font-semibold uppercase tracking-[0.22em] text-white"
          >
            Luxora
          </a>
          <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
            Premium phones and accessories curated for a quieter, cleaner
            shopping experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-zinc-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-zinc-600">
                        {link.label} coming later
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="text-sm font-semibold text-white">Preview</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/admin"
                  className="text-sm text-zinc-500 transition hover:text-white"
                >
                  Admin mockup
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 Luxora. Frontend storefront preview.</p>
        <p>Local cart and request flow only. No payments or API calls yet.</p>
      </div>
    </footer>
  );
}
