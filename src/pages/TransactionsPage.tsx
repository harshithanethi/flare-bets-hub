import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Ticket, Trophy, Wallet, Clock, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBetting } from '@/context/BettingContext';
import { ContractEvent } from '@/types/betting';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { COSTON2_CONFIG } from '@/data/mockData';

const eventConfig = {
  BetPlaced: {
    icon: Ticket,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Bet Placed',
  },
  RaceResultSet: {
    icon: Trophy,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    label: 'Race Result',
  },
  PayoutClaimed: {
    icon: Wallet,
    color: 'text-success',
    bgColor: 'bg-success/10',
    label: 'Payout Claimed',
  },
  RaceCreated: {
    icon: Trophy,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    label: 'Race Created',
  },
  DriverAdded: {
    icon: Ticket,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    label: 'Driver Added',
  },
};

function EventCard({ event }: { event: ContractEvent }) {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="racing-card p-4"
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          config.bgColor
        )}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Block #{event.blockNumber}
            </span>
          </div>

          <a
            href={`${COSTON2_CONFIG.explorerUrl}/tx/${event.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <code className="font-mono text-xs">{truncateHash(event.txHash)}</code>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatTime(event.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TransactionsPage() {
  const { contractEvents, refreshEvents, isLoading } = useBetting();

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  return (
    <MainLayout title="Transactions" subtitle="View on-chain betting activity">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Contract Events</h3>
              <p className="text-sm text-muted-foreground">
                Live feed from Coston2 testnet
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshEvents}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Events List */}
        {contractEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="racing-card p-12 text-center"
          >
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Events Yet</h3>
            <p className="text-muted-foreground">
              Contract events will appear here once transactions are made.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {contractEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
