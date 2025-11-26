// app/merchants/page.tsx
import ProtectedRoute from "@/components/auth/protected-route"

export default function MerchantsPage() {
  return (
    <ProtectedRoute allowedRoles={["MERCHANT", "ADMIN"]}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Merchant Dashboard</h1>
        {/* Merchant-specific content */}
      </div>
    </ProtectedRoute>
  )
}