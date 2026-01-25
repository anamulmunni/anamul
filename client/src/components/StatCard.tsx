import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  colorClass?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className, colorClass = "text-primary" }: StatCardProps) {
  return (
    <Card className={cn("bg-card/40 border-white/5 backdrop-blur-md overflow-hidden relative group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={cn("w-16 h-16", colorClass)} />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("p-2 rounded-lg bg-background/50", colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          {trend && <span className="text-xs text-green-400 font-medium">{trend}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
