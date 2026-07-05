"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "OFFICE", label: "Office" },
  { value: "BUILDING", label: "Building" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
];

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi",
  "Kitale", "Garissa", "Kakamega", "Nyeri", "Meru", "Machakos", "Kitui",
  "Embu", "Isiolo", "Kericho", "Bungoma", "Busia", "Homa Bay", "Kiambu",
  "Kilifi", "Kisii", "Kwale", "Laikipia", "Lamu", "Makueni", "Migori",
  "Murang'a", "Nandi", "Narok", "Nyandarua", "Nyamira", "Samburu",
  "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

export default function CreatePropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    sizeSqft: "",
    numUnits: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    priceType: "",
  });

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/signup?redirect=/properties/create");
          return;
        }
        setLoading(false);
      } catch {
        router.push("/signup?redirect=/properties/create");
      }
    }
    checkAuth();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.type) {
        throw new Error("Property type is required");
      }
      if (!formData.address.trim()) {
        throw new Error("Address is required");
      }
      if (!formData.city.trim()) {
        throw new Error("City is required");
      }
      if (!formData.state) {
        throw new Error("County is required");
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sizeSqft: formData.sizeSqft ? parseInt(formData.sizeSqft) : null,
          numUnits: formData.numUnits ? parseInt(formData.numUnits) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create property");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/properties/${data.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600">Property Listed Successfully!</h2>
          <p className="text-gray-600 mt-2">Redirecting to your property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details below to list your property on Nyumbatuh.
          </p>
        </div>
        <Link
          href="/properties"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Back to properties
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., Modern 3-Bedroom Apartment in Westlands"
                value={formData.title}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                value={formData.type}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select type...</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Units
              </label>
              <input
                type="number"
                name="numUnits"
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 5"
                value={formData.numUnits}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 3"
                value={formData.bedrooms}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                step="0.5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 2"
                value={formData.bathrooms}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (Sq. Ft.)
              </label>
              <input
                type="number"
                name="sizeSqft"
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 1200"
                value={formData.sizeSqft}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (KES)
              </label>
              <input
                type="number"
                name="price"
                min="1"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 50000"
                value={formData.price}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Type
              </label>
              <select
                name="priceType"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                value={formData.priceType}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select price type...</option>
                <option value="Fixed">Fixed Price</option>
                <option value="Negotiable">Negotiable</option>
                <option value="Per Unit">Per Unit</option>
                <option value="Per Sq. Ft.">Per Sq. Ft.</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 123 Kenyatta Avenue"
                value={formData.address}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City/Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                County <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                value={formData.state}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select county...</option>
                {KENYA_COUNTIES.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g., 00100"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/properties"
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Listing Property..." : "List Property"}
          </button>
        </div>
      </form>
    </div>
  );
    }
