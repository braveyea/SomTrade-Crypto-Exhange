
import { GoogleGenAI } from "@google/genai";
import { Portfolio, MarketInfo, ChatMessage } from '../types';

const getGeminiClient = () => {
  const apiKey = localStorage.getItem('gemini-api-key');
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const getGeminiInsights = async (coinName: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Provide a concise, expert overview for a crypto trader about ${coinName}. Cover these key points in bullet points:
- Core Purpose: What is its main function or use case?
- Key Differentiator: What makes it unique compared to competitors?
- Recent Performance Quick-Look: Briefly mention its recent price trend (e.g., bullish, bearish, consolidating).
- Potential Catalysts: What are 1-2 upcoming events or factors that could impact its price?

Keep the entire response under 150 words.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching insights from Gemini API:", error);
    if (error instanceof Error) {
        if (error.message === "GEMINI_API_KEY_MISSING") {
             throw new Error("GEMINI_API_KEY_MISSING");
        }
        if (error.message.includes('API key not valid') || error.message.includes('permission')) {
             throw new Error("GEMINI_API_KEY_INVALID");
        }
        throw error;
    }
    throw new Error("Failed to communicate with the Gemini API.");
  }
};

export const getAiPortfolioAnalysis = async (portfolio: Portfolio, markets: MarketInfo[]): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    const portfolioDetails = Object.entries(portfolio)
      .map(([symbol, amount]) => {
        const market = markets.find(m => m.symbol.toLowerCase() === symbol.toLowerCase());
        const value = market ? (amount * market.current_price) : (symbol.toLowerCase() === 'usdt' ? amount : 0);
        return { symbol: symbol.toUpperCase(), amount, value };
      })
      .filter(p => p.value > 0)
      .sort((a,b) => b.value - a.value)
      .map(p => `- ${p.symbol}: ${p.amount.toFixed(4)} (Value: $${p.value.toFixed(2)})`)
      .join('\n');

    const prompt = `As a professional crypto portfolio advisor, analyze the following portfolio. 
Provide a concise analysis covering:
1.  **Overall Allocation:** Comment on the diversification and risk profile (e.g., heavily weighted in volatile assets, well-diversified, etc.).
2.  **Top Holdings:** Briefly comment on the top 2 holdings.
3.  **Actionable Suggestion:** Provide one clear, actionable suggestion for improvement (e.g., consider taking profits, rebalancing, or exploring a new sector).

Keep the entire response professional, insightful, and under 200 words.

**Portfolio:**
${portfolioDetails}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text;

  } catch (error) {
     console.error("Error fetching portfolio analysis from Gemini API:", error);
    if (error instanceof Error) {
        if (error.message === "GEMINI_API_KEY_MISSING") {
             throw new Error("GEMINI_API_KEY_MISSING");
        }
        if (error.message.includes('API key not valid') || error.message.includes('permission')) {
             throw new Error("GEMINI_API_KEY_INVALID");
        }
        throw error;
    }
    throw new Error("Failed to communicate with the Gemini API.");
  }
};


export const getAiChatbotResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = getGeminiClient();

        const formattedHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        
        const systemInstruction = "You are GeminiEX's AI Trading Assistant, a helpful and knowledgeable expert on cryptocurrency, trading, and blockchain technology. Your tone is professional, encouraging, and clear. You are not a financial advisor and must not give direct financial advice. Instead of giving advice, provide factual information, explanations of concepts, and analysis of market data. Start your first response by introducing yourself.";

        const contents = [...formattedHistory, { role: 'user', parts: [{ text: newMessage }] }];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: { systemInstruction }
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching chatbot response from Gemini API:", error);
        if (error instanceof Error) {
            if (error.message === "GEMINI_API_KEY_MISSING") {
                throw new Error("GEMINI_API_KEY_MISSING");
            }
            if (error.message.includes('API key not valid') || error.message.includes('permission')) {
                throw new Error("GEMINI_API_KEY_INVALID");
            }
            throw new Error(`Error: ${error.message}`);
        }
        throw new Error("Sorry, I'm having trouble connecting to my brain right now. Please try again later.");
    }
}
