
import React, { useState, useEffect } from 'react';
import { Portfolio, MarketInfo } from '../types';

type OrderTypeOption = 'limit' | 'market' | 'stop-limit';

interface OrderFormProps {
    latestPrice: number;
    portfolio: Portfolio;
    selectedMarket: MarketInfo | undefined;
    onPlaceOrder: (side: 'buy' | 'sell', amount: number, price: number, baseAsset: string, quoteAsset: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ latestPrice, portfolio, selectedMarket, onPlaceOrder }) => {
  const [orderType, setOrderType] = useState<OrderTypeOption>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');

  const baseAsset = selectedMarket?.symbol.toLowerCase() || '';
  const quoteAsset = 'usdt';

  const baseBalance = portfolio[baseAsset] || 0;
  const quoteBalance = portfolio[quoteAsset] || 0;

  useEffect(() => {
    const priceStr = latestPrice > 0 ? latestPrice.toString() : '';
    if (orderType === 'limit' || orderType === 'stop-limit') {
      setPrice(priceStr);
    } else {
      setPrice(''); // Market orders don't need a price input
    }
  }, [orderType, latestPrice, side]);
  
  // Recalculate total when price or amount changes
  useEffect(() => {
      const priceValue = orderType === 'market' ? latestPrice : parseFloat(price);
      const amountValue = parseFloat(amount);

      if (!isNaN(priceValue) && !isNaN(amountValue) && priceValue > 0) {
          setTotal((priceValue * amountValue).toFixed(2));
      } else {
          setTotal('');
      }
  }, [price, amount, orderType, latestPrice]);


  const handlePlaceOrder = () => {
    // Mocking stop-limit logic for frontend demonstration
    if (orderType === 'stop-limit') {
        const stopPriceValue = parseFloat(stopPrice);
        if (isNaN(stopPriceValue) || stopPriceValue <= 0) {
            alert('Please enter a valid stop price.');
            return;
        }
        alert(`Stop-limit order placed: ${side} ${amount} ${baseAsset.toUpperCase()} at price ${price} when market reaches ${stopPrice}. (This is a mock execution)`);
    }
    
    const orderPrice = orderType === 'market' ? latestPrice : parseFloat(price);
    const orderAmount = parseFloat(amount);

    if (isNaN(orderPrice) || isNaN(orderAmount) || orderPrice <= 0 || orderAmount <= 0) {
        alert('Please enter a valid price and amount.');
        return;
    }
    
    if (!selectedMarket) {
        alert('Please select a market.');
        return;
    }

    onPlaceOrder(side, orderAmount, orderPrice, selectedMarket.symbol.toLowerCase(), 'usdt');
    
    setAmount('');
    setTotal('');
  }

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`py-2 px-4 font-semibold w-1/2 transition-colors ${side === 'buy' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-2 px-4 font-semibold w-1/2 transition-colors ${side === 'sell' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          Sell
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex space-x-2">
            <button onClick={() => setOrderType('limit')} className={`py-1 px-3 rounded transition-colors ${orderType === 'limit' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Limit</button>
            <button onClick={() => setOrderType('market')} className={`py-1 px-3 rounded transition-colors ${orderType === 'market' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Market</button>
            <button onClick={() => setOrderType('stop-limit')} className={`py-1 px-3 rounded transition-colors ${orderType === 'stop-limit' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Stop-Limit</button>
        </div>
        <div className="text-right">
            <div>Avbl: {side === 'buy' ? `${quoteBalance.toFixed(2)} ${quoteAsset.toUpperCase()}` : `${baseBalance.toFixed(4)} ${baseAsset.toUpperCase()}`}</div>
        </div>
      </div>

      <div className="space-y-4">
        {orderType === 'stop-limit' && (
            <div className="relative">
                <label className="text-xs text-gray-500 dark:text-gray-400">Stop Price</label>
                <input 
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="absolute right-3 top-7 text-gray-500 dark:text-gray-400 text-sm">USDT</span>
            </div>
        )}
        {(orderType === 'limit' || orderType === 'stop-limit') && (
          <div className="relative">
            <label className="text-xs text-gray-500 dark:text-gray-400">Limit Price</label>
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
             <span className="absolute right-3 top-7 text-gray-500 dark:text-gray-400 text-sm">USDT</span>
          </div>
        )}
         {orderType === 'market' && (
          <div className="relative">
            <label className="text-xs text-gray-500 dark:text-gray-400">Price</label>
            <input 
              type="text"
              value="Market Price"
              readOnly
              className="w-full bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
             <span className="absolute right-3 top-7 text-gray-500 dark:text-gray-400 text-sm">USDT</span>
          </div>
        )}
        <div className="relative">
          <label className="text-xs text-gray-500 dark:text-gray-400">Amount</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Amount in ${baseAsset.toUpperCase()}`}
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <label className="text-xs text-gray-500 dark:text-gray-400">Total</label>
          <input 
            type="number" 
            value={total}
            readOnly
            className="w-full bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <span className="absolute right-3 top-7 text-gray-500 dark:text-gray-400 text-sm">USDT</span>
        </div>
      </div>
      <button 
        onClick={handlePlaceOrder}
        className={`w-full mt-4 py-3 rounded-md font-semibold text-white transition-colors ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
        {side === 'buy' ? `Buy ${baseAsset.toUpperCase()}` : `Sell ${baseAsset.toUpperCase()}`}
      </button>
    </div>
  );
};

export default OrderForm;
