
import { useState, useEffect } from 'react';
import { ChartDataPoint, OrderBook, Order } from '../types';
import { fetchChartData, fetchSimplePrice } from '../services/coingeckoService';

const generateOrderBook = (price: number): OrderBook => {
    const bids: Order[] = [];
    const asks: Order[] = [];
    for (let i = 1; i <= 15; i++) {
        const bidPrice = price - i * (price * 0.0001);
        const askPrice = price + i * (price * 0.0001);
        const bidAmount = Math.random() * 5;
        const askAmount = Math.random() * 5;
        bids.push({ price: parseFloat(bidPrice.toFixed(2)), amount: parseFloat(bidAmount.toFixed(3)), total: parseFloat((bidPrice * bidAmount).toFixed(2)) });
        asks.push({ price: parseFloat(askPrice.toFixed(2)), amount: parseFloat(askAmount.toFixed(3)), total: parseFloat((askPrice * askAmount).toFixed(2)) });
    }
    return { bids, asks: asks.reverse() };
};

const useMarketData = (coinId: string) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({bids: [], asks: []});
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect for fetching initial chart and price data when coinId changes
  useEffect(() => {
    const getInitialData = async () => {
      if (!coinId) return;
      
      setLoading(true);
      setError(null);
      setChartData([]);

      try {
        const historicalData = await fetchChartData(coinId);
        setChartData(historicalData);

        const initialPrice = historicalData.length > 0 ? historicalData[historicalData.length - 1].price : 0;
        
        const priceData = await fetchSimplePrice(coinId);
        const currentPrice = priceData[coinId]?.usd ?? initialPrice;
        
        setLatestPrice(currentPrice);
        setOrderBook(generateOrderBook(currentPrice));

      } catch (err) {
        setError('Failed to load chart data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInitialData();
  }, [coinId]);

  // Effect for polling price updates
  useEffect(() => {
    if (!coinId || loading) return;

    const priceInterval = setInterval(async () => {
      try {
        const priceData = await fetchSimplePrice(coinId);
        const newPrice = priceData[coinId]?.usd;
        
        if (newPrice) {
            setLatestPrice(currentPrice => {
              // Only update if price has changed to avoid unnecessary re-renders
              if (newPrice !== currentPrice) {
                setOrderBook(generateOrderBook(newPrice));
                return newPrice;
              }
              return currentPrice;
            });
        }
        
      } catch (err) {
        console.error('Failed to fetch price update:', err);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(priceInterval);
  }, [coinId, loading]);

  return { chartData, orderBook, latestPrice, loading, error };
};

export default useMarketData;
