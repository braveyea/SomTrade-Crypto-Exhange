
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartDataPoint, MarketInfo } from '../types';

interface PriceChartProps {
    data: ChartDataPoint[];
    latestPrice: number;
    marketInfo: MarketInfo;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md border border-gray-200 dark:border-gray-600 shadow-lg">
        <p className="label font-semibold">{`Time: ${label}`}</p>
        <p className="intro">{`Price: $${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, latestPrice, marketInfo }) => {
    const isPositive = marketInfo.price_change_percentage_24h >= 0;

    const tickColor = '#6B7280'; // gray-500, visible on both light and dark
    const gridColor = document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB';

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center space-x-4 mb-2">
                <img src={marketInfo.image} alt={marketInfo.name} className="w-8 h-8"/>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{marketInfo.name} ({marketInfo.symbol.toUpperCase()}/USDT)</h2>
                <span className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    ${latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                </span>
                <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {marketInfo.price_change_percentage_24h.toFixed(2)}%
                </span>
            </div>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" tick={{ fill: tickColor }} stroke={tickColor} />
                        <YAxis 
                          domain={['auto', 'auto']} 
                          tick={{ fill: tickColor }} 
                          stroke={tickColor} 
                          orientation="right" 
                          tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : ''}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke={isPositive ? "#10B981" : "#EF4444"} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceChart;