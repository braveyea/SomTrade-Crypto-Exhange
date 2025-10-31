
import React, { useState } from 'react';
import { Portfolio, StakingPortfolio, MarketInfo } from '../types';
import { MOCK_STAKING_POOLS } from '../constants';

interface EarnViewProps {
    portfolio: Portfolio;
    stakedPortfolio: StakingPortfolio;
    markets: MarketInfo[];
    onStake: (asset: string, amount: number) => void;
    onUnstake: (asset: string, amount: number) => void;
}

interface StakeModalProps {
    assetSymbol: string;
    action: 'stake' | 'unstake';
    onClose: () => void;
    onSubmit: (amount: number) => void;
    maxAmount: number;
}

const StakeModal: React.FC<StakeModalProps> = ({ assetSymbol, action, onClose, onSubmit, maxAmount }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        if (numAmount > maxAmount) {
            alert("Amount exceeds available balance.");
            return;
        }
        onSubmit(numAmount);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
                <h2 className="text-xl font-bold capitalize mb-4">{action} {assetSymbol.toUpperCase()}</h2>
                <div className="relative mb-4">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Amount</label>
                     <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="absolute right-3 top-7 text-xs text-gray-500 dark:text-gray-400">
                        <span>Avbl: {maxAmount.toFixed(4)}</span>
                        <button onClick={() => setAmount(maxAmount.toString())} className="ml-2 font-semibold text-green-500">MAX</button>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white capitalize">{action}</button>
                </div>
            </div>
        </div>
    );
};


const EarnView: React.FC<EarnViewProps> = ({ portfolio, stakedPortfolio, markets, onStake, onUnstake }) => {
    const [modalState, setModalState] = useState<{ isOpen: boolean; asset?: string; action?: 'stake' | 'unstake' }>({ isOpen: false });

    const openModal = (asset: string, action: 'stake' | 'unstake') => {
        setModalState({ isOpen: true, asset, action });
    };

    const closeModal = () => {
        setModalState({ isOpen: false });
    };

    const handleSubmit = (amount: number) => {
        if (modalState.asset && modalState.action) {
            if (modalState.action === 'stake') {
                onStake(modalState.asset, amount);
            } else {
                onUnstake(modalState.asset, amount);
            }
        }
    };
    
    return (
        <div className="max-w-screen-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earn Passive Income</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Stake your crypto assets to earn rewards.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Available Staking Pools</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_STAKING_POOLS.map(pool => {
                        const stakedInfo = stakedPortfolio[pool.symbol];
                        const walletBalance = portfolio[pool.symbol] || 0;

                        return (
                            <div key={pool.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <img src={pool.image} alt={pool.asset} className="w-8 h-8 mr-3 rounded-full" />
                                        <span className="text-lg font-bold">{pool.asset}</span>
                                    </div>
                                    <p className="text-3xl font-bold text-green-500">{pool.apy.toFixed(2)}% <span className="text-lg text-gray-500 dark:text-gray-400">Est. APY</span></p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lock-up: {pool.lockupPeriod > 0 ? `${pool.lockupPeriod} Days` : 'Flexible'}</p>
                                </div>
                                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <p>Wallet Balance: {walletBalance.toFixed(4)} {pool.symbol.toUpperCase()}</p>
                                        <p>Staked: {(stakedInfo?.amount || 0).toFixed(4)} {pool.symbol.toUpperCase()}</p>
                                    </div>
                                    <div className="flex space-x-2 mt-3">
                                        <button onClick={() => openModal(pool.symbol, 'stake')} className="w-full py-2 px-3 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">Stake</button>
                                        <button onClick={() => openModal(pool.symbol, 'unstake')} className="w-full py-2 px-3 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold">Unstake</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {modalState.isOpen && modalState.asset && modalState.action && (
                <StakeModal 
                    assetSymbol={modalState.asset}
                    action={modalState.action}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    maxAmount={modalState.action === 'stake' ? (portfolio[modalState.asset] || 0) : (stakedPortfolio[modalState.asset]?.amount || 0)}
                />
            )}
        </div>
    );
};

export default EarnView;
