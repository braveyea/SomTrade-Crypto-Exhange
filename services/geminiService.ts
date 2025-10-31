
import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    // In a real app, you might want to handle different error types
    // (e.g., API key issues, network errors) more gracefully.
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
