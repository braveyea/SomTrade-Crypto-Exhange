
import { MarketInfo, ChartDataPoint } from '../types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = 'CG-6SeVrUays41CQ65MYfrAyYjM';

// Helper function for fetching data with retry logic
async function fetchData<T>(endpoint: string, retries = 3, delay = 1000): Promise<T> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}${endpoint}${separator}x_cg_demo_api_key=${COINGECKO_API_KEY}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.text();
        // Don't retry on client errors (4xx) as they are unlikely to succeed on retry.
        if (response.status >= 400 && response.status < 500) {
            throw new Error(`CoinGecko API request failed: ${response.status}. Message: ${errorBody}`);
        }
        // For server errors (5xx) or other issues, throw to trigger a retry.
        throw new Error(`CoinGecko API server error: ${response.status}. Message: ${errorBody}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${endpoint}:`, error);
      if (i === retries - 1) { // If it's the last attempt, re-throw the error.
        throw error;
      }
      // Wait for the delay before the next attempt, with exponential backoff.
      await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
    }
  }
  // This line should be unreachable if retries > 0, but it satisfies TypeScript's need for a return path.
  throw new Error("Failed to fetch data after multiple retries.");
}


// Fetch market data for a list of coins
export const fetchMarkets = async (coinIds: string[]): Promise<MarketInfo[]> => {
  const ids = coinIds.join(',');
  const endpoint = `/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
  return fetchData<MarketInfo[]>(endpoint);
};

// Fetch a broad list of market data for the Markets page
export const fetchAllMarketData = async (count = 100): Promise<MarketInfo[]> => {
    const endpoint = `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`;
    return fetchData<MarketInfo[]>(endpoint);
};

// Fetch historical chart data for a single coin
export const fetchChartData = async (coinId: string): Promise<ChartDataPoint[]> => {
  const endpoint = `/coins/${coinId}/market_chart?vs_currency=usd&days=1`;
  const data = await fetchData<{ prices: [number, number][] }>(endpoint);

  // Format the data for the recharts library
  return data.prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: parseFloat(price.toFixed(5)),
  }));
};

// Fetch the current price for a single coin
export const fetchSimplePrice = async (coinId: string): Promise<{[key: string]: {usd: number}}> => {
    const endpoint = `/simple/price?ids=${coinId}&vs_currencies=usd`;
    return fetchData<{[key: string]: {usd: number}}>(endpoint);
};
