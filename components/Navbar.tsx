"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Me = { userId: string; name: string; role: "OWNER" | "ADMIN" } | null;

export default function Navbar() {
  const [me, setMe] = useState<Me>(null);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Not authenticated");
        return r.json();
      })
      .then((d) => setMe(d.user))
      .catch(() => setMe(null))
      .finally(() => setLoaded(true));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm">N</span>
          <span className="text-lg tracking-tight">Nyumbatuh</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          <Link href="/properties" className="hover:text-brand-700 transition-colors">
            Listings
          </Link>
          {me?.role === "OWNER" && (
            <Link href="/dashboard" className="hover:text-brand-700 transition-colors">
              Dashboard
            </Link>
          )}
          {me?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-brand-700 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!loaded ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
          ) : me ? (
            <>
              <span className="hidden text-sm text-gray-500 sm:inline">
                Hi, {me.name.split(" ")[0]}
              </span>
              <Link 
                href="/account/change-password" 
                className="hidden text-sm text-gray-500 hover:text-brand-700 sm:inline transition-colors"
              >
                Settings
              </Link>
              <button 
                onClick={logout} 
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}