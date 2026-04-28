export default function SupportPage() {
  return (
    <main className="bg-zinc-50 px-5 py-12 sm:px-8 sm:py-16">
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
          {['Delivery', 'Returns', 'Warranty'].map((item) => (
            <article
              key={item}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5"
            >
              <h2 className="text-lg font-semibold text-zinc-950">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                Premium support details will live here once service workflows
                are connected.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
