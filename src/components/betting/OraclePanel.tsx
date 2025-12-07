import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBetting } from '@/context/BettingContext';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Loader2, Check, AlertTriangle, Zap } from 'lucide-react';

export function OraclePanel() {
  const { races, setRaceResult, isLoading } = useBetting();
  const { wallet } = useWallet();
  const [selectedRaceId, setSelectedRaceId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const closedRaces = races.filter(r => r.status === 'closed' || r.status === 'upcoming');
  const selectedRace = races.find(r => r.id === selectedRaceId);

  const handleSubmitResult = async () => {
    if (!selectedRaceId || !selectedDriverId) return;
    await setRaceResult(selectedRaceId, selectedDriverId);
    setSelectedRaceId('');
    setSelectedDriverId('');
  };

  return (
    <div className="space-y-6">
      {/* Oracle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="racing-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Oracle Settlement</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Submit race results to settle bets. Only authorized oracles can set results.
              In production, this would be powered by Flare's FTSO and FDC.
            </p>
          </div>
        </div>
      </motion.div>

      {/* FTSO Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="racing-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Flare FTSO Integration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This dApp leverages Flare's Time Series Oracle (FTSO) for decentralized price feeds
              and the Flare Data Connector (FDC) for secure external data verification.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">Price Oracle</p>
                <p className="font-mono text-sm text-foreground">FLR/USD FTSO</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">Data Verification</p>
                <p className="font-mono text-sm text-foreground">FDC Attestation</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Set Race Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="racing-card p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Set Race Result</h3>

        {!wallet.isConnected ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <p className="text-sm text-muted-foreground">
              Connect your wallet to submit race results.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Race</Label>
              <Select value={selectedRaceId} onValueChange={setSelectedRaceId}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choose a race" />
                </SelectTrigger>
                <SelectContent>
                  {closedRaces.map((race) => (
                    <SelectItem key={race.id} value={race.id}>
                      {race.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRace && (
              <div className="space-y-2">
                <Label>Winning Driver</Label>
                <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedRace.drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        #{driver.number} - {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={handleSubmitResult}
              disabled={!selectedRaceId || !selectedDriverId || isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Result
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
