import React, { useState, useCallback } from 'react';
import { getGeminiInsights } from '../services/geminiService';

interface GeminiInfoPanelProps {
  coinName: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 dark:border-green-400"></div>
    </div>
);

const GeminiInfoPanel: React.FC<GeminiInfoPanelProps> = ({ coinName }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setInsights('');
    try {
      const result = await getGeminiInsights(coinName);
      setInsights(result);
    } catch (err) {
      setError('Failed to fetch insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [coinName]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500 dark:text-green-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        AI Coin Insights
      </h3>
      <button
        onClick={fetchInsights}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        {isLoading ? 'Analyzing...' : `Get Insights on ${coinName}`}
      </button>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {insights && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-black bg-opacity-5 dark:bg-opacity-20 p-3 rounded max-h-60 overflow-y-auto">
          <p className="whitespace-pre-wrap">{insights}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiInfoPanel;