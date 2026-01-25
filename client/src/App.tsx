import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BatchClaim from "@/pages/BatchClaim";
import TokenCollection from "@/pages/TokenCollection";
import ToolsPage from "@/pages/ToolsPage";

function Router() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/batch-claim" component={BatchClaim} />
          <Route path="/token-collection" component={TokenCollection} />
          <Route path="/tools" component={ToolsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
