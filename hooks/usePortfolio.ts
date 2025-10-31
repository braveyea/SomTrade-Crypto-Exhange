
import { useState, useEffect } from 'react';
import { Portfolio, Trade, OrderType } from '../types';

const PORTFOLIO_STORAGE_KEY = 'gemini-ex-portfolio';
const TRADE_HISTORY_STORAGE_KEY = 'gemini-ex-trade-history';

const initialPortfolio: Portfolio = {
  usdt: 10000.00,
  btc: 0.5,
  eth: 10,
  sol: 100,
  doge: 50000,
  xrp: 2000,
};

const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    try {
      const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (storedPortfolio) {
        return JSON.parse(storedPortfolio);
      }
    } catch (error) {
      console.error("Error parsing portfolio from localStorage", error);
    }
    return initialPortfolio;
  });

  const [tradeHistory, setTradeHistory] = useState<Trade[]>(() => {
    try {
        const storedHistory = localStorage.getItem(TRADE_HISTORY_STORAGE_KEY);
        if(storedHistory) {
            return JSON.parse(storedHistory);
        }
    } catch (error) {
        console.error("Error parsing trade history from localStorage", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    } catch (error) {
      console.error("Error saving portfolio to localStorage", error);
    }
  }, [portfolio]);

  useEffect(() => {
    try {
        localStorage.setItem(TRADE_HISTORY_STORAGE_KEY, JSON.stringify(tradeHistory));
    } catch (error) {
        console.error("Error saving trade history to localStorage", error);
    }
  }, [tradeHistory]);

  const executeTrade = (
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    baseAsset: string, // e.g. 'btc'
    quoteAsset: string // e.g. 'usdt'
  ) => {
    const totalCost = amount * price;

    setPortfolio(prevPortfolio => {
      const newPortfolio = { ...prevPortfolio };

      const baseBalance = newPortfolio[baseAsset] || 0;
      const quoteBalance = newPortfolio[quoteAsset] || 0;

      if (side === 'buy') {
        if (quoteBalance < totalCost) {
          throw new Error('Insufficient USDT balance.');
        }
        newPortfolio[quoteAsset] = quoteBalance - totalCost;
        newPortfolio[baseAsset] = baseBalance + amount;
      } else { // sell
        if (baseBalance < amount) {
          throw new Error(`Insufficient ${baseAsset.toUpperCase()} balance.`);
        }
        newPortfolio[baseAsset] = baseBalance - amount;
        newPortfolio[quoteAsset] = quoteBalance + totalCost;
      }
      return newPortfolio;
    });

    const timestamp = Date.now();
    const newTrade: Trade = {
        id: timestamp.toString(),
        timestamp,
        time: new Date(timestamp).toLocaleTimeString(),
        price,
        amount,
        type: side === 'buy' ? OrderType.BUY : OrderType.SELL,
        symbol: baseAsset.toUpperCase(),
    };

    setTradeHistory(prevHistory => [newTrade, ...prevHistory]);
  };

  return { portfolio, executeTrade, tradeHistory };
};

export default usePortfolio;
