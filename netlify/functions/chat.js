const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Default business info - customize per website
const DEFAULT_BUSINESS_INFO = `
You are a helpful, friendly AI assistant for a business website.

Your role:
- Answer questions about services, pricing, hours, and location
- Help customers book appointments or get in touch
- Be concise, warm, and professional
- Keep responses under 3 sentences when possible
- Use emojis sparingly to keep it friendly but not over-the-top

If you don't know specific business details (hours, pricing, address),
politely suggest the customer call or visit the website for accurate info.

Always be helpful and never make up facts about the business.
`;

const TONE_INSTRUCTIONS = {
  friendly:     'Be warm, casual, and use occasional emojis.',
  professional: 'Be polished, courteous, and avoid emojis.',
  casual:       'Be relaxed and conversational, like chatting with a friend.',
  witty:        'Be clever and add light humor when appropriate.'
};

export async function handler(event) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get API key from environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not found in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: '⚠️ Bot configuration error. Please contact the website owner.',
        error: 'API key not configured'
      })
    };
  }

  try {

    // Parse incoming request
    const { message, conversation = [], config = {} } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: 'Please provide a message.' })
      };
    }

    // Build system prompt
    const businessInfo = config.businessInfo || DEFAULT_BUSINESS_INFO;
    const toneInstruction = TONE_INSTRUCTIONS[config.tone] || 'Be friendly and helpful.';

    // Format conversation history for Gemini
    const history = conversation.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Build full message thread with system context
    const fullMessages = [
      { role: 'user',  parts: [{ text: `${businessInfo}\n\n${toneInstruction}` }] },
      { role: 'model', parts: [{ text: "Got it! I'm ready to help customers with their questions." }] },
      ...history,
      { role: 'user',  parts: [{ text: message }] }
    ];

    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: fullMessages,
        generationConfig: {
          maxOutputTokens: 256,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response.';

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply.trim(), success: true })
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "⚠️ Sorry, I'm having trouble right now. Please try again in a moment!",
        error: error.message
      })
    };
  }
}
