import React, { useEffect, useState } from 'react';
import { fetchAllMarketData } from '../services/coingeckoService';
import { MarketInfo } from '../types';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const MarketTicker: React.FC = () => {
    const [markets, setMarkets] = useState<MarketInfo[]>([]);

    useEffect(() => {
        const getMarkets = async () => {
            try {
                const marketData = await fetchAllMarketData(10);
                setMarkets(marketData);
            } catch (err) {
                console.error("Failed to fetch markets for ticker:", err);
            }
        };
        getMarkets();
    }, []);

    if (markets.length === 0) {
        return <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 py-2 border-y border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {markets.concat(markets).map((market, index) => {
                    const isPositive = market.price_change_percentage_24h >= 0;
                    return (
                        <div key={index} className="mx-6 flex items-center space-x-2 text-sm">
                            <img src={market.image} alt={market.name} className="w-5 h-5" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{market.symbol.toUpperCase()}</span>
                            <span className="font-mono text-gray-700 dark:text-gray-300">${market.current_price.toLocaleString()}</span>
                            <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                                {isPositive ? '▲' : '▼'} {market.price_change_percentage_24h.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
             <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform">
        <div className="flex justify-center items-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-auto text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z" />
            </svg>
            <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">SomTrade</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onLoginClick} className="font-semibold text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors">
              Log In
            </button>
            <button onClick={onSignupClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Sign Up
            </button>
          </div>
        </nav>
      </header>
      
      {/* Hero Section */}
      <main>
        <section className="bg-white dark:bg-gray-800 text-center py-20 md:py-32">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              The Future of Crypto Trading is Here.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Experience a faster, smarter, and more secure way to trade digital assets. Join thousands of users on SomTrade and unlock your trading potential.
            </p>
            <button onClick={onSignupClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105">
              Get Started for Free
            </button>
          </div>
        </section>

        <MarketTicker />

        {/* Features Section */}
        <section className="py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose SomTrade?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
                        title="Advanced Trading"
                        description="Utilize our full suite of advanced order types, real-time charts, and powerful analytics to execute your strategy."
                    />
                    <FeatureCard
                        icon={<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.986-2.386l-.548-.547z"></path></svg>}
                        title="AI-Powered Insights"
                        description="Leverage our integrated Gemini AI assistant for market analysis, portfolio suggestions, and trading education."
                    />
                    <FeatureCard
                        icon={<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                        title="Earn Passive Income"
                        description="Stake your idle assets in our secure 'Earn' pools and watch your portfolio grow with competitive APY."
                    />
                    <FeatureCard
                        icon={<svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
                        title="Top-Tier Security"
                        description="Your assets are protected with industry-leading security protocols, 2FA, and cold storage solutions."
                    />
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} SomTrade. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;