import React, { useState, useRef, useEffect } from 'react';
import { getAiChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AiChatbotProps {
    onOpenSettings: () => void;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I am the SomTrade AI Trading Assistant. How can I help you today? You can ask me about market trends, specific assets, or general trading knowledge.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setApiKeyError(false);

    try {
        const responseText = await getAiChatbotResponse(messages, input);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
    } catch(e) {
        if (e instanceof Error && (e.message === "GEMINI_API_KEY_MISSING" || e.message === "GEMINI_API_KEY_INVALID")) {
            setApiKeyError(true);
        } else {
            const errorText = e instanceof Error ? e.message : "Sorry, an unknown error occurred. Please try again.";
            const errorMessage: ChatMessage = { role: 'model', text: errorText, isError: true };
            setMessages(prev => [...prev, errorMessage]);
        }
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg z-50 transition-transform transform hover:scale-110"
        aria-label="Open AI Chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[70vh] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Trading Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close chat">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl whitespace-pre-wrap ${
                        msg.role === 'user' 
                            ? 'bg-green-600 text-white' 
                            : msg.isError
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                     <div className="max-w-[80%] p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* API Key Error Banner */}
        {apiKeyError && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-yellow-100 dark:bg-yellow-900/50 text-center text-sm text-yellow-700 dark:text-yellow-300">
                API Key required. 
                <button onClick={onOpenSettings} className="font-bold underline ml-1 hover:text-yellow-600 dark:hover:text-yellow-200">
                    Open Settings
                </button>
            </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2 disabled:bg-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default AiChatbot;