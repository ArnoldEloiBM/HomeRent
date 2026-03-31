import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi, rentalsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatMoney, formatDate, cn } from "@/lib/utils";
import { CreditCard, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  approved: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [payOpen, setPayOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const isTenant = user?.role === "tenant";
  const isLandlord = user?.role === "landlord";

  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: () => (isTenant ? paymentsApi.my() : paymentsApi.list()).then((r) => r.data),
  });

  const { data: rentals = [] } = useQuery({
    queryKey: ["rentals"],
    queryFn: () => rentalsApi.my().then((r) => r.data),
    enabled: isTenant,
  });

  const activeRentals = rentals.filter((r: any) => r.status === "active");

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPayLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      await paymentsApi.create(fd);
      toast({ title: "Payment proof submitted!" });
      setPayOpen(false);
      qc.invalidateQueries({ queryKey: ["payments"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setPayLoading(false);
    }
  };

  const action = async (fn: () => Promise<any>, msg: string) => {
    try {
      await fn();
      toast({ title: msg });
      qc.invalidateQueries({ queryKey: ["payments"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isLandlord ? "Earnings & Payments" : "My Payments"}</h1>
          <p className="text-sm text-muted-foreground">{payments.length} records</p>
        </div>
        {isTenant && activeRentals.length > 0 && (
          <Button onClick={() => setPayOpen(true)}><Upload className="mr-2 h-4 w-4" />Submit Payment</Button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <CreditCard className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No payments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p: any) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-card-foreground">{p.property_title || `Payment #${p.id}`}</p>
                  {p.tenant_name && <p className="text-xs text-muted-foreground">Tenant: {p.tenant_name}</p>}
                  <p className="text-xs text-muted-foreground">{formatDate(p.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">{formatMoney(p.amount)}</span>
                  <span className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize", statusColors[p.status])}>
                    {p.status}
                  </span>
                </div>
              </div>
              {p.proof_image_url && (
                <a href={p.proof_image_url} target="_blank" rel="noopener" className="mt-2 inline-block text-xs text-primary hover:underline">View proof</a>
              )}
              {isLandlord && p.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => action(() => paymentsApi.approve(p.id), "Payment approved")}><Check className="mr-1 h-3 w-3" />Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => action(() => paymentsApi.reject(p.id), "Payment rejected")}><X className="mr-1 h-3 w-3" />Reject</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit Payment Proof</DialogTitle></DialogHeader>
          <form onSubmit={handlePay} className="space-y-3">
            <div>
              <Label>Rental</Label>
              <select name="rentalId" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select rental…</option>
                {activeRentals.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.title} — {formatMoney(r.price)}/mo</option>
                ))}
              </select>
            </div>
            <div><Label>Amount (RWF)</Label><Input name="amount" type="number" required /></div>
            <div><Label>Proof Image</Label><Input name="proof" type="file" accept="image/*" required /></div>
            <Button type="submit" className="w-full" disabled={payLoading}>{payLoading ? "Submitting…" : "Submit Payment"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
