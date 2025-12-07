import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Race, Bet, FtsoPrice, UserStats, ContractEvent } from '@/types/betting';
import { mockRaces, mockBets, mockFtsoPrice, mockUserStats } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { getExplorerTxUrl } from '@/config/contract';

interface BettingContextType {
  races: Race[];
  bets: Bet[];
  ftsoPrice: FtsoPrice;
  userStats: UserStats;
  contractEvents: ContractEvent[];
  placeBet: (raceId: string, driverId: string, stake: number) => Promise<boolean>;
  claimPayout: (betId: string) => Promise<boolean>;
  setRaceResult: (raceId: string, winningDriverId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  getImpliedOdds: (raceId: string, driverId: string) => Promise<number>;
  isLoading: boolean;
  isContractReady: boolean;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [races, setRaces] = useState<Race[]>(mockRaces);
  const [bets, setBets] = useState<Bet[]>(mockBets);
  const [ftsoPrice, setFtsoPrice] = useState<FtsoPrice>(mockFtsoPrice);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [contractEvents, setContractEvents] = useState<ContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isContractReady = false; // Mock mode

  // Simulate FTSO price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFtsoPrice(prev => ({
        ...prev,
        price: prev.price * (1 + (Math.random() * 0.02 - 0.01)),
        timestamp: Date.now(),
        change24h: prev.change24h + (Math.random() * 0.5 - 0.25),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const placeBet = useCallback(async (raceId: string, driverId: string, stake: number): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const race = races.find(r => r.id === raceId);
    const driver = race?.drivers.find(d => d.id === driverId);

    if (!race || !driver) {
      toast({ title: 'Error', description: 'Race or driver not found', variant: 'destructive' });
      setIsLoading(false);
      return false;
    }

    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      raceId,
      raceName: race.name,
      driverId,
      driverName: driver.name,
      driverNumber: driver.number,
      team: driver.team,
      stake,
      odds: driver.odds,
      status: 'pending',
      potentialPayout: stake * driver.odds,
      placedAt: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    };

    setBets(prev => [newBet, ...prev]);
    setUserStats(prev => ({
      ...prev,
      totalBets: prev.totalBets + 1,
      totalStaked: prev.totalStaked + stake,
      pendingBets: prev.pendingBets + 1,
    }));

    toast({
      title: 'Bet Placed Successfully!',
      description: `${stake} C2FLR on ${driver.name} @ ${driver.odds.toFixed(2)}x`,
    });

    setIsLoading(false);
    return true;
  }, [races]);

  const claimPayout = useCallback(async (betId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setBets(prev =>
      prev.map(bet =>
        bet.id === betId ? { ...bet, status: 'claimed' as const } : bet
      )
    );

    const bet = bets.find(b => b.id === betId);
    if (bet) {
      setUserStats(prev => ({
        ...prev,
        totalWinnings: prev.totalWinnings + bet.potentialPayout,
      }));

      toast({
        title: 'Payout Claimed!',
        description: `${bet.potentialPayout.toFixed(4)} C2FLR has been transferred to your wallet.`,
      });
    }

    setIsLoading(false);
    return true;
  }, [bets]);

  const setRaceResult = useCallback(async (raceId: string, winningDriverId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setRaces(prev =>
      prev.map(race =>
        race.id === raceId
          ? { ...race, status: 'settled' as const, winningDriverId }
          : race
      )
    );

    setBets(prev =>
      prev.map(bet => {
        if (bet.raceId === raceId && bet.status === 'pending') {
          return {
            ...bet,
            status: bet.driverId === winningDriverId ? 'won' : 'lost',
          };
        }
        return bet;
      })
    );

    toast({
      title: 'Race Result Set',
      description: `Race settled with winning driver.`,
    });

    setIsLoading(false);
    return true;
  }, []);

  const refreshEvents = useCallback(async (): Promise<void> => {
    // Mock event refresh
    const mockEvents: ContractEvent[] = [
      {
        id: 'event-1',
        type: 'BetPlaced',
        txHash: '0x1234567890abcdef',
        blockNumber: 12345678,
        timestamp: Date.now() - 3600000,
        data: { user: '0x123...', amount: '0.5 C2FLR' },
      },
      {
        id: 'event-2',
        type: 'RaceResultSet',
        txHash: '0xabcdef1234567890',
        blockNumber: 12345690,
        timestamp: Date.now() - 1800000,
        data: { raceId: 'race-1', winner: 'VER' },
      },
    ];
    setContractEvents(mockEvents);
  }, []);

  const getImpliedOdds = useCallback(async (raceId: string, driverId: string): Promise<number> => {
    const race = races.find(r => r.id === raceId);
    const driver = race?.drivers.find(d => d.id === driverId);
    return driver?.odds || 1;
  }, [races]);

  return (
    <BettingContext.Provider
      value={{
        races,
        bets,
        ftsoPrice,
        userStats,
        contractEvents,
        placeBet,
        claimPayout,
        setRaceResult,
        refreshEvents,
        getImpliedOdds,
        isLoading,
        isContractReady,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
