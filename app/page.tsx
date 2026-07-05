import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/HeroCarousel";
import PropertyCard from "@/components/PropertyCard";
import { getSession } from "@/lib/auth";

export const revalidate = 300;

export default async function HomePage() {
  const [heroImages, featured, session] = await Promise.all([
    prisma.heroImage.findMany({ 
      where: { isActive: true }, 
      orderBy: { order: "asc" }, 
      take: 4 
    }),
    prisma.property.findMany({
      where: { status: "APPROVED" },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    getSession(), // Check if user is logged in
  ]);

  // Determine where "List your property" should go
  const listingLink = session ? "/properties/create" : "/signup";
  const isLoggedIn = !!session;

  return (
    <div>
      <HeroCarousel images={heroImages} isLoggedIn={isLoggedIn} />

      {/* Win-Win Section */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="group rounded-2xl border border-brand-100/70 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-600/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 text-lg font-bold">
              G
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-600">
              For property owners — the give
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              We market your property for free
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                Professional listing on Nyumbatuh, built to rank on Google
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                Photos, details, and tenant inquiries handled for you
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                No advertising spend, no listing fees — completely free
              </li>
            </ul>
            <Link 
              href={listingLink} 
              className="btn-primary mt-6 w-full sm:w-auto"
            >
              {session ? "List your property now" : "List your property"}
            </Link>
          </div>

          <div className="group rounded-2xl border border-brand-100/70 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-brand-600/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 text-lg font-bold">
              T
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-600">
              For Ultrafy Networks — the take
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              We become the building's ISP partner
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                Exclusive partnership agreement for the property
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                First access to every incoming tenant or business
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500"></span>
                A steady pipeline of new fiber customers
              </li>
            </ul>
            <Link 
              href="/about" 
              className="btn-secondary mt-6 w-full sm:w-auto"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured properties</h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse freely — create a free account only when you're ready to contact an owner.
              </p>
            </div>
            <Link 
              href="/properties" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
            >
              See all
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-6 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {featured.map((p) => (
              <PropertyCard 
                key={p.id} 
                property={{ ...p, price: p.price ? p.price.toString() : null }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Simple process
          </span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            How Nyumbatuh works
          </h2>
          <p className="mt-2 text-gray-600">
            Free property listing powered by Ultrafy Networks fiber internet
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-4">
          {[
            {
              number: "01",
              title: "Sign up",
              description: "Create an owner account in minutes — completely free."
            },
            {
              number: "02",
              title: "List your property",
              description: "Add details and photos — we handle the rest."
            },
            {
              number: "03",
              title: "We approve & promote",
              description: "Our team reviews and publishes your listing."
            },
            {
              number: "04",
              title: "You fill it, we connect it",
              description: "Tenants move in, Ultrafy becomes the ISP."
            }
          ].map((step, i) => (
            <div 
              key={step.title} 
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-brand-200"
            >
              <div className="text-4xl font-bold text-brand-100 transition-colors group-hover:text-brand-200">
                {step.number}
              </div>
              <h3 className="mt-2 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href={listingLink} 
            className="btn-primary px-8 py-3.5 text-base"
          >
            {session ? "List your property now" : "Get started — it's free"}
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            Part of Ultrafy Networks — connecting Kenya with fiber internet
          </p>
        </div>
      </section>

      {/* Trust/Stats Section */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="mt-1 text-sm text-gray-600">Free property listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">24h</p>
              <p className="mt-1 text-sm text-gray-600">Average review time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">Fiber</p>
              <p className="mt-1 text-sm text-gray-600">High-speed internet ready</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
