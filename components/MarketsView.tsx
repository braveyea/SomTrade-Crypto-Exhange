
import React, { useState, useEffect, useMemo } from 'react';
import { MarketInfo } from '../types';
import { fetchAllMarketData } from '../services/coingeckoService';

interface MarketsViewProps {
  onNavigateToTrade: (coinId: string) => void;
}

type MarketTab = 'Hot' | 'New' | 'Gainers' | 'Losers' | 'Turnover';

const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
  if (typeof num !== 'number' || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    ...options
  }).format(num);
};

const TableSkeleton: React.FC = () => (
    <>
        {[...Array(10)].map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="p-4"><div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td className="p-4"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td className="p-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td className="p-4 hidden sm:table-cell"><div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td className="p-4 hidden md:table-cell"><div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td className="p-4 hidden lg:table-cell"><div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
            </tr>
        ))}
    </>
);


const MarketsView: React.FC<MarketsViewProps> = ({ onNavigateToTrade }) => {
  const [marketData, setMarketData] = useState<MarketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<MarketTab>('Hot');

  useEffect(() => {
    const getMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllMarketData(100);
        setMarketData(data);
      } catch (err) {
        setError('Failed to fetch market data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getMarketData();
  }, []);

  const displayedCoins = useMemo(() => {
    if (!marketData) return [];

    const filtered = marketData.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeTab) {
      case 'Gainers':
        return [...filtered].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
      case 'Losers':
        return [...filtered].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0));
      case 'New':
        return [...filtered].sort((a, b) => (a.market_cap_rank || 0) - (b.market_cap_rank || 0));
      case 'Turnover':
        return [...filtered].sort((a, b) => {
          const turnoverA = a.circulating_supply > 0 ? (a.total_volume || 0) / a.circulating_supply : 0;
          const turnoverB = b.circulating_supply > 0 ? (b.total_volume || 0) / b.circulating_supply : 0;
          return turnoverB - turnoverA;
        });
      case 'Hot':
      default:
        return [...filtered].sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
    }
  }, [marketData, activeTab, searchTerm]);

  const tabs: MarketTab[] = ['Hot', 'New', 'Gainers', 'Losers', 'Turnover'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
        <div className="relative">
            <input
                type="text"
                placeholder="Search coin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">Coin</th>
              <th scope="col" className="p-4">Price</th>
              <th scope="col" className="p-4">24h Change</th>
              <th scope="col" className="p-4 hidden sm:table-cell">24h High / Low</th>
              <th scope="col" className="p-4 hidden md:table-cell">24h Volume</th>
              <th scope="col" className="p-4 hidden lg:table-cell">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton /> : displayedCoins.map(coin => {
              const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
              return (
                <tr 
                    key={coin.id} 
                    onClick={() => onNavigateToTrade(coin.id)}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-3 rounded-full"/>
                        <span>{coin.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-gray-800 dark:text-gray-200">${formatNumber(coin.current_price, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                  <td className={`p-4 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className="p-4 font-mono hidden sm:table-cell">
                      <div>${formatNumber(coin.high_24h, { minimumFractionDigits: 2 })}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">${formatNumber(coin.low_24h, { minimumFractionDigits: 2 })}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">${formatNumber(coin.total_volume, { notation: 'compact', compactDisplay: 'short' })}</td>
                  <td className="p-4 hidden lg:table-cell">${formatNumber(coin.market_cap, { notation: 'compact', compactDisplay: 'short' })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {error && <div className="text-center p-4 text-red-500">{error}</div>}
        {!loading && displayedCoins.length === 0 && !error && (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold">No coins found</h3>
                <p>Try adjusting your search or filter.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MarketsView;
