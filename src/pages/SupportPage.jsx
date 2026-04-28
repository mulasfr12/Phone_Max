export default function SupportPage() {
  const supportItems = [
    {
      title: 'Delivery',
      copy: 'Preview delivery guidance for local request orders and future shipping updates.',
    },
    {
      title: 'Returns',
      copy: 'Clear return and exchange paths will be connected when order services arrive.',
    },
    {
      title: 'Warranty',
      copy: 'Product coverage notes will support device and accessory care after launch.',
    },
  ];

  return (
    <main className="bg-zinc-50 px-5 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Support
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-5xl">
            Clear help for premium tech.
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            Support workflows are placeholders for now. Future releases can add
            order tracking, warranty claims, returns, and contact forms.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {supportItems.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {item.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 text-sm leading-7 text-zinc-600 shadow-sm shadow-zinc-950/5 sm:p-6">
          Luxora is currently a frontend-only prototype. Support requests,
          order tracking, and warranty claims are not connected to a backend
          yet.
        </div>
      </section>
    </main>
  );
}
