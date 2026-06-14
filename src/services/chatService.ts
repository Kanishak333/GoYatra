export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export async function sendChatMessage(history: ChatMessage[], newMessage: string): Promise<string> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  
  // Format history for Gemini API. Gemini requires conversation to start with user.
  const contents = history
    .filter(msg => msg.id !== '1') // Remove initial greeting
    .filter(msg => msg.role === 'user' || msg.role === 'model')
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
  
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  const payload = {
    systemInstruction: {
      parts: [{ text: "You are Saathi, an expert AI travel assistant for GoYatra. You help users plan squad trips, forecast flight prices, suggest destinations, and calculate trip splits. Keep your responses friendly, professional, and concise. Use emojis occasionally." }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to my servers right now. Please check your connection and try again!";
  }
}
