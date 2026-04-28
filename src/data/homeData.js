import { products } from './products.js';

export const categories = [
  {
    id: 'phones',
    name: 'Phones',
    description: 'Flagship devices, unlocked and ready.',
    tone: 'from-zinc-950 via-zinc-800 to-stone-500',
  },
  {
    id: 'cases',
    name: 'Cases',
    description: 'Slim protection in refined finishes.',
    tone: 'from-stone-900 via-neutral-700 to-zinc-300',
  },
  {
    id: 'charging',
    name: 'Charging',
    description: 'Fast power for desk, travel, and nightstand.',
    tone: 'from-neutral-950 via-slate-800 to-cyan-300',
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Wireless sound with a quieter profile.',
    tone: 'from-zinc-950 via-indigo-950 to-zinc-400',
  },
  {
    id: 'wearables',
    name: 'Wearables',
    description: 'Smart essentials for every day.',
    tone: 'from-neutral-950 via-stone-800 to-amber-200',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Cables, stands, lenses, and daily upgrades.',
    tone: 'from-zinc-950 via-neutral-800 to-emerald-200',
  },
];

export const featuredProducts = products.slice(0, 4);

export const trustItems = [
  {
    id: 'delivery',
    label: 'Fast delivery',
    detail: 'Two-day shipping on curated essentials.',
  },
  {
    id: 'secure',
    label: 'Secure checkout',
    detail: 'Protected payments when checkout arrives.',
  },
  {
    id: 'warranty',
    label: 'Warranty support',
    detail: 'Clear coverage notes for every device.',
  },
  {
    id: 'returns',
    label: 'Easy returns',
    detail: 'Simple return flow planned for launch.',
  },
];

export const brands = [
  'Apple',
  'Samsung',
  'Google',
  'Sony',
  'Nomad',
  'Belkin',
  'Anker',
  'Bose',
];
