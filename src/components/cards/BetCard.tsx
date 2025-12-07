import { motion } from 'framer-motion';
import { Bet } from '@/types/betting';
import { Clock, Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/context/BettingContext';
import { COSTON2_CONFIG } from '@/data/mockData';

interface BetCardProps {
  bet: Bet;
  delay?: number;
}

export function BetCard({ bet, delay = 0 }: BetCardProps) {
  const { claimPayout, isLoading } = useBetting();

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      label: 'Pending',
    },
    won: {
      icon: Check,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      label: 'Won',
    },
    lost: {
      icon: X,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      label: 'Lost',
    },
    claimed: {
      icon: Check,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-muted',
      label: 'Claimed',
    },
  };

  const config = statusConfig[bet.status];
  const StatusIcon = config.icon;

  const handleClaim = async () => {
    await claimPayout(bet.id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="racing-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{
              backgroundColor: `hsl(var(--team-${bet.team}) / 0.2)`,
              color: `hsl(var(--team-${bet.team}))`,
            }}
          >
            {bet.driverNumber}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{bet.driverName}</h3>
            <p className="text-sm text-muted-foreground">{bet.raceName}</p>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full border",
          config.bgColor,
          config.borderColor
        )}>
          <StatusIcon className={cn("w-4 h-4", config.color)} />
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Stake</p>
          <p className="font-mono font-semibold text-foreground">{bet.stake} C2FLR</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Odds</p>
          <p className="font-mono font-semibold text-primary">{bet.odds.toFixed(2)}x</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {bet.status === 'won' || bet.status === 'claimed' ? 'Payout' : 'Potential'}
          </p>
          <p className="font-mono font-semibold text-foreground">
            {bet.potentialPayout.toFixed(4)} C2FLR
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatDate(bet.placedAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          {bet.txHash && (
            <a
              href={`${COSTON2_CONFIG.explorerUrl}/tx/${bet.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Tx
            </a>
          )}

          {bet.status === 'won' && (
            <Button
              size="sm"
              onClick={handleClaim}
              disabled={isLoading}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Claim Payout
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
