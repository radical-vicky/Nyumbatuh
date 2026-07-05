import Link from "next/link";

export const metadata = {
  title: "About Us | Nyumbatuh",
  description: "Learn about Nyumbatuh and how we're connecting property owners with tenants through free listings and fiber internet.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          About Nyumbatuh
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Connecting property owners with tenants through free listings and fiber internet.
        </p>
      </div>

      {/* Our Story */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
        <div className="mt-4 space-y-4 text-gray-600">
          <p>
            Nyumbatuh was born from a simple idea: what if property owners could list their properties for free, and in return, we could connect those properties with high-speed fiber internet?
          </p>
          <p>
            As part of Ultrafy Networks, a leading fiber internet provider in Kenya, we saw an opportunity to create a win-win platform. Property owners get free marketing and exposure for their properties, and Ultrafy Networks gains the opportunity to become the building's preferred internet service provider.
          </p>
          <p>
            The name "Nyumbatuh" comes from the Swahili word "Nyumba" meaning "home" and "tuh" meaning "ours" — reflecting our mission to make finding a home accessible to everyone.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
        <div className="mt-4 space-y-4 text-gray-600">
          <p>
            To make property listing and searching in Kenya simple, accessible, and free — while building a network of connected homes and businesses powered by Ultrafy Networks fiber internet.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Values</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Free & Transparent</h3>
            <p className="mt-2 text-sm text-gray-600">
              Listing your property on Nyumbatuh is completely free. No hidden fees, no commissions.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Win-Win Model</h3>
            <p className="mt-2 text-sm text-gray-600">
              We believe in partnerships that benefit everyone — property owners, tenants, and our fiber network.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Quality & Trust</h3>
            <p className="mt-2 text-sm text-gray-600">
              We verify all property listings to ensure quality and authenticity for our users.
            </p>
          </div>
        </div>
      </section>

      {/* The Win-Win Model */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">The Win-Win Model</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-brand-600">For Property Owners</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Free property listing and marketing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Professional photos and descriptions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Tenant inquiries sent directly to you
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                No advertising or listing fees
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-brand-600">For Ultrafy Networks</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Exclusive ISP partnership for the building
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                First access to new tenants and businesses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Steady pipeline of new fiber customers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                Long-term growth in connected properties
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">Our Team</h2>
        <p className="mt-2 text-gray-600">
          Nyumbatuh is powered by the Ultrafy Networks team — a dedicated group of professionals committed to connecting Kenya with high-speed fiber internet and making property search simple.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-200"></div>
            <h3 className="mt-3 font-semibold text-gray-900">Team Member 1</h3>
            <p className="text-sm text-gray-500">CEO, Ultrafy Networks</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-200"></div>
            <h3 className="mt-3 font-semibold text-gray-900">Team Member 2</h3>
            <p className="text-sm text-gray-500">Head of Operations</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-200"></div>
            <h3 className="mt-3 font-semibold text-gray-900">Team Member 3</h3>
            <p className="text-sm text-gray-500">Marketing & Partnerships</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="mt-16 rounded-lg bg-brand-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Ready to list your property?
        </h2>
        <p className="mt-2 text-gray-600">
          Join Nyumbatuh today and get free exposure for your property.
        </p>
        <Link
          href="/signup"
          className="mt-4 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Get Started — It's Free
        </Link>
      </div>
    </div>
  );
}