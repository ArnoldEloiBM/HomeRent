import { useQuery } from "@tanstack/react-query";
import { rentalsApi, paymentsApi, propertiesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import StatsCard from "@/components/StatsCard";
import { Building2, FileText, CreditCard, Clock } from "lucide-react";
import { formatMoney, formatDate } from "@/lib/utils";

export default function TenantDashboard() {
  const { user } = useAuth();
  const { data: rentals = [] } = useQuery({ queryKey: ["rentals"], queryFn: () => rentalsApi.my().then((r) => r.data) });
  const { data: payments = [] } = useQuery({ queryKey: ["payments"], queryFn: () => paymentsApi.my().then((r) => r.data) });
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: () => propertiesApi.list().then((r) => r.data) });

  const activeRentals = rentals.filter((r: any) => r.status === "active");
  const pendingRentals = rentals.filter((r: any) => r.status === "pending");
  const totalPaid = payments.filter((p: any) => p.status === "approved").reduce((s: number, p: any) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-sm text-muted-foreground">Here's your rental overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Available Properties" value={properties.length} icon={Building2} />
        <StatsCard title="Active Rentals" value={activeRentals.length} icon={FileText} />
        <StatsCard title="Pending Requests" value={pendingRentals.length} icon={Clock} />
        <StatsCard title="Total Paid" value={formatMoney(totalPaid)} icon={CreditCard} />
      </div>

      {activeRentals.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Active Rentals</h2>
          <div className="space-y-3">
            {activeRentals.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  {r.image_url && <img src={r.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                  <div>
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatMoney(r.price)}/mo</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.start_date)} — {formatDate(r.end_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
