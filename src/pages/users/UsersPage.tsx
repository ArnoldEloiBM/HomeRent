import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Users, ShieldOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const roleBadge: Record<string, string> = {
  admin: "bg-primary/15 text-primary border-primary/30",
  landlord: "bg-accent text-accent-foreground border-primary/20",
  tenant: "bg-muted text-muted-foreground border-border",
};

export default function UsersPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: () => usersApi.list().then((r) => r.data) });

  const action = async (fn: () => Promise<any>, msg: string) => {
    try {
      await fn();
      toast({ title: msg });
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">{users.length} users</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">No users</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", roleBadge[u.role])}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    {u.is_suspended ? (
                      <span className="text-xs font-medium text-destructive">Suspended</span>
                    ) : u.is_verified ? (
                      <span className="text-xs font-medium text-success">Active</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== "admin" && (
                      u.is_suspended ? (
                        <Button size="sm" variant="outline" onClick={() => action(() => usersApi.unsuspend(u.id), "User unsuspended")}>
                          <Shield className="mr-1 h-3 w-3" />Unsuspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="destructive" onClick={() => action(() => usersApi.suspend(u.id), "User suspended")}>
                          <ShieldOff className="mr-1 h-3 w-3" />Suspend
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
