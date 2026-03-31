import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  FileText,
  CreditCard,
  MessageSquare,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = {
  tenant: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Properties", icon: Building2, path: "/properties" },
    { label: "My Rentals", icon: FileText, path: "/rentals" },
    { label: "Payments", icon: CreditCard, path: "/payments" },
    { label: "Messages", icon: MessageSquare, path: "/messages" },
  ],
  landlord: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "My Properties", icon: Building2, path: "/properties" },
    { label: "Rentals", icon: FileText, path: "/rentals" },
    { label: "Earnings", icon: CreditCard, path: "/payments" },
    { label: "Messages", icon: MessageSquare, path: "/messages" },
  ],
  admin: [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Properties", icon: Building2, path: "/properties" },
    { label: "Applications", icon: ClipboardList, path: "/applications" },
    { label: "Users", icon: Users, path: "/users" },
  ],
};

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = user ? navItems[user.role] : [];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-accent-foreground">HomeRent</h1>
            <p className="text-[11px] capitalize text-sidebar-muted">{user?.role} Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "transition-colors",
                        active && "bg-sidebar-accent text-sidebar-primary font-semibold"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/profile")} className="mb-1">
              <Avatar className="h-6 w-6">
                {user?.profileImageUrl && <AvatarImage src={user.profileImageUrl} />}
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-[10px]">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-sidebar-accent-foreground">{user?.name}</span>
                <span className="text-[10px] text-sidebar-muted">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
