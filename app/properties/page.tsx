import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import { PROPERTY_TYPES } from "@/types";

export const metadata = { title: "Property Listings — Ultrafy Fiber Network" };
export const revalidate = 60;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { city?: string; type?: string };
}) {
  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      ...(searchParams.city ? { city: { equals: searchParams.city, mode: "insensitive" } } : {}),
      ...(searchParams.type ? { type: searchParams.type as any } : {}),
    },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Available properties</h1>
      <p className="mt-2 text-gray-600">Every listing here is professionally marketed by Ultrafy, at no cost to the owner.</p>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input name="city" defaultValue={searchParams.city} placeholder="Filter by city" className="input-field max-w-xs" />
        <select name="type" defaultValue={searchParams.type ?? ""} className="input-field max-w-xs">
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn-secondary" type="submit">Filter</button>
      </form>

      {properties.length === 0 ? (
        <div className="glass-card mt-10 p-10 text-center text-gray-500">
          No properties match yet — check back soon, or list your own to get things started.
        </div>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={{ ...p, price: p.price ? p.price.toString() : null }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
