import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/session";
import StatusBadge from "@/components/StatusBadge";

export default async function DashboardPage() {
  const session = await requireOwner();

  const properties = await prisma.property.findMany({
    where: { ownerId: session.userId },
    include: { images: { take: 1, orderBy: { order: "asc" } }, _count: { select: { inquiries: true } }, contract: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your properties</h1>
          <p className="text-sm text-gray-600">Track review status, inquiries, and your Ultrafy fiber contract.</p>
        </div>
        <Link href="/dashboard/new" className="btn-primary">+ List a new property</Link>
      </div>

      {properties.length === 0 ? (
        <div className="glass-card mt-8 p-10 text-center">
          <p className="text-gray-600">You haven't listed a property yet.</p>
          <Link href="/dashboard/new" className="btn-primary mt-4 inline-flex">List your first property</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {properties.map((p) => (
            <div key={p.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-brand-300">No photo</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>
                  <StatusBadge status={p.status} />
                  {p.contract && (
                    <Link href={`/dashboard/${p.id}/contract`} className="hover:underline">
                      <StatusBadge status={p.contract.status} />
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500">{p.city}, {p.state}</p>
                {p.status === "REJECTED" && p.rejectedReason && (
                  <p className="mt-1 text-sm text-red-600">Reason: {p.rejectedReason}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">{p._count.inquiries} inquiries · {p.viewCount} views</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/${p.id}/edit`} className="btn-secondary !px-4 !py-2">Edit</Link>
                {p.status === "APPROVED" && (
                  <Link href={`/properties/${p.id}`} className="btn-secondary !px-4 !py-2">View live</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
