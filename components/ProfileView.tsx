import React, { useState, useMemo } from 'react';
import { Portfolio, MarketInfo, Transaction, OrderType, TransactionType, StakingPortfolio, TradeTransaction, DepositWithdrawTransaction, StakingTransaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getAiPortfolioAnalysis } from '../services/geminiService';

interface ProfileViewProps {
    portfolio: Portfolio;
    stakedPortfolio: StakingPortfolio;
    markets: MarketInfo[];
    totalPortfolioValue: number;
    transactions: Transaction[];
    onOpenSettings: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ProfileCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center text-white text-4xl font-bold mb-4">
            U
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User_Trader</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>UID: 13378008</span>
            <span className="mx-2">|</span>
            <span className="flex items-center">
                KYC: 
                <span className="ml-1.5 text-green-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Verified
                </span>
            </span>
        </div>
    </div>
);

const PortfolioHistoryChart: React.FC<{totalValue: number}> = ({ totalValue }) => {
    const data = useMemo(() => {
        const mockData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // Fluctuate by +/- 10%
            mockData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: totalValue * (1 - (i/30)*0.2) * randomFactor, // Simulate growth over 30 days
            });
        }
        return mockData;
    }, [totalValue]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Portfolio History (30d)</h3>
             <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#6B7280' }} fontSize={12} />
                    <YAxis orientation="right" tick={{ fill: '#6B7280' }} fontSize={12} tickFormatter={(value) => `$${(Number(value)/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                    <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
};


const AssetDistribution: React.FC<{ portfolio: Portfolio; markets: MarketInfo[] }> = ({ portfolio, markets }) => {
    const data = useMemo(() => Object.entries(portfolio)
        .map(([symbol, amount]) => {
            // Fix: Explicitly cast `amount` to a number before multiplication to prevent type errors, as data from localStorage may not be strictly typed.
            const numericAmount = Number(amount);
            if (numericAmount === 0) return null;
            let value;
            if (symbol.toLowerCase() === 'usdt') {
                value = numericAmount;
            } else {
                const market = markets.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
                value = market ? numericAmount * market.current_price : 0;
            }
            return { name: symbol.toUpperCase(), value };
        })
        .filter((item): item is { name: string; value: number } => item !== null && item.value > 0.01)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)), [portfolio, markets]);

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

const TransactionHistoryTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const renderRow = (tx: Transaction) => {
        switch (tx.type) {
            case TransactionType.TRADE:
                const trade = tx as TradeTransaction;
                return (
                    <>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{trade.baseAsset.toUpperCase()}/USDT</td>
                        <td className={`px-6 py-4 font-semibold ${trade.side === OrderType.BUY ? 'text-green-500' : 'text-red-500'}`}>{trade.side}</td>
                        <td className="px-6 py-4">${trade.price.toLocaleString()}</td>
                        <td className="px-6 py-4">{trade.amount.toFixed(4)} {trade.baseAsset.toUpperCase()}</td>
                        <td className="px-6 py-4">${(trade.price * trade.amount).toFixed(2)}</td>
                    </>
                );
            case TransactionType.DEPOSIT:
            case TransactionType.WITHDRAW:
                 const deposit = tx as DepositWithdrawTransaction;
                 return (
                    <>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{deposit.asset.toUpperCase()}</td>
                        <td className={`px-6 py-4 font-semibold ${tx.type === TransactionType.DEPOSIT ? 'text-blue-500' : 'text-yellow-500'}`}>{tx.type}</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">{deposit.amount.toFixed(4)} {deposit.asset.toUpperCase()}</td>
                        <td className="px-6 py-4">{deposit.status}</td>
                    </>
                 );
            case TransactionType.STAKE:
            case TransactionType.UNSTAKE:
            case TransactionType.REWARD:
                const stake = tx as StakingTransaction;
                 return (
                    <>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{stake.asset.toUpperCase()}</td>
                        <td className={`px-6 py-4 font-semibold text-purple-500`}>{tx.type}</td>
                        <td className="px-6 py-4">-</td>
                        <td className="px-6 py-4">{stake.amount.toFixed(4)} {stake.asset.toUpperCase()}</td>
                        <td className="px-6 py-4">Completed</td>
                    </>
                 );
            default:
                return <td colSpan={5}>Unknown transaction type</td>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction History</h3>
            <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Asset/Pair</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status/Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{new Date(tx.timestamp).toLocaleString()}</td>
                                {renderRow(tx)}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && <p className="text-center py-8 text-gray-500">No transaction history found.</p>}
            </div>
        </div>
    );
};

const AiPortfolioAnalysis: React.FC<{ portfolio: Portfolio, markets: MarketInfo[], onOpenSettings: () => void }> = ({ portfolio, markets, onOpenSettings }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const handleAnalysis = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const result = await getAiPortfolioAnalysis(portfolio, markets);
            setAnalysis(result);
        } catch (e) {
            if (e instanceof Error) {
                if (e.message === "GEMINI_API_KEY_MISSING" || e.message === "GEMINI_API_KEY_INVALID") {
                    setError("API_KEY_ERROR");
                } else {
                    setError(e.message);
                }
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderError = () => {
        if (!error) return null;
        if (error === "API_KEY_ERROR") {
            return (
                <div className="text-center text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md mt-2">
                    <p>Your Gemini API key is missing or invalid to get analysis.</p>
                    <button 
                        onClick={onOpenSettings} 
                        className="font-bold underline hover:text-yellow-600 dark:hover:text-yellow-200 mt-1"
                    >
                        Add Key in Settings
                    </button>
                </div>
            );
        }
        return <p className="text-red-500 text-sm mt-2">{error}</p>;
    }


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI Portfolio Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get personalized insights and suggestions on your portfolio allocation from our Gemini-powered AI.</p>
            <button onClick={handleAnalysis} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
            </button>
            {renderError()}
            {analysis && (
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-black bg-opacity-5 dark:bg-opacity-20 p-3 rounded max-h-60 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    )
}

const ProfileView: React.FC<ProfileViewProps> = ({ portfolio, stakedPortfolio, markets, totalPortfolioValue, transactions, onOpenSettings }) => {
    return (
        <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-3 space-y-4">
                <ProfileCard />
                 <AiPortfolioAnalysis portfolio={portfolio} markets={markets} onOpenSettings={onOpenSettings} />
            </div>

            <div className="col-span-12 lg:col-span-9 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PortfolioHistoryChart totalValue={totalPortfolioValue} />
                    <AssetDistribution portfolio={portfolio} markets={markets} />
                </div>
                <TransactionHistoryTable transactions={transactions} />
            </div>
        </div>
    );
};

export default ProfileView;