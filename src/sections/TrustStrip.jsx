import TrustItem from '../components/TrustItem.jsx';
import { trustItems } from '../data/homeData.js';

export default function TrustStrip() {
  return (
    <section id="support" className="bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 border-y border-zinc-200 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <TrustItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
