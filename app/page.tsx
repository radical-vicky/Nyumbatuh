import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/HeroCarousel";
import PropertyCard from "@/components/PropertyCard";

export const revalidate = 300;

export default async function HomePage() {
  const [heroImages, featured] = await Promise.all([
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
  ]);

  return (
    <div>
      <HeroCarousel images={heroImages} />

      {/* Win-Win Section */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-100/70 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              For property owners — the give
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              We market your property for free
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Professional listing on Nyumbatuh, built to rank on Google
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Photos, details, and tenant inquiries handled for you
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                No advertising spend, no listing fees — completely free
              </li>
            </ul>
            <Link 
              href="/signup" 
              className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              List your property
            </Link>
          </div>

          <div className="rounded-xl border border-brand-100/70 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              For Ultrafy Networks — the take
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              We become the building's ISP partner
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Exclusive partnership agreement for the property
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                First access to every incoming tenant or business
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                A steady pipeline of new fiber customers
              </li>
            </ul>
            <Link 
              href="/about" 
              className="mt-4 inline-block rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured properties</h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse freely — create a free account only when you're ready to contact an owner.
              </p>
            </div>
            <Link 
              href="/properties" 
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
            >
              See all
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
        <h2 className="text-center text-2xl font-bold text-gray-900">
          How Nyumbatuh works
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Free property listing powered by Ultrafy Networks fiber internet
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-4">
          {[
            {
              title: "Sign up",
              description: "Create an owner account in minutes — completely free."
            },
            {
              title: "List your property",
              description: "Add details and photos — we handle the rest."
            },
            {
              title: "We approve & promote",
              description: "Our team reviews and publishes your listing."
            },
            {
              title: "You fill it, we connect it",
              description: "Tenants move in, Ultrafy becomes the ISP."
            }
          ].map((step, i) => (
            <div 
              key={step.title} 
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-semibold text-brand-500">
                Step {i + 1}
              </div>
              <h3 className="mt-1 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link 
            href="/signup" 
            className="inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
          >
            Get started — it's free
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            Part of Ultrafy Networks — connecting Kenya with fiber internet
          </p>
        </div>
      </section>
    </div>
  );
}