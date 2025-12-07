# 🏎️ Flare F1 Betting dApp

> A decentralized sports betting platform built on Flare Network, leveraging enshrined oracles (FTSO & FDC) for transparent, trustless race settlements.

![Flare F1 Betting](https://img.shields.io/badge/Flare-Coston2-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![React](https://img.shields.io/badge/React-18.3-61dafb)

## 📖 Overview

Flare F1 Betting is a decentralized application (dApp) that revolutionizes sports betting by leveraging Flare Network's native oracle infrastructure. Unlike traditional betting platforms, this dApp provides complete transparency, trustless settlements, and on-chain verification of all bets and payouts.

### Key Features

- ✅ **Parimutuel Betting System**: Odds dynamically calculated from the betting pool
- ✅ **Real-time FTSO Integration**: Live FLR/USD price feeds displayed in the UI
- ✅ **Full F1 Season Support**: All 20 drivers, multiple races, team-based organization
- ✅ **Wallet Integration**: MetaMask support with automatic network detection
- ✅ **Oracle-Based Settlement**: Trustless race result verification (FDC-ready)
- ✅ **Beautiful UI**: Modern F1-themed dashboard with animations
- ✅ **On-Chain Transparency**: Every bet, settlement, and payout verifiable on Coston2 Explorer

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type-safe development
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 12.23** - Smooth animations
- **React Router 6.30** - Client-side routing
- **TanStack Query 5.83** - Data fetching and caching
- **Ethers.js 6.16** - Ethereum/Flare blockchain interaction
- **shadcn/ui** - Accessible component library (Radix UI)
- **Recharts 2.15** - Data visualization

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin Contracts** - Secure, audited contract libraries
- **Remix IDE** - Contract development and deployment

### Blockchain
- **Flare Coston2 Testnet** - EVM-compatible test network
- **MetaMask** - Wallet provider

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript ESLint** - TypeScript linting

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm (or yarn/pnpm)
- **MetaMask** browser extension
- **Coston2 testnet C2FLR tokens** ([Get from faucet](https://faucet.flare.network/coston2))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd flare-f1-bets

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
flare-f1-bets/
├── contracts/
│   └── FlareF1BetManager.sol    # Main betting smart contract
├── docs/
│   ├── PRODUCT-NARRATIVE.md      # Product vision and roadmap
│   ├── FDC-VISION.md             # FDC integration plans
│   ├── DEMO-SCRIPT.md            # Demo presentation guide
│   └── HACKATHON-PLAN-10H.md     # Development timeline
├── public/                       # Static assets
├── src/
│   ├── components/
│   │   ├── betting/              # BetForm, OraclePanel
│   │   ├── cards/                # RaceCard, BetCard, StatCard
│   │   ├── layout/               # Header, Sidebar, MainLayout
│   │   └── ui/                   # shadcn/ui components
│   ├── config/
│   │   └── contract.ts           # Contract ABI and addresses
│   ├── context/
│   │   ├── BettingContext.tsx    # Betting state management
│   │   └── WalletContext.tsx     # Wallet connection logic
│   ├── data/
│   │   ├── mockData.ts           # Race and driver data
│   │   ├── f1ApiMocks.ts         # F1 API mock responses
│   │   └── f1ApiTypes.ts         # TypeScript types for F1 API
│   ├── hooks/
│   │   ├── useContract.ts        # Contract interaction hook
│   │   └── use-toast.ts          # Toast notifications
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── RacesPage.tsx         # Race listing
│   │   ├── MyBetsPage.tsx        # User bet history
│   │   ├── OraclePage.tsx        # Oracle settlement panel
│   │   └── TransactionsPage.tsx  # Contract events viewer
│   ├── services/
│   │   └── f1ApiService.ts       # F1 API integration service
│   ├── types/
│   │   └── betting.ts            # TypeScript interfaces
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 💡 Usage Examples

### Connecting Your Wallet

```typescript
// Automatically detects MetaMask and Coston2 network
const { wallet, connect, disconnect } = useWallet();

// Connect wallet
await connect();

// Check connection status
if (wallet.isConnected && wallet.isCorrectNetwork) {
  console.log(`Connected: ${wallet.address}`);
  console.log(`Balance: ${wallet.balance} C2FLR`);
}
```

### Placing a Bet

```typescript
const { placeBet, races } = useBetting();

// Find a race
const race = races.find(r => r.name === 'Abu Dhabi Grand Prix 2025');

// Place bet on a driver
const success = await placeBet(
  race.id,           // Race ID
  'VER',            // Driver ID (Max Verstappen)
  1.0               // Stake amount in C2FLR
);

if (success) {
  console.log('Bet placed successfully!');
}
```

### Viewing Your Bets

```typescript
const { bets } = useBetting();

// Filter by status
const pendingBets = bets.filter(b => b.status === 'pending');
const wonBets = bets.filter(b => b.status === 'won');

// Calculate total potential winnings
const totalWinnings = wonBets.reduce((sum, bet) => 
  sum + bet.potentialPayout, 0
);
```

### Claiming Payouts

```typescript
const { claimPayout, bets } = useBetting();

// Find a winning bet
const winningBet = bets.find(b => 
  b.status === 'won' && !b.txHash
);

if (winningBet) {
  const success = await claimPayout(winningBet.id);
  if (success) {
    console.log('Payout claimed!');
  }
}
```

## 🔐 Smart Contract Deployment

### Using Remix IDE

1. **Open Remix IDE**: Visit [remix.ethereum.org](https://remix.ethereum.org)

2. **Install OpenZeppelin**:
   - Go to File Explorer → Load from GitHub
   - Import: `OpenZeppelin/openzeppelin-contracts`

3. **Add Your Contract**:
   - Create `contracts/FlareF1BetManager.sol`
   - Copy contract code from `contracts/FlareF1BetManager.sol`

4. **Compile**:
   - Select Solidity compiler version 0.8.20+
   - Click "Compile FlareF1BetManager.sol"

5. **Deploy**:
   - Go to "Deploy & Run Transactions"
   - Environment: "Injected Provider - MetaMask"
   - Ensure MetaMask is connected to Coston2 testnet
   - Constructor parameter: `_oracle` (your oracle wallet address)
   - Click "Deploy"

6. **Update Contract Address**:
   - Copy deployed contract address
   - Update `src/data/mockData.ts`:
   ```typescript
   contracts: {
     betManager: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
   }
   ```

### Network Configuration

Add Flare Coston2 to MetaMask:

- **Network Name**: Flare Coston2
- **RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
- **Chain ID**: `114`
- **Currency Symbol**: `C2FLR`
- **Block Explorer**: `https://coston2-explorer.flare.network`

## 🏗️ Architecture

### Smart Contract Architecture

```
FlareF1BetManager.sol
├── Race Management
│   ├── createRace() - Admin creates new race
│   ├── addDriver() - Add drivers to race
│   └── closeRace() - Oracle closes betting
├── Betting Functions
│   ├── placeBet() - Users place bets (payable)
│   └── getImpliedOdds() - Calculate dynamic odds
├── Settlement
│   └── setRaceResult() - Oracle sets winner
└── Payouts
    └── claimPayout() - Winners claim funds
```

### Parimutuel Betting System

- **Odds Calculation**: `impliedOdds = (totalPool * 100) / driverPool`
- **Payout Formula**: `payout = (userStake / winningPool) * totalPool * (1 - fee)`
- **Platform Fee**: 2.5% (250 basis points)

### Frontend Architecture

- **Context Providers**: Centralized state management for wallet and betting
- **React Hooks**: Custom hooks for contract interactions
- **Event Listeners**: Real-time contract event monitoring
- **Mock Data Fallback**: Works offline with mock data

## 🌟 Features in Detail

### 1. Race Management

- View upcoming, closed, and settled races
- Filter races by status
- See all 20 drivers sorted by team
- Display grid positions from qualifying

### 2. Betting Interface

- Select from 20 F1 drivers
- Dynamic odds based on betting pool
- Real-time payout calculations
- Wallet integration for instant transactions

### 3. Bet History

- Track all your bets
- View pending, won, and lost bets
- See transaction hashes for verification
- Calculate total winnings

### 4. Oracle Panel

- Settle race results (oracle-only)
- Set winning driver
- Automatically update all bet statuses
- Trigger payout claims

### 5. Transaction Viewer

- Monitor all contract events
- Filter by event type
- View transaction details
- Link to Coston2 Explorer

## 📊 Data Structure

### Race Data

```typescript
interface Race {
  id: string;
  name: string;
  circuit: string;
  country: string;
  date: string;
  cutoffTime: string;
  status: 'upcoming' | 'closed' | 'settled';
  drivers: Driver[];
  winningDriverId?: string;
}
```

### Driver Data

```typescript
interface Driver {
  id: string;
  name: string;
  number: number;
  team: Team;
  odds: number;
  gridPosition?: number;
}
```

### Bet Data

```typescript
interface Bet {
  id: string;
  raceId: string;
  raceName: string;
  driverId: string;
  driverName: string;
  driverNumber: number;
  team: Team;
  stake: number;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'claimed';
  potentialPayout: number;
  placedAt: string;
  txHash?: string;
}
```

## 🔄 Development Workflow

### Adding a New Race

1. Update `src/data/mockData.ts`:
```typescript
const newRace: Race = {
  id: 'race-2025-25',
  name: 'New Grand Prix',
  circuit: 'Circuit Name',
  country: 'Country',
  date: '2025-12-14',
  cutoffTime: '2025-12-14T14:00:00Z',
  status: 'upcoming',
  drivers: [...], // All 20 drivers
};
```

2. Add to `mockRaces` array

### Adding a New Team

1. Update `src/types/betting.ts`:
```typescript
export type Team = 'redbull' | ... | 'newteam';
```

2. Add CSS color in `src/index.css`:
```css
--team-newteam: 120 60% 50%;
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚧 Roadmap

### MVP (Current)
- ✅ Wallet connection
- ✅ Race listing
- ✅ Bet placement
- ✅ Oracle settlement
- ✅ Payout claims
- ✅ FTSO price display

### Phase 2: Production
- [ ] Full FDC integration with Merkle proofs
- [ ] Real-time F1 API integration
- [ ] Multi-bet types (qualifying, fastest lap)
- [ ] Social features (leaderboards)

### Phase 3: Expansion
- [ ] Additional motorsports
- [ ] Cross-chain via Flare LayerCake
- [ ] DAO governance
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Flare Network** - For the amazing oracle infrastructure
- **OpenZeppelin** - For secure contract libraries
- **F1 Community** - For the inspiration

## 📞 Support

- **Documentation**: See `/docs` folder for detailed guides
- **Issues**: Open an issue on GitHub
- **Flare Network**: [flare.network](https://flare.network)

## 🔗 Links

- **Flare Network**: https://flare.network
- **Coston2 Explorer**: https://coston2-explorer.flare.network
- **Coston2 Faucet**: https://faucet.flare.network/coston2
- **Remix IDE**: https://remix.ethereum.org

---

**Built with ❤️ on Flare Network**
