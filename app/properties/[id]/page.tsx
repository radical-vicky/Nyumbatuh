import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({ 
    where: { id: params.id } 
  });
  if (!property) return {};
  return {
    title: `${property.title} — Nyumbatuh by Ultrafy`,
    description: property.description?.slice(0, 155) || "Property listing on Nyumbatuh",
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { 
      images: { orderBy: { order: "asc" } },
      owner: { 
        select: { 
          name: true, 
          email: true,
          phone: true,
          createdAt: true 
        } 
      }
    },
  });

  if (!property || property.status !== "APPROVED") notFound();

  // Format price in KES
  const formattedPrice = property.price 
    ? `KES ${Number(property.price).toLocaleString()}`
    : null;

  // Get property type label
  const propertyTypeLabels: Record<string, string> = {
    APARTMENT: "Apartment",
    HOUSE: "House",
    OFFICE: "Office",
    BUILDING: "Building",
    COMMERCIAL: "Commercial",
    LAND: "Land",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="grid gap-3 sm:grid-cols-2">
            {property.images.length > 0 ? (
              property.images.map((img, i) => (
                <div 
                  key={img.id} 
                  className={`relative h-64 overflow-hidden rounded-2xl bg-brand-50 ${
                    i === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <Image 
                    src={img.url} 
                    alt={`${property.title} - Image ${i + 1}`} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 flex h-64 items-center justify-center rounded-2xl bg-brand-50 text-brand-300">
                No photos yet
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
              </span>
              Approved
            </span>
            <span className="text-xs text-gray-500">
              Listed {new Date(property.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Property Info */}
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {propertyTypeLabels[property.type] || property.type}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="mt-1 text-gray-500">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>

          {/* Price & Details */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
            {formattedPrice && (
              <span className="font-semibold text-brand-800 text-base">
                {formattedPrice}
                {property.priceType && ` (${property.priceType})`}
              </span>
            )}
            {property.sizeSqft && (
              <span>{property.sizeSqft.toLocaleString()} sqft</span>
            )}
            {property.numUnits && (
              <span>{property.numUnits} units</span>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this property</h2>
              <p className="whitespace-pre-line text-gray-700">{property.description}</p>
            </div>
          )}

          {/* Owner Info */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Listed by</h3>
            <p className="mt-1 text-sm text-gray-700">{property.owner?.name || "Unknown Owner"}</p>
            {property.owner?.email && (
              <p className="text-sm text-gray-500">{property.owner.email}</p>
            )}
            {property.owner?.phone && (
              <p className="text-sm text-gray-500">{property.owner.phone}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Member since {new Date(property.owner?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Sidebar - Inquiry Form */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <InquiryForm propertyId={property.id} />
        </div>
      </div>
    </div>
  );
        }
