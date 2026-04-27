function CategoryVisual({ id }) {
  if (id === 'phones') {
    return (
      <>
        <div className="absolute left-7 top-6 h-28 w-14 -rotate-6 rounded-[1.35rem] border border-white/40 bg-white/10 p-1 shadow-2xl shadow-black/40 backdrop-blur-sm transition duration-300 group-hover:-rotate-3">
          <div className="h-full rounded-[1rem] border border-white/10 bg-black/25">
            <div className="mx-auto mt-2 h-1.5 w-7 rounded-full bg-black/55" />
          </div>
        </div>
        <div className="absolute right-8 top-10 h-24 w-12 rotate-6 rounded-[1.25rem] border border-white/30 bg-white/10 p-1 shadow-xl shadow-black/30 backdrop-blur-sm">
          <div className="h-full rounded-[0.9rem] bg-white/5" />
        </div>
      </>
    );
  }

  if (id === 'cases') {
    return (
      <>
        <div className="absolute left-7 top-7 h-24 w-16 -rotate-6 rounded-[1.4rem] border-2 border-white/35 bg-white/5 shadow-2xl shadow-black/35 transition duration-300 group-hover:-rotate-3">
          <div className="absolute left-3 top-3 h-7 w-7 rounded-full border border-white/25 bg-black/20" />
        </div>
        <div className="absolute right-8 top-10 h-20 w-14 rotate-6 rounded-[1.2rem] border-2 border-white/25 bg-white/10" />
      </>
    );
  }

  if (id === 'charging') {
    return (
      <>
        <div className="absolute left-7 top-12 h-14 w-28 rounded-2xl border border-white/30 bg-white/10 shadow-2xl shadow-black/35 backdrop-blur-sm" />
        <div className="absolute left-14 top-7 h-20 w-10 rounded-xl border border-white/30 bg-black/20" />
        <div className="absolute right-8 top-9 h-16 w-5 rounded-full border border-white/25 bg-white/10" />
      </>
    );
  }

  if (id === 'audio') {
    return (
      <>
        <div className="absolute left-9 top-8 h-20 w-14 rounded-full border border-white/30 bg-white/10 shadow-2xl shadow-black/35" />
        <div className="absolute right-10 top-8 h-20 w-14 rounded-full border border-white/30 bg-white/10 shadow-2xl shadow-black/35" />
        <div className="absolute left-1/2 top-7 h-10 w-20 -translate-x-1/2 rounded-t-full border-x border-t border-white/25" />
      </>
    );
  }

  if (id === 'wearables') {
    return (
      <>
        <div className="absolute left-1/2 top-7 h-24 w-16 -translate-x-1/2 rounded-[1.4rem] border border-white/35 bg-white/10 p-1 shadow-2xl shadow-black/35">
          <div className="h-full rounded-[1rem] bg-black/20" />
        </div>
        <div className="absolute left-1/2 top-2 h-9 w-8 -translate-x-1/2 rounded-t-xl border border-white/20 bg-white/10" />
        <div className="absolute bottom-5 left-1/2 h-9 w-8 -translate-x-1/2 rounded-b-xl border border-white/20 bg-white/10" />
      </>
    );
  }

  return (
    <>
      <div className="absolute left-8 top-10 h-16 w-16 rounded-2xl border border-white/25 bg-white/10 shadow-2xl shadow-black/35" />
      <div className="absolute left-16 top-8 h-5 w-24 rotate-12 rounded-full border border-white/30 bg-white/10" />
      <div className="absolute right-8 top-11 h-16 w-7 rounded-full border border-white/25 bg-black/20" />
    </>
  );
}

export default function CategoryCard({ category }) {
  return (
    <a
      href={`#${category.id}`}
      className="group flex min-h-56 flex-col justify-between overflow-hidden rounded-lg border border-zinc-200/80 bg-white p-3 shadow-sm shadow-zinc-950/5 transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-950/10 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
    >
      <div
        className={`relative h-32 overflow-hidden rounded-md bg-gradient-to-br ${category.tone}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.28),transparent_22%)]" />
        <CategoryVisual id={category.id} />
        <div className="absolute bottom-3 left-1/2 h-9 w-32 -translate-x-1/2 rounded-full bg-white/20 blur-xl" />
      </div>
      <div className="px-2 pb-2 pt-4">
        <h3 className="text-lg font-semibold text-zinc-950">
          {category.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {category.description}
        </p>
      </div>
    </a>
  );
}
