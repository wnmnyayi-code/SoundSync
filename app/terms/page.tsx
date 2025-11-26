import React from 'react'

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">Last updated: November 20, 2025</p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SoundSync ("the Platform"), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password.
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Content and Conduct</h2>
          <p>
            Users retain ownership of the content they upload. By uploading content, you grant SoundSync
            a license to host and display your content. You agree not to upload illegal or infringing material.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Payments and Commissions</h2>
          <p>
            SoundSync facilitates payments between Fans and Creators. We charge a platform fee on transactions.
            Creators are responsible for any taxes associated with their earnings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service immediately, without prior notice,
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@soundsync.com.
          </p>
        </section>
      </div>
    </div>
  )
}
