'use client'

import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"
import { Toaster } from "@/components/ui/toaster"
import ClientLayout from "./ClientLayout"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { SupportChat } from "@/components/SupportChat"

import { CartProvider } from "@/components/commerce/CartProvider"
import { CartDrawer } from "@/components/commerce/CartDrawer"

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AnalyticsTracker />
      <CartProvider>
        <ClientLayout>
          <div className="min-h-screen flex flex-col">
            <MainNav />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
          <SupportChat />
        </ClientLayout>
        <Toaster />
      </CartProvider>
    </SessionProvider>
  )
}
