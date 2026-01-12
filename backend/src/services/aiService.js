import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

let genAI = null;
let groq = null;
let initialized = false;

const initClients = () => {
  if (initialized) return;

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  console.log('Initializing AI clients...');
  console.log('Gemini API Key:', geminiApiKey ? 'Present' : 'Missing');
  console.log('Groq API Key:', groqApiKey ? 'Present' : 'Missing');

  if (geminiApiKey) {
    genAI = new GoogleGenerativeAI(geminiApiKey);
    console.log('Gemini client initialized');
  }

  if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
    console.log('Groq client initialized');
  }

  initialized = true;
};

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];

const SYSTEM_PROMPT = `You are a helpful veterinary assistant chatbot. Your role is to:

1. Answer ONLY veterinary-related questions about:
   - Pet care and wellness
   - Vaccination schedules
   - Diet and nutrition for pets
   - Common pet illnesses and symptoms
   - Preventive care for pets
   - General pet health advice

2. IMPORTANT: If a user asks a non-veterinary question, politely respond that you can only answer veterinary-related questions.

3. ALWAYS remind users that for serious health concerns, they should consult a licensed veterinarian in person.

4. Be conversational, friendly, and empathetic.

5. Keep responses concise (2-4 sentences) unless more detail is needed.

6. If a user wants to book an appointment, you will help collect their information.`;

const buildPrompt = (userMessage, conversationHistory = []) => {
  let prompt = SYSTEM_PROMPT + '\n\nConversation History:\n';
  const recentHistory = conversationHistory.slice(-10);
  recentHistory.forEach(msg => {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  });
  prompt += `\nUser: ${userMessage}\nAssistant:`;
  return prompt;
};

const generateWithGemini = async (prompt, modelName) => {
  if (!genAI) throw new Error('Gemini not configured');

  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};

const generateWithGroq = async (userMessage, conversationHistory = []) => {
  if (!groq) throw new Error('Groq not configured');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  const recentHistory = conversationHistory.slice(-10);
  recentHistory.forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  });

  messages.push({ role: 'user', content: userMessage });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0].message.content.trim();
};

export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  initClients();
  const errors = [];

  // Try Gemini first
  if (genAI) {
    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`Trying Gemini model: ${modelName}`);
        const prompt = buildPrompt(userMessage, conversationHistory);
        const response = await generateWithGemini(prompt, modelName);
        console.log(`Success with Gemini model: ${modelName}`);
        return response;
      } catch (error) {
        console.log(`Gemini ${modelName} failed: ${error.message}`);
        errors.push(`Gemini(${modelName}): ${error.message}`);
      }
    }
  }

  // Fallback to Groq
  if (groq) {
    try {
      console.log('Falling back to Groq...');
      const response = await generateWithGroq(userMessage, conversationHistory);
      console.log('Success with Groq');
      return response;
    } catch (error) {
      console.log(`Groq failed: ${error.message}`);
      errors.push(`Groq: ${error.message}`);
    }
  }

  console.error('All AI providers failed:', errors);
  throw new Error('All AI providers are unavailable. Please try again later.');
};

export const detectIntent = async (userMessage) => {
  initClients();

  const intentPrompt = `Analyze the following user message and determine if the user wants to book a veterinary appointment or just asking a general question.

User message: "${userMessage}"

Respond with ONLY ONE of these intents:
- "appointment_booking" if the user wants to schedule, book, or make an appointment
- "general_qa" if the user is asking a general veterinary question

Intent:`;

  // Try Gemini first
  if (genAI) {
    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`Intent detection trying Gemini ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(intentPrompt);
        const response = await result.response;
        const intent = response.text().trim().toLowerCase();

        if (intent.includes('appointment_booking')) {
          return { intent: 'appointment_booking', confidence: 'high' };
        }
        return { intent: 'general_qa', confidence: 'high' };
      } catch (error) {
        console.log(`Intent detection with Gemini ${modelName} failed:`, error.message);
      }
    }
  }

  // Fallback to Groq
  if (groq) {
    try {
      console.log('Intent detection falling back to Groq...');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: intentPrompt }],
        max_tokens: 50,
      });
      const intent = completion.choices[0].message.content.trim().toLowerCase();
      if (intent.includes('appointment_booking')) {
        return { intent: 'appointment_booking', confidence: 'high' };
      }
      return { intent: 'general_qa', confidence: 'high' };
    } catch (error) {
      console.log('Intent detection with Groq failed:', error.message);
    }
  }

  // Default fallback
  return { intent: 'general_qa', confidence: 'low' };
};

export const extractAppointmentInfo = async (userMessage, currentData = {}) => {
  initClients();

  const extractionPrompt = `Extract appointment information from the user's message.

Current data we have: ${JSON.stringify(currentData, null, 2)}

User message: "${userMessage}"

Extract and return ONLY the following fields in JSON format (return null for missing fields):
{
  "ownerName": "string or null",
  "petName": "string or null",
  "phoneNumber": "string or null",
  "preferredDate": "YYYY-MM-DD format or null",
  "preferredTime": "HH:MM AM/PM format or null",
  "notes": "string or null"
}

JSON:`;

  const parseExtractedData = (text) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = JSON.parse(jsonMatch[0]);
      return {
        ownerName: extracted.ownerName || currentData.ownerName || null,
        petName: extracted.petName || currentData.petName || null,
        phoneNumber: extracted.phoneNumber || currentData.phoneNumber || null,
        preferredDate: extracted.preferredDate || currentData.preferredDate || null,
        preferredTime: extracted.preferredTime || currentData.preferredTime || null,
        notes: extracted.notes || currentData.notes || null,
      };
    }
    return currentData;
  };

  // Try Gemini first
  if (genAI) {
    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`Extraction trying Gemini ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(extractionPrompt);
        const response = await result.response;
        return parseExtractedData(response.text().trim());
      } catch (error) {
        console.log(`Extraction with Gemini ${modelName} failed:`, error.message);
      }
    }
  }

  // Fallback to Groq
  if (groq) {
    try {
      console.log('Extraction falling back to Groq...');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: extractionPrompt }],
        max_tokens: 200,
      });
      return parseExtractedData(completion.choices[0].message.content.trim());
    } catch (error) {
      console.log('Extraction with Groq failed:', error.message);
    }
  }

  return currentData;
};

export const generateBookingPrompt = (appointmentData) => {
  const missing = [];

  if (!appointmentData.ownerName) missing.push('your name');
  if (!appointmentData.petName) missing.push("your pet's name");
  if (!appointmentData.phoneNumber) missing.push('your phone number');
  if (!appointmentData.preferredDate) missing.push('preferred date');
  if (!appointmentData.preferredTime) missing.push('preferred time');

  if (missing.length === 0) {
    return null;
  }

  const nextField = missing[0];

  const prompts = {
    'your name': "Great! I'd be happy to help you book an appointment. May I have your name, please?",
    "your pet's name": "Thank you! What is your pet's name?",
    'your phone number': "Perfect! What's the best phone number to reach you?",
    'preferred date': "Wonderful! What date would you prefer for the appointment? (Please provide in YYYY-MM-DD format, e.g., 2026-01-15)",
    'preferred time': "Great! What time works best for you? (e.g., 2:00 PM or 14:00)",
  };

  return prompts[nextField] || `Please provide ${nextField}.`;
};

export default {
  generateAIResponse,
  detectIntent,
  extractAppointmentInfo,
  generateBookingPrompt,
};
