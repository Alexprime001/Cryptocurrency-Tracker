
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof CryptoData;
  direction: SortDirection;
}

export type TimeRange = '1d' | '7d' | '30d' | '1y';
