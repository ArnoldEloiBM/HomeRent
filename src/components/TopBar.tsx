import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <SidebarTrigger />
      <div className="flex-1" />
      <button onClick={() => navigate("/profile")} className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
        <Avatar className="h-7 w-7">
          {user?.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {user ? getInitials(user.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-foreground sm:inline">{user?.name}</span>
      </button>
    </header>
  );
}
