export default function TrustItem({ item }) {
  return (
    <div className="flex gap-3">
      <div
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-xs font-semibold text-zinc-950"
        aria-hidden="true"
      >
        {item.label.slice(0, 1)}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-zinc-950">{item.label}</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{item.detail}</p>
      </div>
    </div>
  );
}
