// app/fans/page.tsx
import ProtectedRoute from "@/components/auth/protected-route"

export default function FansPage() {
  return (
    <ProtectedRoute allowedRoles={["FAN", "ADMIN"]}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Fan Dashboard</h1>
        {/* Fan-specific content */}
      </div>
    </ProtectedRoute>
  )
}