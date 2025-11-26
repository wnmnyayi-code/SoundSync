// app/influencers/page.tsx
import ProtectedRoute from "@/components/auth/protected-route"

export default function InfluencersPage() {
  return (
    <ProtectedRoute allowedRoles={["INFLUENCER", "ADMIN"]}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Influencer Dashboard</h1>
        {/* Influencer-specific content */}
      </div>
    </ProtectedRoute>
  )
}