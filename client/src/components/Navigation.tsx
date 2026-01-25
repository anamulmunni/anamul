import { Link, useLocation } from "wouter";
import { Zap, Layers, Settings, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/batch-claim", label: "Batch Claim", icon: Zap },
    { href: "/token-collection", label: "Collection", icon: Layers },
    { href: "/tools", label: "Tools", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl z-50 flex gap-2">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300",
                isActive 
                  ? "bg-white text-black font-semibold shadow-lg shadow-white/20 translate-y-[-2px]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive && "fill-current")} />
              <span className={cn("text-sm", !isActive && "hidden md:inline")}>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
