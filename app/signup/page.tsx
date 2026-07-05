"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "tenant" ? "TENANT" : "OWNER";
  const next = searchParams.get("next");

  const [role, setRole] = useState<"OWNER" | "TENANT">(initialRole);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        let errorMessage = data.error || "Could not create your account.";
        
        // Handle validation errors
        if (data.error?.fieldErrors) {
          const fieldErrors = data.error.fieldErrors;
          const firstError = Object.values(fieldErrors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }
        
        throw new Error(errorMessage);
      }
      
      router.push(next || (role === "OWNER" ? "/dashboard" : "/properties"));
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {role === "OWNER" ? "List your property, free" : "Find your next home"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {role === "OWNER" ? "Create an owner account to get started." : "Create a free account to contact property owners."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-brand-50 p-1">
          <button
            type="button"
            onClick={() => setRole("TENANT")}
            className={`rounded-lg py-2 text-sm font-medium transition ${role === "TENANT" ? "bg-white text-brand-800 shadow" : "text-brand-600"}`}
          >
            I'm looking for a property
          </button>
          <button
            type="button"
            onClick={() => setRole("OWNER")}
            className={`rounded-lg py-2 text-sm font-medium transition ${role === "OWNER" ? "bg-white text-brand-800 shadow" : "text-brand-600"}`}
          >
            I'm listing a property
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input 
              required 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              required 
              type="email" 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <input 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500" 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              required 
              type="password" 
              minLength={8} 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-white font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="font-semibold text-brand-700">Log in</Link>
        </p>
      </div>
    </div>
  );
}