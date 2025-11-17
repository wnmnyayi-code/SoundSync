'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-foreground">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing or using SoundSync, you agree to be bound by these Terms of Service and all applicable 
                  laws and regulations. If you do not agree with any of these terms, you are prohibited from using or 
                  accessing this platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground mb-4">
                  SoundSync is a music platform that connects artists, fans, merchants, and influencers. Our services include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Music streaming and live listening parties</li>
                  <li>Digital music and merchandise sales</li>
                  <li>Social features for connecting with artists and fans</li>
                  <li>Payment processing and revenue distribution</li>
                  <li>Subscription management</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold mb-2">3.1 Registration</h3>
                <p className="text-muted-foreground mb-4">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as necessary</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">3.2 Account Types</h3>
                <p className="text-muted-foreground mb-4">
                  SoundSync offers different subscription tiers (Basic, Standard, Premium) with varying access levels. 
                  You agree to pay all applicable fees associated with your chosen subscription tier.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
                <p className="text-muted-foreground mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Upload, post, or transmit any content that is illegal, harmful, or violates others' rights</li>
                  <li>Infringe on intellectual property rights, including copyrights and trademarks</li>
                  <li>Use the platform for any fraudulent or unauthorized purpose</li>
                  <li>Interfere with or disrupt the platform's operation</li>
                  <li>Attempt to gain unauthorized access to any part of the platform</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload malicious code or viruses</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Content and Intellectual Property</h2>
                <h3 className="text-xl font-semibold mb-2">5.1 Your Content</h3>
                <p className="text-muted-foreground mb-4">
                  You retain ownership of content you upload to SoundSync. By uploading content, you grant us a 
                  worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content 
                  on the platform.
                </p>

                <h3 className="text-xl font-semibold mb-2">5.2 Our Content</h3>
                <p className="text-muted-foreground mb-4">
                  All content on SoundSync, including text, graphics, logos, and software, is the property of 
                  SoundSync or its licensors and is protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Payments and Refunds</h2>
                <p className="text-muted-foreground mb-4">
                  All payments are processed securely through our payment partners. Subscription fees are charged 
                  according to your selected tier. Refund policies are outlined in our separate Refund Policy. 
                  You are responsible for all charges incurred under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Revenue Distribution</h2>
                <p className="text-muted-foreground mb-4">
                  SoundSync operates on a revenue-sharing model:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Artists receive 60% of net revenue</li>
                  <li>Influencers receive 10% commission on referrals</li>
                  <li>SoundSync platform receives 15%</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Withdrawal thresholds apply. Please refer to your dashboard for specific withdrawal requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to suspend or terminate your account at any time for violation of these terms 
                  or for any other reason we deem necessary. You may terminate your account at any time through your 
                  account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers</h2>
                <p className="text-muted-foreground mb-4">
                  SoundSync is provided "as is" without warranties of any kind. We do not guarantee that the platform 
                  will be uninterrupted, error-free, or secure. We are not responsible for the content uploaded by users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, SoundSync shall not be liable for any indirect, incidental, 
                  special, or consequential damages arising from your use of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes. 
                  Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms of Service are governed by the laws of South Africa. Any disputes shall be resolved in 
                  the courts of South Africa.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none text-muted-foreground mb-4">
                  <li><strong>Email:</strong> support@soundsync.co.za</li>
                  <li><strong>Phone:</strong> +27 80 123 4567</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

