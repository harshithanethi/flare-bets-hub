import { MainLayout } from '@/components/layout/MainLayout';
import { BetCard } from '@/components/cards/BetCard';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MyBetsPage() {
  const { bets } = useBetting();
  const { wallet, connect } = useWallet();

  const pendingBets = bets.filter(b => b.status === 'pending');
  const wonBets = bets.filter(b => b.status === 'won');
  const lostBets = bets.filter(b => b.status === 'lost');
  const claimedBets = bets.filter(b => b.status === 'claimed');

  if (!wallet.isConnected) {
    return (
      <MainLayout title="My Bets" subtitle="View and manage your bets">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="racing-card p-12 text-center"
        >
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your betting history.
          </p>
          <Button
            onClick={connect}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </motion.div>
      </MainLayout>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="racing-card p-12 text-center"
    >
      <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Link to="/races">
        <Button variant="outline">Browse Races</Button>
      </Link>
    </motion.div>
  );

  return (
    <MainLayout title="My Bets" subtitle="View and manage your bets">
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pending ({pendingBets.length})
          </TabsTrigger>
          <TabsTrigger
            value="won"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Won ({wonBets.length})
          </TabsTrigger>
          <TabsTrigger
            value="lost"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Lost ({lostBets.length})
          </TabsTrigger>
          <TabsTrigger
            value="claimed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Claimed ({claimedBets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBets.length === 0 ? (
            <EmptyState message="No pending bets. Place a bet on an upcoming race!" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingBets.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="won" className="space-y-4">
          {wonBets.length === 0 ? (
            <EmptyState message="No winning bets yet. Keep betting!" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {wonBets.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lost" className="space-y-4">
          {lostBets.length === 0 ? (
            <EmptyState message="No lost bets. Great streak!" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lostBets.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="space-y-4">
          {claimedBets.length === 0 ? (
            <EmptyState message="No claimed payouts yet." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {claimedBets.map((bet, index) => (
                <BetCard key={bet.id} bet={bet} delay={index * 0.1} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
