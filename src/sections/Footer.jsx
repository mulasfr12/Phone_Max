const footerGroups = [
  {
    title: 'Shop',
    links: ['Phones', 'Accessories', 'Audio', 'Wearables'],
  },
  {
    title: 'Support',
    links: ['Delivery', 'Returns', 'Warranty', 'Contact'],
  },
  {
    title: 'Company',
    links: ['About', 'Journal', 'Stores', 'Careers'],
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

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 Luxora. Frontend storefront preview.</p>
        <p>Local cart and request flow only. No payments or API calls yet.</p>
      </div>
    </footer>
  );
}
