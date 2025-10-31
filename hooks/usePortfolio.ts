import { useState, useEffect } from 'react';
import { 
  Portfolio, 
  StakingPortfolio, 
  Transaction, 
  OrderType, 
  TransactionType, 
  DepositWithdrawTransaction, 
  TradeTransaction, 
  StakingTransaction 
} from '../types';

const PORTFOLIO_STORAGE_KEY = 'somtrade-portfolio';
const STAKED_PORTFOLIO_STORAGE_KEY = 'somtrade-staked-portfolio';
const TRANSACTION_HISTORY_STORAGE_KEY = 'somtrade-transaction-history';

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
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialPortfolio;
    } catch (error) {
      console.error("Error parsing portfolio from localStorage", error);
      return initialPortfolio;
    }
  });

  const [stakedPortfolio, setStakedPortfolio] = useState<StakingPortfolio>(() => {
     try {
      const stored = localStorage.getItem(STAKED_PORTFOLIO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error parsing staked portfolio from localStorage", error);
      return {};
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
        const stored = localStorage.getItem(TRANSACTION_HISTORY_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Error parsing transaction history from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem(STAKED_PORTFOLIO_STORAGE_KEY, JSON.stringify(stakedPortfolio));
  }, [stakedPortfolio]);

  useEffect(() => {
    localStorage.setItem(TRANSACTION_HISTORY_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Fix: Use an explicit union of Omit types to help TypeScript correctly discriminate the transaction type.
  const addTransaction = (transaction: 
    | Omit<DepositWithdrawTransaction, 'id' | 'timestamp'>
    | Omit<TradeTransaction, 'id' | 'timestamp'>
    | Omit<StakingTransaction, 'id' | 'timestamp'>
  ) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    } as Transaction;
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const executeTrade = (
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    baseAsset: string,
    quoteAsset: string
  ) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      const totalCost = amount * price;
      const baseBalance = newPortfolio[baseAsset] || 0;
      const quoteBalance = newPortfolio[quoteAsset] || 0;

      if (side === 'buy') {
        if (quoteBalance < totalCost) throw new Error('Insufficient USDT balance.');
        newPortfolio[quoteAsset] = quoteBalance - totalCost;
        newPortfolio[baseAsset] = baseBalance + amount;
      } else {
        if (baseBalance < amount) throw new Error(`Insufficient ${baseAsset.toUpperCase()} balance.`);
        newPortfolio[baseAsset] = baseBalance - amount;
        newPortfolio[quoteAsset] = quoteBalance + totalCost;
      }
      return newPortfolio;
    });

    addTransaction({
        type: TransactionType.TRADE,
        baseAsset,
        quoteAsset,
        side: side === 'buy' ? OrderType.BUY : OrderType.SELL,
        amount,
        price,
    });
  };
  
  const stake = (asset: string, amount: number) => {
    setPortfolio(prev => {
        const newPortfolio = { ...prev };
        const balance = newPortfolio[asset] || 0;
        if (balance < amount) throw new Error(`Insufficient ${asset.toUpperCase()} to stake.`);
        newPortfolio[asset] = balance - amount;
        return newPortfolio;
    });

    setStakedPortfolio(prev => {
        const newStaked = { ...prev };
        const currentStaked = newStaked[asset]?.amount || 0;
        const currentRewards = newStaked[asset]?.rewards || 0;
        newStaked[asset] = { amount: currentStaked + amount, rewards: currentRewards };
        return newStaked;
    });
    
    addTransaction({ type: TransactionType.STAKE, asset, amount });
  };
  
  const unstake = (asset: string, amount: number) => {
    setStakedPortfolio(prev => {
        const newStaked = { ...prev };
        const stakedAmount = newStaked[asset]?.amount || 0;
        if (stakedAmount < amount) throw new Error(`Insufficient staked ${asset.toUpperCase()} to unstake.`);
        newStaked[asset].amount = stakedAmount - amount;
        return newStaked;
    });

    setPortfolio(prev => {
        const newPortfolio = { ...prev };
        const balance = newPortfolio[asset] || 0;
        newPortfolio[asset] = balance + amount;
        return newPortfolio;
    });

    addTransaction({ type: TransactionType.UNSTAKE, asset, amount });
  };


  return { portfolio, stakedPortfolio, executeTrade, transactions, stake, unstake };
};

export default usePortfolio;