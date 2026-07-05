import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Nyumbatuh",
  description: "Learn how Nyumbatuh collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="prose prose-brand max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="text-gray-600">
              Nyumbatuh collects information you provide when creating an account, listing a property, or contacting property owners. This includes:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Name, email address, and phone number</li>
              <li>Property details and images you upload</li>
              <li>Inquiries and messages sent through the platform</li>
              <li>IP address and browser information for analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p className="text-gray-600">We use your information to:</p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Create and manage your account</li>
              <li>Publish and manage your property listings</li>
              <li>Facilitate communication between owners and tenants</li>
              <li>Improve our platform and user experience</li>
              <li>Send important updates about your listings and inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Information Sharing</h2>
            <p className="text-gray-600">
              We do not sell or rent your personal information to third parties. We may share information:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>With property owners when you inquire about their listings</li>
              <li>With service providers who help us operate the platform</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
            <p className="text-gray-600">
              We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Your Rights</h2>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Cookies</h2>
            <p className="text-gray-600">
              Nyumbatuh uses cookies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookie settings in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@nyumbatuh.com" className="text-brand-600 hover:text-brand-700">
                privacy@nyumbatuh.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}