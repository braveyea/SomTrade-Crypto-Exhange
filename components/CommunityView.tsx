
import React, { useState, useMemo } from 'react';
import { MOCK_LEADERBOARD } from '../constants';

type LeaderboardTab = 'Daily PnL' | 'Monthly PnL' | 'Volume';

const CommunityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('Daily PnL');
  
  const sortedLeaderboard = useMemo(() => {
    const data = [...MOCK_LEADERBOARD];
    switch (activeTab) {
      case 'Monthly PnL':
        return data.sort((a, b) => b.monthlyPnl - a.monthlyPnl);
      case 'Volume':
        return data.sort((a, b) => b.totalVolume - a.totalVolume);
      case 'Daily PnL':
      default:
        return data.sort((a, b) => b.dailyPnl - a.dailyPnl);
    }
  }, [activeTab]);

  return (
    <div className="max-w-screen-2xl mx-auto space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Leaderboard</h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-2">See how you stack up against the top traders on GeminiEX.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                {(['Daily PnL', 'Monthly PnL', 'Volume'] as LeaderboardTab[]).map(tab => (
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
                            <th scope="col" className="p-4">Rank</th>
                            <th scope="col" className="p-4">Trader</th>
                            <th scope="col" className="p-4">Daily PnL (%)</th>
                            <th scope="col" className="p-4 hidden sm:table-cell">Monthly PnL (%)</th>
                            <th scope="col" className="p-4 hidden md:table-cell">Total Volume (USDT)</th>
                            <th scope="col" className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLeaderboard.map(user => (
                            <tr key={user.rank} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                <td className="p-4 font-bold text-lg text-gray-900 dark:text-white">{user.rank}</td>
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{user.avatar}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className={`p-4 font-semibold ${user.dailyPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{user.dailyPnl.toFixed(2)}%</td>
                                <td className={`p-4 font-semibold hidden sm:table-cell ${user.monthlyPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{user.monthlyPnl.toFixed(2)}%</td>
                                <td className="p-4 hidden md:table-cell">${user.totalVolume.toLocaleString()}</td>
                                <td className="p-4">
                                    <button onClick={() => alert(`Following ${user.name}! (Copy Trading Mock)`)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded-md text-xs transition-colors">
                                        Copy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default CommunityView;
