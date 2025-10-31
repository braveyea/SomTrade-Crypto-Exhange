
import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  onLogout: () => void;
  totalPortfolioValue: number;
  activeView: 'trade' | 'markets' | 'profile';
  onNavigate: (view: 'trade' | 'markets' | 'profile') => void;
}

const NavLink: React.FC<{ children: React.ReactNode; isActive?: boolean; onClick?: () => void; disabled?: boolean; }> = ({ children, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onLogout, totalPortfolioValue, activeView, onNavigate }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-auto text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z" />
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white ml-2">GeminiEX</span>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <NavLink isActive={activeView === 'trade'} onClick={() => onNavigate('trade')}>Trade</NavLink>
                <NavLink isActive={activeView === 'markets'} onClick={() => onNavigate('markets')}>Markets</NavLink>
                <NavLink isActive={activeView === 'profile'} onClick={() => onNavigate('profile')}>Profile</NavLink>
                <NavLink disabled>API</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block mr-4 text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Balance ≈</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">USDT</span>
                </div>
            </div>
             <button
                onClick={onSettingsClick}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="Open settings"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </button>
             <button 
                onClick={onLogout}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
              >
                Log Out
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
