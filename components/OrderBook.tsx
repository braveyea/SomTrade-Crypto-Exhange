
import React from 'react';
import { OrderBook as OrderBookType } from '../types';

interface OrderBookProps {
  orderBook: OrderBookType;
  latestPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ orderBook, latestPrice }) => {
  const priceToDisplay = latestPrice || (orderBook.bids.length > 0 ? orderBook.bids[0].price : 0);
  const priceColor = latestPrice > (orderBook.bids[0]?.price || 0) ? 'text-green-500' : 'text-red-500';

  return (
    <div className="h-full flex flex-col text-xs">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Order Book</h3>
      <div className="grid grid-cols-3 gap-x-2 text-gray-500 dark:text-gray-400 mb-1 px-1">
        <span>Price (USDT)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>
      <div className="flex-grow overflow-y-auto">
        {/* Asks */}
        <div>
          {orderBook.asks.map((order, index) => (
            <div key={index} className="grid grid-cols-3 gap-x-2 px-1 py-0.5 relative text-gray-800 dark:text-gray-200">
              <span className="text-red-500">{order.price.toFixed(2)}</span>
              <span className="text-right">{order.amount.toFixed(3)}</span>
              <span className="text-right">{order.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {/* Current Price */}
        <div className="py-2 my-1 border-y border-gray-200 dark:border-gray-700">
           <span className={`text-lg font-bold ${priceColor}`}>
             {priceToDisplay.toFixed(2)}
           </span>
        </div>

        {/* Bids */}
        <div>
          {orderBook.bids.map((order, index) => (
            <div key={index} className="grid grid-cols-3 gap-x-2 px-1 py-0.5 relative text-gray-800 dark:text-gray-200">
              <span className="text-green-500">{order.price.toFixed(2)}</span>
              <span className="text-right">{order.amount.toFixed(3)}</span>
              <span className="text-right">{order.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;