import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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

export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    let prompt = SYSTEM_PROMPT + '\n\nConversation History:\n';

    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });

    prompt += `\nUser: ${userMessage}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};

export const detectIntent = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const intentPrompt = `Analyze the following user message and determine if the user wants to book a veterinary appointment or just asking a general question.

User message: "${userMessage}"

Respond with ONLY ONE of these intents:
- "appointment_booking" if the user wants to schedule, book, or make an appointment
- "general_qa" if the user is asking a general veterinary question

Intent:`;

    const result = await model.generateContent(intentPrompt);
    const response = await result.response;
    const intent = response.text().trim().toLowerCase();

    if (intent.includes('appointment_booking')) {
      return { intent: 'appointment_booking', confidence: 'high' };
    } else {
      return { intent: 'general_qa', confidence: 'high' };
    }
  } catch (error) {
    console.error('Error detecting intent:', error);
    return { intent: 'general_qa', confidence: 'low' };
  }
};

export const extractAppointmentInfo = async (userMessage, currentData = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

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

    const result = await model.generateContent(extractionPrompt);
    const response = await result.response;
    const text = response.text().trim();

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
  } catch (error) {
    console.error('Error extracting appointment info:', error);
    return currentData;
  }
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
