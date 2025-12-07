import { Race, Bet, Driver, FtsoPrice, UserStats, Team } from '@/types/betting';

// Helper function to map team names to Team type
function mapTeamToType(teamName: string): Team {
  const teamMap: Record<string, Team> = {
    'Red Bull Racing': 'redbull',
    'McLaren': 'mclaren',
    'Mercedes': 'mercedes',
    'Ferrari': 'ferrari',
    'Aston Martin': 'aston',
    'Alpine': 'alpine',
    'Racing Bulls': 'redbull',
    'Sauber': 'redbull',
    'Haas': 'redbull',
    'Williams': 'redbull',
  };
  return teamMap[teamName] || 'redbull';
}

// Helper function to create driver ID from name
function createDriverId(name: string): string {
  const driverCodeMap: Record<string, string> = {
    'Max Verstappen': 'VER',
    'Lando Norris': 'NOR',
    'Oscar Piastri': 'PIA',
    'George Russell': 'RUS',
    'Charles Leclerc': 'LEC',
    'Fernando Alonso': 'ALO',
    'Gabriel Bortoleto': 'BOR',
    'Esteban Ocon': 'OCO',
    'Isack Hadjar': 'HAD',
    'Yuki Tsunoda': 'TSU',
    'Oliver Bearman': 'BEA',
    'Carlos Sainz': 'SAI',
    'Liam Lawson': 'LAW',
    'Andrea Kimi Antonelli': 'ANT',
    'Lance Stroll': 'STR',
    'Lewis Hamilton': 'HAM',
    'Alexander Albon': 'ALB',
    'Nico Hulkenberg': 'HUL',
    'Pierre Gasly': 'GAS',
    'Franco Colapinto': 'COL',
  };
  return driverCodeMap[name] || name.substring(0, 3).toUpperCase();
}

// 2025 Qualifying Results
const qualifyingResults = [
  { grid_position: 1, driver_number: 1, driver_name: 'Max Verstappen', team: 'Red Bull Racing' },
  { grid_position: 2, driver_number: 4, driver_name: 'Lando Norris', team: 'McLaren' },
  { grid_position: 3, driver_number: 81, driver_name: 'Oscar Piastri', team: 'McLaren' },
  { grid_position: 4, driver_number: 63, driver_name: 'George Russell', team: 'Mercedes' },
  { grid_position: 5, driver_number: 16, driver_name: 'Charles Leclerc', team: 'Ferrari' },
  { grid_position: 6, driver_number: 14, driver_name: 'Fernando Alonso', team: 'Aston Martin' },
  { grid_position: 7, driver_number: 5, driver_name: 'Gabriel Bortoleto', team: 'Sauber' },
  { grid_position: 8, driver_number: 31, driver_name: 'Esteban Ocon', team: 'Haas' },
  { grid_position: 9, driver_number: 6, driver_name: 'Isack Hadjar', team: 'Racing Bulls' },
  { grid_position: 10, driver_number: 22, driver_name: 'Yuki Tsunoda', team: 'Red Bull Racing' },
  { grid_position: 11, driver_number: 87, driver_name: 'Oliver Bearman', team: 'Haas' },
  { grid_position: 12, driver_number: 55, driver_name: 'Carlos Sainz', team: 'Williams' },
  { grid_position: 13, driver_number: 30, driver_name: 'Liam Lawson', team: 'Racing Bulls' },
  { grid_position: 14, driver_number: 12, driver_name: 'Andrea Kimi Antonelli', team: 'Mercedes' },
  { grid_position: 15, driver_number: 18, driver_name: 'Lance Stroll', team: 'Aston Martin' },
  { grid_position: 16, driver_number: 44, driver_name: 'Lewis Hamilton', team: 'Ferrari' },
  { grid_position: 17, driver_number: 23, driver_name: 'Alexander Albon', team: 'Williams' },
  { grid_position: 18, driver_number: 27, driver_name: 'Nico Hulkenberg', team: 'Sauber' },
  { grid_position: 19, driver_number: 10, driver_name: 'Pierre Gasly', team: 'Alpine' },
  { grid_position: 20, driver_number: 43, driver_name: 'Franco Colapinto', team: 'Alpine' },
];

// Create drivers with parimutuel-style initial odds
export const mockDrivers: Driver[] = qualifyingResults.map((result, index) => {
  const baseOdds = index < 3 ? 1.5 + (index * 0.3) :
                   index < 10 ? 3.0 + ((index - 3) * 0.4) :
                   7.0 + ((index - 10) * 0.8);

  return {
    id: createDriverId(result.driver_name),
    name: result.driver_name,
    number: result.driver_number,
    team: mapTeamToType(result.team),
    odds: baseOdds + (Math.random() * 0.2 - 0.1),
  };
});

// Recent completed race
const abuDhabiRace: Race = {
  id: 'abu-dhabi-2025',
  name: 'Abu Dhabi Grand Prix 2025',
  circuit: 'Yas Marina Circuit',
  country: 'United Arab Emirates',
  date: '2025-12-06',
  cutoffTime: '2025-12-06T13:00:00Z',
  status: 'settled',
  drivers: mockDrivers,
  winningDriverId: 'VER',
};

// Upcoming races for betting
export const mockRaces: Race[] = [
  abuDhabiRace,
  {
    id: 'race-1',
    name: 'Bahrain Grand Prix',
    circuit: 'Bahrain International Circuit',
    country: 'Bahrain',
    date: '2025-03-02',
    cutoffTime: '2025-03-02T14:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
  {
    id: 'race-2',
    name: 'Saudi Arabian Grand Prix',
    circuit: 'Jeddah Corniche Circuit',
    country: 'Saudi Arabia',
    date: '2025-03-09',
    cutoffTime: '2025-03-09T16:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
  {
    id: 'race-3',
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    date: '2025-03-23',
    cutoffTime: '2025-03-23T04:00:00Z',
    status: 'upcoming',
    drivers: mockDrivers.map(d => ({ ...d, odds: d.odds + Math.random() * 0.5 - 0.25 })),
  },
];

export const mockBets: Bet[] = [
  {
    id: 'bet-1',
    raceId: 'abu-dhabi-2025',
    raceName: 'Abu Dhabi Grand Prix 2025',
    driverId: 'VER',
    driverName: 'Max Verstappen',
    driverNumber: 1,
    team: 'redbull',
    stake: 0.5,
    odds: 1.5,
    status: 'won',
    potentialPayout: 0.75,
    placedAt: '2025-12-05T10:00:00Z',
    txHash: '0x1234...5678',
  },
  {
    id: 'bet-2',
    raceId: 'abu-dhabi-2025',
    raceName: 'Abu Dhabi Grand Prix 2025',
    driverId: 'NOR',
    driverName: 'Lando Norris',
    driverNumber: 4,
    team: 'mclaren',
    stake: 0.3,
    odds: 2.1,
    status: 'lost',
    potentialPayout: 0,
    placedAt: '2025-12-05T11:00:00Z',
    txHash: '0xabcd...efgh',
  },
  {
    id: 'bet-3',
    raceId: 'race-1',
    raceName: 'Bahrain Grand Prix',
    driverId: 'VER',
    driverName: 'Max Verstappen',
    driverNumber: 1,
    team: 'redbull',
    stake: 1.0,
    odds: 1.85,
    status: 'pending',
    potentialPayout: 1.85,
    placedAt: '2025-02-28T15:30:00Z',
    txHash: '0x9876...5432',
  },
];

export const mockFtsoPrice: FtsoPrice = {
  symbol: 'FLR/USD',
  price: 0.0234,
  timestamp: Date.now(),
  change24h: 5.67,
};

export const mockUserStats: UserStats = {
  totalBets: 12,
  totalWon: 7,
  totalStaked: 8.5,
  totalWinnings: 14.2,
  pendingBets: 2,
  winRate: 58.3,
};

// Contract addresses for Coston2 testnet
export const COSTON2_CONFIG = {
  chainId: 114,
  chainName: 'Flare Coston2',
  rpcUrl: 'https://coston2-api.flare.network/ext/C/rpc',
  explorerUrl: 'https://coston2-explorer.flare.network',
  nativeCurrency: {
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
    decimals: 18,
  },
  contracts: {
    betManager: '0x779f227cddecbd0ef22033f520b926a9a3ee1b0a',
    mockToken: '0x0000000000000000000000000000000000000000',
  },
};
