
import React from 'react';
import { Portfolio, MarketInfo, Trade, OrderType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProfileViewProps {
    portfolio: Portfolio;
    markets: MarketInfo[];
    totalPortfolioValue: number;
    tradeHistory: Trade[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ProfileCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
            U
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User_Trader</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">UID: 13378008</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Joined: 2024-01-01</p>
    </div>
);

const Achievements: React.FC<{ portfolio: Portfolio; tradeHistory: Trade[] }> = ({ portfolio, tradeHistory }) => {
    const achievements = [
        { name: 'First Trade', earned: tradeHistory.length > 0, icon: '🥇' },
        { name: 'Diversified', earned: Object.keys(portfolio).length > 3, icon: '🎨' },
        { name: 'Bitcoin Hodler', earned: (portfolio.btc || 0) > 0, icon: '₿' },
        { name: 'Ethereum Enthusiast', earned: (portfolio.eth || 0) > 0, icon: '♦️' },
        { name: 'Whale Watcher', earned: tradeHistory.some(t => t.price * t.amount > 10000), icon: '🐳' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Achievements</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                {achievements.map(ach => (
                    <div key={ach.name} className={`p-2 rounded-lg ${ach.earned ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700 opacity-50'}`}>
                        <div className="text-3xl">{ach.icon}</div>
                        <p className={`text-xs mt-1 font-medium ${ach.earned ? 'text-green-800 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>{ach.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PortfolioOverview: React.FC<{ totalValue: number }> = ({ totalValue }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Portfolio Value</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-green-500 mt-1">+2.5% (24h)</p>
    </div>
);

const AssetDistribution: React.FC<{ portfolio: Portfolio; markets: MarketInfo[] }> = ({ portfolio, markets }) => {
    const data = Object.entries(portfolio)
        .map(([symbol, amount]) => {
            if (amount === 0) return null;
            let value;
            if (symbol.toLowerCase() === 'usdt') {
                value = amount;
            } else {
                const market = markets.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
                value = market ? amount * market.current_price : 0;
            }
            return { name: symbol.toUpperCase(), value };
        })
        .filter(item => item && item.value > 0.01)
        // FIX: Replaced subtraction-based sort with a comparison-based one to avoid TypeScript arithmetic operation errors.
        .sort((a, b) => {
            const valueA = a?.value ?? 0;
            const valueB = b?.value ?? 0;
            if (valueA < valueB) {
                return 1;
            }
            if (valueA > valueB) {
                return -1;
            }
            return 0;
        });

    if (!data || data.length === 0) {
        return <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">No assets to display.</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Asset Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const TradeHistoryTable: React.FC<{ trades: Trade[] }> = ({ trades }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Trade History</h3>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Pair</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade => (
                        <tr key={trade.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{new Date(trade.timestamp).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{trade.symbol}/USDT</td>
                            <td className={`px-6 py-4 font-semibold ${trade.type === OrderType.BUY ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                            <td className="px-6 py-4">${trade.price.toLocaleString()}</td>
                            <td className="px-6 py-4">{trade.amount.toFixed(4)} {trade.symbol}</td>
                            <td className="px-6 py-4">${(trade.price * trade.amount).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {trades.length === 0 && <p className="text-center py-8 text-gray-500">No trade history found.</p>}
        </div>
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ portfolio, markets, totalPortfolioValue, tradeHistory }) => {
    return (
        <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-4">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
                <ProfileCard />
                <Achievements portfolio={portfolio} tradeHistory={tradeHistory} />
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-9 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PortfolioOverview totalValue={totalPortfolioValue} />
                    <AssetDistribution portfolio={portfolio} markets={markets} />
                </div>
                <TradeHistoryTable trades={tradeHistory} />
            </div>
        </div>
    );
};

export default ProfileView;
