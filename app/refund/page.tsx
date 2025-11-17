'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function RefundPolicyPage() {
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
            <CardTitle className="text-3xl">Refund Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-foreground">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
                <p className="text-muted-foreground mb-4">
                  This Refund Policy outlines the terms and conditions under which SoundSync provides refunds for 
                  purchases made on our platform. Please read this policy carefully before making a purchase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Subscription Refunds</h2>
                <h3 className="text-xl font-semibold mb-2">2.1 Monthly Subscriptions</h3>
                <p className="text-muted-foreground mb-4">
                  Monthly subscription fees (Standard: R99/month, Premium: R199/month) are non-refundable once charged. 
                  However, you may cancel your subscription at any time, and it will remain active until the end of your 
                  current billing period.
                </p>

                <h3 className="text-xl font-semibold mb-2">2.2 Cancellation</h3>
                <p className="text-muted-foreground mb-4">
                  You can cancel your subscription at any time through your account settings. Cancellation takes effect 
                  at the end of your current billing cycle. You will continue to have access to premium features until 
                  the subscription period expires.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. SoundSync Coins</h2>
                <h3 className="text-xl font-semibold mb-2">3.1 Coin Purchases</h3>
                <p className="text-muted-foreground mb-4">
                  SoundSync Coins are non-refundable once purchased. Coins are digital currency used within the platform 
                  and cannot be exchanged for cash or refunded, except in cases of technical errors or fraudulent transactions.
                </p>

                <h3 className="text-xl font-semibold mb-2">3.2 Unused Coins</h3>
                <p className="text-muted-foreground mb-4">
                  Unused coins remain in your account balance and can be used for future purchases. Coins do not expire.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Digital Products</h2>
                <h3 className="text-xl font-semibold mb-2">4.1 Digital Music</h3>
                <p className="text-muted-foreground mb-4">
                  Due to the nature of digital content, purchases of digital music downloads are generally non-refundable. 
                  Refunds may be considered only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>The file is corrupted or cannot be downloaded</li>
                  <li>You were charged multiple times for the same purchase</li>
                  <li>The product description was significantly inaccurate</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">4.2 Digital Tools and Plugins</h3>
                <p className="text-muted-foreground mb-4">
                  Digital tools, plugins, and software purchases are non-refundable unless the product is defective or 
                  does not function as described. Refund requests must be made within 7 days of purchase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Physical Merchandise</h2>
                <h3 className="text-xl font-semibold mb-2">5.1 Return Policy</h3>
                <p className="text-muted-foreground mb-4">
                  Physical merchandise may be returned within 14 days of delivery for a full refund, provided:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>The item is unused and in its original packaging</li>
                  <li>The item is defective or damaged upon arrival</li>
                  <li>The wrong item was received</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">5.2 Return Process</h3>
                <p className="text-muted-foreground mb-4">
                  To initiate a return, contact support@soundsync.co.za with your order number. You are responsible 
                  for return shipping costs unless the item is defective or incorrect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Live Session RSVPs</h2>
                <p className="text-muted-foreground mb-4">
                  RSVP fees for live listening parties are non-refundable. However, if a session is cancelled by the 
                  artist or SoundSync, you will receive a full refund in the form of SoundSync Coins.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Processing Time</h2>
                <p className="text-muted-foreground mb-4">
                  Approved refunds will be processed within 5-10 business days. Refunds will be issued to the original 
                  payment method used for the purchase. If the original payment method is no longer available, we will 
                  contact you to arrange an alternative refund method.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Disputes and Chargebacks</h2>
                <p className="text-muted-foreground mb-4">
                  If you have a dispute regarding a charge, please contact us at support@soundsync.co.za before initiating 
                  a chargeback with your bank or credit card company. Chargebacks may result in account suspension.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Special Circumstances</h2>
                <p className="text-muted-foreground mb-4">
                  We may consider refunds in special circumstances such as:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Technical errors on our part</li>
                  <li>Unauthorized transactions</li>
                  <li>Duplicate charges</li>
                  <li>Service unavailability beyond our control</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. How to Request a Refund</h2>
                <p className="text-muted-foreground mb-4">
                  To request a refund, please:
                </p>
                <ol className="list-decimal pl-6 text-muted-foreground mb-4">
                  <li>Contact us at support@soundsync.co.za</li>
                  <li>Include your order number or transaction ID</li>
                  <li>Provide a detailed explanation of why you are requesting a refund</li>
                  <li>Include any relevant documentation or screenshots</li>
                </ol>
                <p className="text-muted-foreground mb-4">
                  We will review your request and respond within 3-5 business days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately 
                  upon posting. Your continued use of the platform after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Refund Policy, please contact us:
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

