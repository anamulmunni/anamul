import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Layers, Settings, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 blur-[100px] rounded-full -z-10" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          Batch Operations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced blockchain automation tool for batch claiming and token collection. 
          Secure, fast, and integrated with Telegram logging.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/batch-claim">
            <Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90">
              Launch App <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <StatCard 
          title="Networks Supported" 
          value="7+" 
          icon={Layers} 
          className="border-t-4 border-t-blue-500" 
          colorClass="text-blue-500"
        />
        <StatCard 
          title="Active Wallets" 
          value="1,240" 
          icon={Zap} 
          trend="+12% this week"
          className="border-t-4 border-t-purple-500" 
          colorClass="text-purple-500"
        />
        <StatCard 
          title="System Status" 
          value="Online" 
          icon={Settings} 
          className="border-t-4 border-t-green-500" 
          colorClass="text-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/batch-claim" className="group">
          <Card className="h-full glass-card hover:bg-white/5 transition-colors border-l-4 border-l-primary cursor-pointer">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Batch Claim</h3>
                <p className="text-muted-foreground">
                  Execute claim transactions across multiple wallets simultaneously. 
                  Automatic success logging to Telegram.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/token-collection" className="group">
          <Card className="h-full glass-card hover:bg-white/5 transition-colors border-l-4 border-l-cyan-500 cursor-pointer">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                <Layers className="w-8 h-8 text-cyan-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Token Collection</h3>
                <p className="text-muted-foreground">
                  Aggregate tokens from multiple source wallets to a single destination address.
                  Gas estimation included.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
