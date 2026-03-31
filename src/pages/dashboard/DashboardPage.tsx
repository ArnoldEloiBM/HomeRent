import { useAuth } from "@/lib/auth-context";
import TenantDashboard from "./TenantDashboard";
import LandlordDashboard from "./LandlordDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "landlord") return <LandlordDashboard />;
  if (user?.role === "admin") return <AdminDashboard />;
  return <TenantDashboard />;
}
