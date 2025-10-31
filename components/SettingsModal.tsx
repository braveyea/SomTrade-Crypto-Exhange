import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    tradeConfirmations: true,
    marketNews: false,
  });
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('somtrade-api-key') || '';
      setApiKey(savedKey);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveAndClose = () => {
    localStorage.setItem('somtrade-api-key', apiKey);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 text-gray-900 dark:text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 id="settings-title" className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Theme</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => onThemeChange('light')}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                currentTheme === 'light'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                currentTheme === 'dark'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
        
        {/* API Key Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Gemini API Key</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Your API key is stored locally in your browser and is required for AI Insights.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Gemini API Key"
          />
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                    <span>Price Alerts</span>
                    <input type="checkbox" name="priceAlerts" checked={notifications.priceAlerts} onChange={handleNotificationChange} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
                 <label className="flex items-center justify-between cursor-pointer">
                    <span>Trade Confirmations</span>
                    <input type="checkbox" name="tradeConfirmations" checked={notifications.tradeConfirmations} onChange={handleNotificationChange} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
                 <label className="flex items-center justify-between cursor-pointer">
                    <span>Market News</span>
                    <input type="checkbox" name="marketNews" checked={notifications.marketNews} onChange={handleNotificationChange} className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
            </div>
        </div>

        <button
          onClick={handleSaveAndClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;