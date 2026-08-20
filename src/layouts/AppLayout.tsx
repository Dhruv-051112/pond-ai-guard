import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BrainCircuit,
  Bell,
  Cpu,
  Droplets,
  Gauge,
  History,
  Info,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ServerCog,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DEVICE_ID } from "@/data/mockData";

const NAV = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/live-monitoring", label: "Live Monitoring", icon: Activity },
  { to: "/water-quality", label: "Water Quality", icon: Droplets },
  { to: "/ai-prediction", label: "AI Prediction", icon: BrainCircuit },
  { to: "/historical-data", label: "Historical Data", icon: History },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/system-status", label: "System Status", icon: ServerCog },
  { to: "/about", label: "About Project", icon: Info },
] as const;

function DeviceStatus({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex justify-center py-3">
        <span className="size-2 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
      </div>
    );
  }
  return (
    <div className="mx-3 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          ESP32 Device
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          ONLINE
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-foreground">{DEVICE_ID}</p>
    </div>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className={cn("flex items-center gap-3 px-4", collapsed && "justify-center px-0")}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <Waves className="size-5" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">AIoT Aquaculture</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Edge AI Monitoring System
            </p>
          </div>
        )}
      </div>

      <DeviceStatus collapsed={collapsed} />

      <nav className="flex-1 space-y-1 px-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground border-primary/40 shadow-[inset_2px_0_0_0_var(--color-primary)]",
            }}
            inactiveProps={{ className: "text-muted-foreground border-transparent" }}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0",
            )}
            title={label}
          >
            <Icon className="size-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 text-[11px] leading-relaxed text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Cpu className="size-3.5" /> Edge inference on-device
          </p>
          <p className="mt-1">Prototype build · mock data</p>
        </div>
      )}
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [now, setNow] = useState<string>("");

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const update = () => setNow(new Date().toLocaleTimeString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const current = NAV.find((n) => n.to === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar">
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <button
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary lg:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
            <span className="text-sm font-medium">{current}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden font-mono sm:inline">{now}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 font-semibold uppercase tracking-wider text-success">
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
              Online
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
