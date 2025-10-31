
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TradingView from './components/TradingView';
import MarketsView from './components/MarketsView';
import ProfileView from './components/ProfileView';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import EarnView from './components/EarnView';
import CommunityView from './components/CommunityView';
import SecurityView from './components/SecurityView';
import AiChatbot from './components/AiChatbot';
import { DEFAULT_COIN_ID, INITIAL_COIN_IDS } from './constants';
import { MarketInfo } from './types';
import { fetchMarkets } from './services/coingeckoService';
import usePortfolio from './hooks/usePortfolio';

export type AppView = 'trade' | 'markets' | 'profile' | 'earn' | 'community' | 'security';

const App: React.FC = () => {
  const { portfolio, executeTrade, transactions, stake, unstake, stakedPortfolio } = usePortfolio();
  const [selectedCoinId, setSelectedCoinId] = useState<string>(DEFAULT_COIN_ID);
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('userToken'));
  const [activeView, setActiveView] = useState<AppView>('trade');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const getMarkets = async () => {
      try {
        const marketData = await fetchMarkets(INITIAL_COIN_IDS);
        setMarkets(marketData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data. Prices may be stale.');
        console.error(err);
      }
    };

    getMarkets();
    const interval = setInterval(getMarkets, 45000); // Refresh market list every 45 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    localStorage.setItem('userToken', 'mock-token-for-demo');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    // Clear all persisted data on logout for a clean slate
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('gemini-ex-')) {
            localStorage.removeItem(key);
        }
    });
    setIsAuthenticated(false);
    setActiveView('trade');
  };

  const handleNavigateToTrade = (coinId: string) => {
    setSelectedCoinId(coinId);
    setActiveView('trade');
  }

  const totalPortfolioValue = useMemo(() => {
    if (!markets.length) {
        // Fix: Explicitly type accumulator and value in reduce to prevent 'unknown' type error.
        return Object.values(portfolio).reduce((acc: number, val: number) => acc + val, 0);
    }

    const liquidValue = Object.keys(portfolio).reduce((acc, assetSymbol) => {
        if (assetSymbol.toLowerCase() === 'usdt') {
            return acc + (portfolio.usdt || 0);
        }
        const market = markets.find(m => m.symbol.toLowerCase() === assetSymbol.toLowerCase());
        if (market) {
            return acc + ((portfolio[assetSymbol] || 0) * market.current_price);
        }
        return acc;
    }, 0);

    const stakedValue = Object.keys(stakedPortfolio).reduce((acc, assetSymbol) => {
        const market = markets.find(m => m.symbol.toLowerCase() === assetSymbol.toLowerCase());
        if(market) {
            const totalStakedAmount = (stakedPortfolio[assetSymbol]?.amount || 0) + (stakedPortfolio[assetSymbol]?.rewards || 0);
            return acc + (totalStakedAmount * market.current_price);
        }
        return acc;
    }, 0);

    return liquidValue + stakedValue;
}, [portfolio, stakedPortfolio, markets]);

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'trade':
        return (
          <TradingView
            markets={markets}
            selectedCoinId={selectedCoinId}
            setSelectedCoinId={setSelectedCoinId}
            portfolio={portfolio}
            executeTrade={executeTrade}
          />
        );
      case 'markets':
        return <MarketsView onNavigateToTrade={handleNavigateToTrade} />;
      case 'profile':
        return <ProfileView 
                  portfolio={portfolio}
                  stakedPortfolio={stakedPortfolio}
                  markets={markets}
                  totalPortfolioValue={totalPortfolioValue}
                  transactions={transactions}
                />;
      case 'earn':
        return <EarnView 
                  portfolio={portfolio} 
                  stakedPortfolio={stakedPortfolio} 
                  markets={markets}
                  onStake={stake}
                  onUnstake={unstake}
                />;
      case 'community':
        return <CommunityView />;
      case 'security':
        return <SecurityView />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onLogout={handleLogout} 
        totalPortfolioValue={totalPortfolioValue}
        activeView={activeView}
        onNavigate={setActiveView}
      />
      <main className="p-2 sm:p-4">
        {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900 p-2 rounded-md mb-4">{error}</div>}
        {renderActiveView()}
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      <AiChatbot />
    </div>
  );
};

export default App;
