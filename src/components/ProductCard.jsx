export default function ProductCard({ product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl">
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${product.tone}`}
      >
        <div className="absolute inset-x-6 bottom-0 top-8 rounded-t-[2rem] border border-white/30 bg-white/10 shadow-2xl backdrop-blur-md transition duration-300 group-hover:translate-y-1" />
        <div className="absolute left-1/2 top-9 h-2 w-12 -translate-x-1/2 rounded-full bg-black/35" />
        <div className="absolute bottom-5 left-1/2 h-12 w-36 -translate-x-1/2 rounded-full bg-white/20 blur-xl" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase text-zinc-500">
          {product.finish}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-zinc-950">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
          {product.spec}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-base font-semibold text-zinc-950">
            {product.price}
          </p>
          <button
            type="button"
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
