export interface ChartDataPoint {
  time: string;
  price: number;
}

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Order {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: Order[];
  asks: Order[];
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRADE = 'TRADE',
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
  REWARD = 'REWARD',
}

export interface BaseTransaction {
  id: string;
  timestamp: number;
  type: TransactionType;
}

export interface DepositWithdrawTransaction extends BaseTransaction {
  type: TransactionType.DEPOSIT | TransactionType.WITHDRAW;
  asset: string; // e.g. 'BTC'
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface TradeTransaction extends BaseTransaction {
  type: TransactionType.TRADE;
  baseAsset: string; // e.g. 'BTC'
  quoteAsset: string; // e.g. 'USDT'
  side: OrderType;
  amount: number;
  price: number;
}

export interface StakingTransaction extends BaseTransaction {
  type: TransactionType.STAKE | TransactionType.UNSTAKE | TransactionType.REWARD;
  asset: string; // e.g. 'ETH'
  amount: number;
}

export type Transaction = DepositWithdrawTransaction | TradeTransaction | StakingTransaction;


export interface MarketInfo {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
}

export interface Portfolio {
  [assetSymbol: string]: number;
}

export interface StakingPortfolio {
  [assetSymbol: string]: {
    amount: number;
    rewards: number;
  };
}

export interface StakingPool {
    id: string;
    asset: string;
    symbol: string;
    image: string;
    apy: number;
    lockupPeriod: number; // in days
    totalStaked: number;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    avatar: string;
    dailyPnl: number;
    monthlyPnl: number;
    totalVolume: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}