"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type HeroImg = { id: string; url: string; caption?: string | null };

export default function HeroCarousel({ images }: { images: HeroImg[] }) {
  const [active, setActive] = useState(0);
  const slides: Array<HeroImg | { gradient: string }> = images.length > 0 ? images : FALLBACK;

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    if (index === active) return;
    setActive(index);
  };

  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden sm:min-h-[620px] lg:min-h-[700px]">
      {/* Crossfading background slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={"id" in slide ? slide.id : i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            {"url" in slide && slide.url ? (
              <Image
                src={slide.url}
                alt=""
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className={`h-full w-full ${(slide as any).gradient}`} />
            )}
          </div>
        ))}
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Free marketing for property owners
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
            We fill your building.
            <br />
            <span className="bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 bg-clip-text text-transparent">
              You connect it with us.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-base text-white/90 drop-shadow-lg sm:text-lg">
            Nyumbatuh lists and markets your apartments, offices, or buildings to tenants — completely free.
            In exchange, we become your building's exclusive fiber internet partner.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="group relative overflow-hidden rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/40 active:scale-95"
            >
              <span className="relative z-10">List your property, free</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              See live listings
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { value: "Free", label: "Property marketing" },
              { value: "1", label: "Exclusive ISP contract" },
              { value: "24h", label: "Typical review time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm transition hover:bg-white/10"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goToSlide((active - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((active + 1) % slides.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-white shadow-lg shadow-white/20"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce sm:block">
        <div className="rounded-full border border-white/20 p-2 backdrop-blur-sm">
          <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// Shown only if no hero images have been uploaded yet in the admin panel.
const FALLBACK = [
  { gradient: "bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900" },
  { gradient: "bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800" },
  { gradient: "bg-gradient-to-br from-brand-800 via-brand-900 to-black" },
];