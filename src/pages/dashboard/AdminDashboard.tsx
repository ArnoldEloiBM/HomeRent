import { useQuery } from "@tanstack/react-query";
import { usersApi, applicationsApi, propertiesApi } from "@/lib/api";
import StatsCard from "@/components/StatsCard";
import { Users, Building2, ClipboardList, Shield } from "lucide-react";

export default function AdminDashboard() {
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => usersApi.list().then((r) => r.data) });
  const { data: apps = [] } = useQuery({ queryKey: ["applications"], queryFn: () => applicationsApi.list().then((r) => r.data) });
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: () => propertiesApi.list().then((r) => r.data) });

  const tenants = users.filter((u: any) => u.role === "tenant");
  const landlords = users.filter((u: any) => u.role === "landlord");
  const pendingApps = apps.filter((a: any) => a.status === "pending");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={users.length} icon={Users} description={`${tenants.length} tenants, ${landlords.length} landlords`} />
        <StatsCard title="Properties" value={properties.length} icon={Building2} />
        <StatsCard title="Pending Applications" value={pendingApps.length} icon={ClipboardList} />
        <StatsCard title="Suspended Users" value={users.filter((u: any) => u.is_suspended).length} icon={Shield} />
      </div>

      {pendingApps.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Pending Landlord Applications</h2>
          <div className="space-y-3">
            {pendingApps.slice(0, 5).map((a: any) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.email} · {a.phone}</p>
                </div>
                <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-medium text-warning-foreground">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
