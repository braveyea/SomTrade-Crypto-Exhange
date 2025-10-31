
import { StakingPool, LeaderboardUser } from './types';

export const INITIAL_COIN_IDS: string[] = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'ripple'];
export const DEFAULT_COIN_ID: string = 'bitcoin';

export const MOCK_STAKING_POOLS: StakingPool[] = [
    {
        id: 'eth-stake',
        asset: 'Ethereum',
        symbol: 'eth',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        apy: 4.5,
        lockupPeriod: 0, // Flexible
        totalStaked: 1250000,
    },
    {
        id: 'sol-stake',
        asset: 'Solana',
        symbol: 'sol',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        apy: 7.2,
        lockupPeriod: 3,
        totalStaked: 5800000,
    },
    {
        id: 'usdt-stake',
        asset: 'Tether',
        symbol: 'usdt',
        image: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
        apy: 8.0,
        lockupPeriod: 30,
        totalStaked: 150000000,
    },
    {
        id: 'xrp-stake',
        asset: 'XRP',
        symbol: 'xrp',
        image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        apy: 3.1,
        lockupPeriod: 15,
        totalStaked: 25000000,
    }
];


export const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: 'CryptoKing', avatar: '👑', dailyPnl: 15.78, monthlyPnl: 120.4, totalVolume: 12500000 },
    { rank: 2, name: 'SatoshiJr', avatar: '😎', dailyPnl: 12.11, monthlyPnl: 98.2, totalVolume: 9800000 },
    { rank: 3, name: 'LamboDreams', avatar: '🚀', dailyPnl: 9.89, monthlyPnl: 215.1, totalVolume: 8500000 },
    { rank: 4, name: 'AdaLover', avatar: '❤️', dailyPnl: 8.54, monthlyPnl: 65.7, totalVolume: 11200000 },
    { rank: 5, name: 'WhaleWatcher', avatar: '🐳', dailyPnl: 5.23, monthlyPnl: 45.3, totalVolume: 18300000 },
    { rank: 6, name: 'ShibaInuMillionaire', avatar: '🐕', dailyPnl: 2.15, monthlyPnl: 350.5, totalVolume: 7600000 },
    { rank: 7, name: 'ETHGod', avatar: '♦️', dailyPnl: -1.2, monthlyPnl: 88.9, totalVolume: 15100000 },
    { rank: 8, name: 'DeFiDegenerate', avatar: '👨‍🌾', dailyPnl: -3.4, monthlyPnl: 18.2, totalVolume: 6400000 },
];
