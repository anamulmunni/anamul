import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export type LogType = 'success' | 'error' | 'info';

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: Date;
  details?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  className?: string;
}

export function LogViewer({ logs, className }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className={`rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col ${className}`}>
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Process Logs</h3>
        <span className="text-xs text-muted-foreground">{logs.length} entries</span>
      </div>
      
      <ScrollArea ref={scrollRef} className="flex-1 p-4 h-[300px]">
        <div className="space-y-2 font-mono text-sm">
          {logs.length === 0 && (
            <div className="text-muted-foreground text-center py-8 opacity-50">
              No logs yet. Start a process to see activity.
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="mt-0.5 shrink-0">
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {log.type === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                {log.type === 'info' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin-slow" />}
              </div>
              <div className="flex-1 min-w-0 break-all">
                <span className="text-muted-foreground text-xs mr-2">
                  [{format(log.timestamp, 'HH:mm:ss')}]
                </span>
                <span className={
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'error' ? 'text-red-400' : 
                  'text-blue-300'
                }>
                  {log.message}
                </span>
                {log.details && (
                  <div className="text-muted-foreground/60 text-xs mt-0.5 ml-2 border-l border-white/10 pl-2">
                    {log.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
