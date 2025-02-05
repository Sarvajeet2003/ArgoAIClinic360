import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Users,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Array<"patient" | "doctor">;
}

const links: SidebarLink[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["patient", "doctor"],
  },
  {
    href: "/records",
    label: "Medical Records",
    icon: ClipboardList,
    roles: ["patient"],
  },
  {
    href: "/appointments",
    label: "Appointments",
    icon: CalendarDays,
    roles: ["patient"],
  },
  {
    href: "/schedule",
    label: "Schedule",
    icon: CalendarDays,
    roles: ["doctor"],
  },
  {
    href: "/patients",
    label: "Patients",
    icon: Users,
    roles: ["doctor"],
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const filteredLinks = links.filter((link) =>
    link.roles.includes(user?.role as "patient" | "doctor")
  );

  return (
    <aside className="w-64 border-r bg-sidebar h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {filteredLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                location === link.href && "bg-sidebar-accent"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
