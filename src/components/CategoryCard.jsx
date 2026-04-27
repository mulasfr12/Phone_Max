export default function CategoryCard({ category }) {
  return (
    <a
      href={`#${category.id}`}
      className="group flex min-h-44 flex-col justify-between overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
    >
      <div
        className={`relative h-24 overflow-hidden rounded-md bg-gradient-to-br ${category.tone}`}
        aria-hidden="true"
      >
        <div className="absolute left-4 top-5 h-20 w-11 rounded-[1.1rem] border border-white/35 bg-white/10 shadow-2xl backdrop-blur-sm transition duration-300 group-hover:translate-x-2 group-hover:-rotate-3" />
        <div className="absolute bottom-3 right-4 h-8 w-20 rounded-full bg-white/20 blur-md" />
      </div>
      <div className="pt-4">
        <h3 className="text-base font-semibold text-zinc-950">
          {category.name}
        </h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          {category.description}
        </p>
      </div>
    </a>
  );
}
