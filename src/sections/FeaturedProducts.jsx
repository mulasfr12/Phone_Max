import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import ProductCard from '../components/ProductCard.jsx';
import { featuredProducts } from '../data/homeData.js';

export default function FeaturedProducts() {
  return (
    <section id="featured" className="bg-white px-5 py-11 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950 sm:text-4xl">
              Flagship picks, edited down.
            </h2>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              className="featured-products-prev inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-lg text-zinc-950 transition hover:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
              aria-label="Previous featured product"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              type="button"
              className="featured-products-next inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-lg text-zinc-950 transition hover:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
              aria-label="Next featured product"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-zinc-500 sm:hidden">
          Swipe to browse
        </p>

        <Swiper
          className="featured-products-swiper -mx-5 mt-6 px-5 sm:mx-0 sm:mt-8 sm:px-0"
          modules={[A11y, Keyboard, Navigation, Pagination]}
          slidesPerView={1.12}
          spaceBetween={14}
          touchRatio={0.9}
          keyboard={{ enabled: true }}
          navigation={{
            prevEl: '.featured-products-prev',
            nextEl: '.featured-products-next',
          }}
          pagination={{
            clickable: true,
            el: '.featured-products-pagination',
          }}
          a11y={{
            containerMessage: 'Featured products carousel',
            nextSlideMessage: 'Next featured product',
            prevSlideMessage: 'Previous featured product',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="featured-products-pagination mt-5 flex justify-center gap-2 sm:mt-6"
          style={{
            '--swiper-pagination-color': '#09090b',
            '--swiper-pagination-bullet-inactive-color': '#d4d4d8',
            '--swiper-pagination-bullet-inactive-opacity': '1',
            '--swiper-pagination-bullet-size': '7px',
            '--swiper-pagination-bullet-horizontal-gap': '5px',
          }}
        />
      </div>
    </section>
  );
}
