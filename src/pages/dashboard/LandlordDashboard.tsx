import { useQuery } from "@tanstack/react-query";
import { rentalsApi, propertiesApi, paymentsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import StatsCard from "@/components/StatsCard";
import { Building2, FileText, CreditCard, Users } from "lucide-react";
import { formatMoney } from "@/lib/utils";

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: () => propertiesApi.list().then((r) => r.data) });
  const { data: rentals = [] } = useQuery({ queryKey: ["rentals"], queryFn: () => rentalsApi.my().then((r) => r.data) });
  const { data: earnings } = useQuery({ queryKey: ["earnings"], queryFn: () => paymentsApi.tenantEarnings().then((r) => r.data) });

  const activeRentals = rentals.filter((r: any) => r.status === "active");
  const pendingRentals = rentals.filter((r: any) => r.status === "pending");
  const totalEarnings = earnings?.payments?.filter((p: any) => p.status === "approved").reduce((s: number, p: any) => s + Number(p.paid_amount || p.amount || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-sm text-muted-foreground">Your landlord dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Properties" value={properties.length} icon={Building2} />
        <StatsCard title="Active Tenants" value={activeRentals.length} icon={Users} />
        <StatsCard title="Pending Requests" value={pendingRentals.length} icon={FileText} />
        <StatsCard title="Total Earnings" value={formatMoney(totalEarnings)} icon={CreditCard} />
      </div>

      {pendingRentals.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Pending Rental Requests</h2>
          <div className="space-y-3">
            {pendingRentals.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div>
                  <p className="font-medium text-foreground">{r.title || `Rental #${r.id}`}</p>
                  <p className="text-xs text-muted-foreground">Tenant: {r.tenant_name}</p>
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
