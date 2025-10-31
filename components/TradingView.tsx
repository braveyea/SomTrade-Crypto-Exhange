
import React, { useState } from 'react';
import PriceChart from './PriceChart';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';
import OrderForm from './OrderForm';
import MarketSelector from './MarketSelector';
import useMarketData from '../hooks/useMarketData';
import GeminiInfoPanel from './GeminiInfoPanel';
import { MarketInfo, OrderType, Trade, Portfolio } from '../types';

interface TradingViewProps {
  markets: MarketInfo[];
  selectedCoinId: string;
  setSelectedCoinId: (coinId: string) => void;
  portfolio: Portfolio;
  executeTrade: (side: 'buy' | 'sell', amount: number, price: number, baseAsset: string, quoteAsset: string) => void;
}

const TradingView: React.FC<TradingViewProps> = ({ markets, selectedCoinId, setSelectedCoinId, portfolio, executeTrade }) => {
  const { chartData, orderBook, latestPrice, error, loading } = useMarketData(selectedCoinId);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);

  const selectedMarket = markets.find(m => m.id === selectedCoinId);

  const handleNewTrade = (side: 'buy' | 'sell', amount: number, price: number, baseAsset: string, quoteAsset: string): void => {
    try {
      // Execute the trade against the portfolio
      executeTrade(side, amount, price, baseAsset, quoteAsset);

      // Create a new trade record
      // FIX: Add missing 'symbol' and 'timestamp' properties to conform to the 'Trade' type.
      const timestamp = Date.now();
      const newTrade: Trade = {
        id: timestamp.toString(),
        time: new Date(timestamp).toLocaleTimeString(),
        price,
        amount,
        type: side === 'buy' ? OrderType.BUY : OrderType.SELL,
        symbol: baseAsset.toUpperCase(),
        timestamp,
      };

      // Update the trade history
      setTradeHistory(prev => [newTrade, ...prev].slice(0, 50));
      alert('Trade executed successfully!');

    } catch (e) {
      if (e instanceof Error) {
        alert(`Error: ${e.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    }
  };


  return (
    <div className="grid grid-cols-12 gap-2 sm:gap-4 max-w-screen-2xl mx-auto">
      {/* Left Panel - Market Selector & Gemini Panel */}
      <div className="col-span-12 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow">
        <MarketSelector markets={markets} selectedCoinId={selectedCoinId} onSelectCoin={setSelectedCoinId} />
        <div className="mt-4">
          <GeminiInfoPanel coinName={selectedMarket?.name || selectedCoinId} />
        </div>
      </div>

      {/* Center Panel - Chart and Order Form */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-2 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 h-96 shadow">
            {loading && !chartData.length && <div className="flex justify-center items-center h-full">Loading Chart...</div>}
            {error && <div className="flex justify-center items-center h-full text-red-500">{error}</div>}
            {selectedMarket && <PriceChart data={chartData} latestPrice={latestPrice} marketInfo={selectedMarket} />}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 shadow">
            <OrderForm 
              latestPrice={latestPrice} 
              portfolio={portfolio}
              selectedMarket={selectedMarket}
              onPlaceOrder={handleNewTrade}
            />
        </div>
      </div>

      {/* Right Panel - Order Book and Trade History */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 flex-1 shadow">
          <OrderBook orderBook={orderBook} latestPrice={latestPrice} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 flex-1 shadow">
          <TradeHistory trades={tradeHistory} />
        </div>
      </div>
    </div>
  );
};

export default TradingView;
