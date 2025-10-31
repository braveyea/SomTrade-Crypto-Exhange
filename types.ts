
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

export interface Trade {
  id: string;
  time: string;
  price: number;
  amount: number;
  type: OrderType;
  symbol: string; // e.g. 'BTC'
  timestamp: number;
}

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
