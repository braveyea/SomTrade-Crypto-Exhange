
import React from 'react';
import { MarketInfo } from '../types';

interface MarketSelectorProps {
  markets: MarketInfo[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({ markets, selectedCoinId, onSelectCoin }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Markets</h3>
      <div className="space-y-1">
        {markets.length === 0 && <div className="text-center text-gray-500 dark:text-gray-400 py-4">Loading Markets...</div>}
        {markets.map((market) => {
          const isSelected = selectedCoinId === market.id;
          const isPositive = market.price_change_percentage_24h >= 0;
          return (
            <button
              key={market.id}
              onClick={() => onSelectCoin(market.id)}
              className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between ${
                isSelected
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <img src={market.image} alt={market.name} className="w-6 h-6 mr-2" />
                <span className="font-semibold text-sm">{market.symbol.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">
                  ${market.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5})}
                </div>
                <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'} ${isSelected && 'text-white'}`}>
                  {isPositive ? '+' : ''}{market.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default MarketSelector;