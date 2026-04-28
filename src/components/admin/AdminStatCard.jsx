export default function AdminStatCard({ label, value, detail }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{detail}</p>
    </article>
  );
}
