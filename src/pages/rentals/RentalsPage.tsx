import { useQuery, useQueryClient } from "@tanstack/react-query";
import { rentalsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatMoney, formatDate, cn } from "@/lib/utils";
import { FileText, Check, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  active: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  cancelled: "bg-muted text-muted-foreground border-border",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function RentalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: rentals = [], isLoading } = useQuery({ queryKey: ["rentals"], queryFn: () => rentalsApi.my().then((r) => r.data) });

  const action = async (fn: () => Promise<any>, msg: string) => {
    try {
      await fn();
      toast({ title: msg });
      qc.invalidateQueries({ queryKey: ["rentals"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{user?.role === "landlord" ? "Rental Requests" : "My Rentals"}</h1>
        <p className="text-sm text-muted-foreground">{rentals.length} total</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : rentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <FileText className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No rentals yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rentals.map((r: any) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {(r.image_url || r.imageUrl) && (
                    <img src={r.image_url || r.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-card-foreground">{r.title || `Rental #${r.id}`}</p>
                    {r.location && <p className="text-xs text-muted-foreground">{r.location}</p>}
                    {r.tenant_name && <p className="text-xs text-muted-foreground">Tenant: {r.tenant_name}</p>}
                    <p className="text-xs text-muted-foreground">{formatDate(r.start_date)} — {formatDate(r.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize", statusColors[r.status] || statusColors.pending)}>
                    {r.status}
                  </span>
                  {r.total_amount && <span className="text-sm font-semibold text-foreground">{formatMoney(r.total_amount)}</span>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {user?.role === "landlord" && r.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => action(() => rentalsApi.approve(r.id), "Rental approved")}><Check className="mr-1 h-3 w-3" />Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => action(() => rentalsApi.reject(r.id), "Rental rejected")}><X className="mr-1 h-3 w-3" />Reject</Button>
                  </>
                )}
                {user?.role === "landlord" && r.status === "active" && (
                  <Button size="sm" variant="outline" onClick={() => action(() => rentalsApi.terminate(r.id), "Rental terminated")}><Ban className="mr-1 h-3 w-3" />Terminate</Button>
                )}
                {user?.role === "tenant" && (r.status === "pending" || r.status === "active") && (
                  <Button size="sm" variant="outline" onClick={() => action(() => rentalsApi.cancel(r.id), "Rental cancelled")}><X className="mr-1 h-3 w-3" />Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
