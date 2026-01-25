import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const networks = [
  { id: 'base', name: 'Base Mainnet', rpc: 'https://mainnet.base.org' },
  { id: 'celo', name: 'Celo Mainnet', rpc: 'https://forno.celo.org' },
  { id: 'polygon', name: 'Polygon', rpc: 'https://polygon-rpc.com' },
  { id: 'bsc', name: 'BSC', rpc: 'https://bsc-dataseed.binance.org' },
  { id: 'arbitrum', name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc' },
  { id: 'optimism', name: 'Optimism', rpc: 'https://mainnet.optimism.io' },
  { id: 'ethereum', name: 'Ethereum', rpc: 'https://rpc.ankr.com/eth' },
];

interface NetworkSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NetworkSelector({ value, onChange, className }: NetworkSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`bg-background/50 border-input font-medium ${className}`}>
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent>
        {networks.map((net) => (
          <SelectItem key={net.id} value={net.id}>
            {net.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
