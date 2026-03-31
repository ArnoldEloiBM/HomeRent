import { useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { ClipboardList, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  approved: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function ApplicationsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: apps = [], isLoading } = useQuery({ queryKey: ["applications"], queryFn: () => applicationsApi.list().then((r) => r.data) });

  const action = async (fn: () => Promise<any>, msg: string) => {
    try {
      const res = await fn();
      let desc = msg;
      if (res.data?.defaultPassword) desc += ` — Default password: ${res.data.defaultPassword}`;
      toast({ title: "Success", description: desc });
      qc.invalidateQueries({ queryKey: ["applications"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Landlord Applications</h1>
        <p className="text-sm text-muted-foreground">{apps.length} applications</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((a: any) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-card-foreground">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.email} · {a.phone}</p>
                  <p className="text-xs text-muted-foreground">Applied: {formatDate(a.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize", statusColors[a.status])}>
                    {a.status}
                  </span>
                  {a.id_card_image && (
                    <a href={a.id_card_image} target="_blank" rel="noopener" className="text-xs text-primary hover:underline">View ID</a>
                  )}
                </div>
              </div>
              {a.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => action(() => applicationsApi.approve(a.id), "Application approved")}>
                    <Check className="mr-1 h-3 w-3" />Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => action(() => applicationsApi.reject(a.id), "Application rejected")}>
                    <X className="mr-1 h-3 w-3" />Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
