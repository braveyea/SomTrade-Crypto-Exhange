import React from 'react';
import { Trade, OrderType } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="h-full flex flex-col text-xs">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Trade History</h3>
      <div className="grid grid-cols-3 gap-x-2 text-gray-500 dark:text-gray-400 mb-1 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      <div className="flex-grow overflow-y-auto">
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-3 gap-x-2 px-1 py-0.5 text-gray-800 dark:text-gray-200">
            <span className={trade.type === OrderType.BUY ? 'text-green-500' : 'text-red-500'}>
              {trade.price.toFixed(2)}
            </span>
            <span className="text-right">{trade.amount.toFixed(4)}</span>
            <span className="text-right text-gray-500 dark:text-gray-400">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;