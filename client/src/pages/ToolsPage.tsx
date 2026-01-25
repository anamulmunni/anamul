import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Clock, Check } from "lucide-react";
import { useAddPermanentVerified, useScheduleAutoClaim } from "@/hooks/use-api";
import { useState } from "react";
import { NetworkSelector } from "@/components/NetworkSelector";

export default function ToolsPage() {
  const [verifyAddress, setVerifyAddress] = useState("");
  const [scheduleAddress, setScheduleAddress] = useState("");
  const [scheduleNetwork, setScheduleNetwork] = useState("base");

  const addVerifiedMutation = useAddPermanentVerified();
  const scheduleMutation = useScheduleAutoClaim();

  const handleVerify = () => {
    if (!verifyAddress) return;
    addVerifiedMutation.mutate(verifyAddress);
    setVerifyAddress("");
  };

  const handleSchedule = () => {
    if (!scheduleAddress) return;
    scheduleMutation.mutate({ address: scheduleAddress, network: scheduleNetwork });
    setScheduleAddress("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Utility Tools
        </h1>
        <p className="text-muted-foreground">Additional automated actions and verification tools</p>
      </div>

      <Tabs defaultValue="verified" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-background/50 p-1">
          <TabsTrigger value="verified">Permanent Verified</TabsTrigger>
          <TabsTrigger value="autoclaim">Auto Claim Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verified" className="mt-6">
          <Card className="glass-card glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Add Permanent Verified Address
              </CardTitle>
              <CardDescription>
                Whitelisting an address ensures it bypasses certain checks in the claim process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <Input 
                    value={verifyAddress}
                    onChange={(e) => setVerifyAddress(e.target.value)}
                    placeholder="0x..." 
                    className="font-mono"
                  />
                  <Button onClick={handleVerify} disabled={addVerifiedMutation.isPending}>
                    {addVerifiedMutation.isPending ? 'Adding...' : 'Add to List'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autoclaim" className="mt-6">
          <Card className="glass-card glow-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Schedule Auto Claim
              </CardTitle>
              <CardDescription>
                Configure automatic claiming for specific wallets on intervals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Network</Label>
                  <NetworkSelector value={scheduleNetwork} onChange={setScheduleNetwork} />
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <Input 
                    value={scheduleAddress}
                    onChange={(e) => setScheduleAddress(e.target.value)}
                    placeholder="0x..." 
                    className="font-mono"
                  />
                </div>
                <Button 
                  onClick={handleSchedule} 
                  disabled={scheduleMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Enable Auto Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
