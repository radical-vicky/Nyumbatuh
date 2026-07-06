import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import InquiryForm from "@/components/InquiryForm";
import Script from "next/script";

export const revalidate = 60;

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { images: { take: 1, orderBy: { order: "asc" } } }, // ✅ Include images
  });
  
  if (!property) return {};
  
  const firstImage = property.images?.[0]?.url || "";
  
  return {
    title: `${property.title} — Ultrafy Fiber Network`,
    description: property.description?.slice(0, 155) || "",
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 155) || "",
      images: firstImage ? [firstImage] : [],
    },
    alternates: {
      canonical: `/properties/${params.id}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { 
      images: { orderBy: { order: "asc" } },
      owner: { 
        select: { 
          name: true, 
          email: true,
          phone: true,
        } 
      }
    },
  });

  if (!property || property.status !== "APPROVED") notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zipCode,
    },
    "price": property.price ? Number(property.price) : undefined,
    "priceCurrency": "KES", // ✅ Changed from USD to KES
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {property.images.length > 0 ? (
                property.images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative h-64 overflow-hidden rounded-2xl bg-brand-50 ${
                      i === 0 ? "sm:col-span-2" : ""
                    }`}
                  >
                    {img.type === "VIDEO" ? (
                      <video
                        src={img.url}
                        controls
                        playsInline
                        className="h-full w-full object-cover"
                        aria-label={`Property video ${i + 1}`}
                      />
                    ) : (
                      <Image
                        src={img.url}
                        alt={`${property.title} - image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={i === 0}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex h-64 items-center justify-center rounded-2xl bg-brand-50 text-brand-300">
                  No photos yet
                </div>
              )}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-600">
              {property.type}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{property.title}</h1>
            <p className="mt-1 text-gray-500">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
              {property.price && (
                <span className="font-semibold text-brand-800 text-base">
                  KES {Number(property.price).toLocaleString()} {/* ✅ Changed to KES */}
                  {property.priceType ? ` ${property.priceType}` : ""}
                </span>
              )}
              {property.sizeSqft && <span>{property.sizeSqft.toLocaleString()} sqft</span>}
              {property.numUnits && <span>{property.numUnits} units</span>}
            </div>

            <p className="mt-6 whitespace-pre-line text-gray-700">{property.description}</p>

            {/* Owner Info */}
            {property.owner && (
              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">Listed by</h3>
                <p className="mt-1 text-sm text-gray-700">{property.owner.name || "Unknown Owner"}</p>
                {property.owner.email && (
                  <p className="text-sm text-gray-500">{property.owner.email}</p>
                )}
                {property.owner.phone && (
                  <p className="text-sm text-gray-500">{property.owner.phone}</p>
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-20 lg:h-fit">
            <InquiryForm propertyId={property.id} />
          </div>
        </div>
      </div>
    </>
  );
}
