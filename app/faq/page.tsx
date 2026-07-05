import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions | Nyumbatuh",
  description: "Find answers to common questions about listing and finding properties on Nyumbatuh.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Is it really free to list my property?",
      answer: "Yes! Listing your property on Nyumbatuh is completely free. There are no hidden fees, no advertising costs, and no commissions. We believe in the win-win model where you get free marketing and we get to connect your property with our fiber internet services."
    },
    {
      question: "How does Nyumbatuh make money?",
      answer: "Nyumbatuh is part of Ultrafy Networks, a fiber internet company. We offer free property listings in exchange for becoming the preferred or exclusive internet service provider for your building. When tenants move in, they can sign up for our high-speed fiber internet."
    },
    {
      question: "How long does it take for my property to be approved?",
      answer: "Our team typically reviews and approves property listings within 24-48 hours during business days. We ensure all listings meet our quality standards before publishing."
    },
    {
      question: "Can I edit my property listing after it's published?",
      answer: "Yes! Once you're logged into your owner account, you can edit your property details, update photos, change pricing, and manage your listing at any time."
    },
    {
      question: "How do tenants contact me?",
      answer: "Tenants can send inquiries through your property listing page. You'll receive email notifications and can respond directly through your owner dashboard."
    },
    {
      question: "Do I need to have Ultrafy fiber internet to list my property?",
      answer: "Not at all! You can list your property regardless of your current internet provider. However, we hope that by listing with us, you'll consider Ultrafy Networks as your building's internet partner."
    },
    {
      question: "What types of properties can I list?",
      answer: "You can list residential properties (houses, apartments, townhouses), commercial properties (offices, retail spaces, warehouses), and land for sale or rent."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We take privacy and security seriously. Your personal information is protected and only shared with potential tenants when you choose to respond to their inquiries."
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Everything you need to know about listing and finding properties on Nyumbatuh
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {faq.question}
            </h3>
            <p className="mt-2 text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Still have questions?{" "}
          <Link href="/contact" className="text-brand-600 hover:text-brand-700 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}