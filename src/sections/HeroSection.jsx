import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const visualRef = useRef(null);
  const mainPhoneRef = useRef(null);
  const leftDeviceRef = useRef(null);
  const rightDeviceRef = useRef(null);
  const leftSpecRef = useRef(null);
  const rightSpecRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    let media;
    const context = gsap.context(() => {
      media = gsap.matchMedia();

      media.add('(min-width: 768px)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=70%',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(copyRef.current, { y: -34, opacity: 0.82, ease: 'none' }, 0)
          .to(
            mainPhoneRef.current,
            { y: -18, scale: 1.045, rotation: 1.4, ease: 'none' },
            0,
          )
          .to(
            leftDeviceRef.current,
            { x: -30, y: 24, rotation: -16, opacity: 0.9, ease: 'none' },
            0,
          )
          .to(
            rightDeviceRef.current,
            { x: 30, y: 18, rotation: 16, opacity: 0.92, ease: 'none' },
            0,
          )
          .to(
            [leftSpecRef.current, rightSpecRef.current],
            { y: -22, opacity: 0.8, ease: 'none', stagger: 0.03 },
            0,
          )
          .to(visualRef.current, { y: -10, ease: 'none' }, 0);

        return () => timeline.kill();
      });

      media.add('(max-width: 767px)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(copyRef.current, { y: -12, opacity: 0.9, ease: 'none' }, 0)
          .to(
            mainPhoneRef.current,
            { y: -10, scale: 1.02, rotation: 0.6, ease: 'none' },
            0,
          )
          .to(
            [leftDeviceRef.current, rightDeviceRef.current],
            { y: 8, opacity: 0.9, ease: 'none' },
            0,
          );

        return () => timeline.kill();
      });

    }, heroRef);

    return () => {
      media?.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative isolate overflow-hidden bg-[#050507] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(218,207,190,0.2),transparent_27%),radial-gradient(circle_at_22%_38%,rgba(93,116,139,0.18),transparent_28%),linear-gradient(135deg,#050507_0%,#111113_42%,#030303_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.16)_0%,transparent_42%,rgba(255,255,255,0.03)_52%,transparent_64%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-zinc-50 via-zinc-950/55 to-transparent" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl content-center gap-6 px-5 pb-14 pt-24 sm:min-h-[94vh] sm:gap-10 sm:px-8 sm:pb-24 sm:pt-28 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:pt-24">
        <div ref={copyRef} className="max-w-2xl will-change-transform">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-zinc-400 sm:text-xs sm:tracking-[0.34em]">
            Curated mobile luxury
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.02] text-white sm:mt-5 sm:text-6xl lg:text-7xl">
            Phones and accessories with a quieter kind of power.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
            Luxora brings flagship devices, refined protection, and daily tech
            essentials into one calm shopping experience.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-row">
            <a
              href="#featured"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-6"
            >
              Shop featured
            </a>
            <a
              href="#categories"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-6"
            >
              Browse categories
            </a>
          </div>
        </div>

        <div
          ref={visualRef}
          className="relative mx-auto h-[23rem] w-full max-w-sm will-change-transform sm:h-[31rem] sm:max-w-md lg:h-[39rem] lg:max-w-lg"
        >
          <div className="absolute left-1/2 top-[52%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200/10 blur-3xl sm:h-80 sm:w-80" />
          <div className="absolute left-1/2 top-[59%] h-20 w-72 -translate-x-1/2 rounded-full bg-black/70 blur-2xl sm:top-[55%] sm:h-24 sm:w-[26rem]" />

          <div
            ref={leftSpecRef}
            className="absolute left-[7%] top-[32%] hidden h-24 w-40 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl will-change-transform sm:block"
          >
            <p className="text-xs font-medium text-zinc-400">Finish</p>
            <p className="mt-2 text-sm font-semibold text-white">
              Graphite Titanium
            </p>
          </div>

          <div
            ref={rightSpecRef}
            className="absolute right-[3%] top-[58%] hidden h-24 w-40 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl will-change-transform sm:block"
          >
            <p className="text-xs font-medium text-zinc-400">Charging</p>
            <p className="mt-2 text-sm font-semibold text-white">Mag Dock Duo</p>
          </div>

          <div
            ref={leftDeviceRef}
            className="absolute left-[7%] top-[34%] h-44 w-20 will-change-transform sm:left-[3%] sm:top-[36%] sm:h-60 sm:w-28 lg:h-72 lg:w-32"
          >
            <div
              className="relative h-full w-full -rotate-12 rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 via-white/[0.04] to-white/[0.02] shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-md"
            >
              <div className="absolute left-4 top-4 h-8 w-8 rounded-full border border-white/25 bg-black/25 shadow-inner" />
              <div className="absolute left-9 top-9 h-5 w-5 rounded-full border border-white/20 bg-black/25" />
              <div className="absolute bottom-5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
            </div>
          </div>

          <div className="absolute left-1/2 top-[48%] h-[20rem] w-40 -translate-x-1/2 -translate-y-1/2 sm:h-[25rem] sm:w-60 lg:h-[34rem] lg:w-72">
            <div
              ref={mainPhoneRef}
              className="relative h-full w-full rounded-[2.7rem] border border-white/40 bg-gradient-to-br from-stone-200/30 via-zinc-500/10 to-black/35 p-2 shadow-[0_44px_150px_rgba(0,0,0,0.82)] backdrop-blur-xl will-change-transform"
            >
              <div className="pointer-events-none absolute -inset-px rounded-[2.7rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.58),transparent_28%,rgba(255,255,255,0.09)_58%,rgba(0,0,0,0.5))] opacity-80" />
              <div className="absolute -left-1 top-24 h-14 w-1 rounded-l-full bg-white/25" />
              <div className="absolute -right-1 top-32 h-20 w-1 rounded-r-full bg-black/45" />
              <div className="luxora-mobile-device-float relative h-full overflow-hidden rounded-[2.2rem] border border-white/12 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.25),transparent_18%),linear-gradient(155deg,#111214_0%,#252525_48%,#070707_100%)]">
                <div className="absolute left-1/2 top-4 h-5 w-24 -translate-x-1/2 rounded-full border border-white/5 bg-black/70 shadow-inner" />
                <div className="absolute -right-12 top-14 h-72 w-20 rotate-12 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute right-4 top-20 h-40 w-px rotate-12 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
                <div className="absolute inset-x-8 top-24 h-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute left-6 top-24 h-20 w-20 rounded-full border border-white/10 bg-white/[0.03]">
                  <div className="absolute left-4 top-4 h-7 w-7 rounded-full border border-white/15 bg-black/20" />
                  <div className="absolute bottom-4 right-4 h-5 w-5 rounded-full border border-white/10 bg-black/20" />
                </div>
                <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl sm:bottom-8 sm:left-5 sm:right-5 sm:p-4">
                  <p className="text-xs font-medium text-zinc-400">
                    Aura X1 Pro
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-lg">
                    Night lens system
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={rightDeviceRef}
            className="absolute right-[7%] top-[40%] h-40 w-20 will-change-transform sm:right-[1%] sm:top-[42%] sm:h-56 sm:w-28 lg:h-72 lg:w-32"
          >
            <div
              className="relative h-full w-full rotate-12 rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 via-white/[0.05] to-white/[0.02] shadow-[0_28px_80px_rgba(0,0,0,0.58)] backdrop-blur-md"
            >
              <div className="absolute left-4 top-4 h-9 w-9 rounded-full border border-white/20 bg-black/25" />
              <div className="absolute right-4 top-5 h-6 w-6 rounded-full border border-white/15 bg-black/20" />
              <div className="absolute bottom-6 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
        <a
          href="#categories"
          className="luxora-scroll-cue mx-auto -mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 sm:hidden"
        >
          Shop
          <span className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
        </a>
      </div>
    </section>
  );
}
