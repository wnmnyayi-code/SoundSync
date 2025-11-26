import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">Last updated: November 20, 2025</p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account,
            update your profile, or communicate with us. This may include your name, email address,
            and payment information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services,
            to process transactions, and to communicate with you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy
            (e.g., with payment processors) or with your consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse,
            and unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect information about your activity, browser,
            and device. You can instruct your browser to refuse all cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information.
            You can manage your account settings within the application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@soundsync.com.
          </p>
        </section>
      </div>
    </div>
  )
}
