import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Nyumbatuh",
  description: "Read the terms and conditions for using Nyumbatuh property listing platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="prose prose-brand max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By using Nyumbatuh, you agree to these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Account Registration</h2>
            <p className="text-gray-600">
              To list properties or contact owners, you must create an account. You agree to:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Provide accurate and complete information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Not create multiple accounts for fraudulent purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Property Listings</h2>
            <p className="text-gray-600">By listing a property, you agree that:</p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>You have the legal right to list the property</li>
              <li>All information provided is accurate and truthful</li>
              <li>You own the rights to any images uploaded</li>
              <li>You will respond to tenant inquiries promptly</li>
              <li>Nyumbatuh may remove listings that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Win-Win Model</h2>
            <p className="text-gray-600">
              By listing your property, you agree to consider Ultrafy Networks as your preferred internet service provider. In exchange, Nyumbatuh provides free property listing and marketing services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. User Conduct</h2>
            <p className="text-gray-600">You agree not to:</p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Use the platform for illegal purposes</li>
              <li>Attempt to bypass our security measures</li>
              <li>Scrape or copy content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Intellectual Property</h2>
            <p className="text-gray-600">
              Nyumbatuh and its content, including logos, designs, and code, are protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Liability</h2>
            <p className="text-gray-600">
              Nyumbatuh provides the platform "as is" and makes no warranties about the accuracy or reliability of listings. We are not responsible for:
            </p>
            <ul className="mt-2 list-disc pl-6 text-gray-600">
              <li>Transactions between property owners and tenants</li>
              <li>Property conditions or misrepresentations</li>
              <li>Third-party services or websites linked from our platform</li>
              <li>Any direct, indirect, or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Termination</h2>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent behavior. You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@nyumbatuh.com" className="text-brand-600 hover:text-brand-700">
                legal@nyumbatuh.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}