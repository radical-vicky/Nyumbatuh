import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
                N
              </span>
              <span className="text-lg tracking-tight">Nyumbatuh</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Find your dream home or list your property for free.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Powered by Ultrafy Networks
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-gray-500">Email:</span>
                <a 
                  href="mailto:info@nyumbatuh.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@nyumbatuh.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">Phone:</span>
                <a 
                  href="tel:+254703199691" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  0703 199 691
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-400">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Nyumbatuh. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Free marketing, exclusive fiber. Powered by Ultrafy Networks.
          </p>
        </div>
      </div>
    </footer>
  );
}