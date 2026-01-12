const getApiUrl = () => window.VetChatbotApiUrl || 'http://localhost:5000/api';

export const sendMessage = async (message, sessionId, context = null) => {
  try {
    const response = await fetch(`${getApiUrl()}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        context,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const createAppointment = async (sessionId, appointmentDetails) => {
  try {
    const response = await fetch(`${getApiUrl()}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        appointmentDetails,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getConversation = async (sessionId) => {
  try {
    const response = await fetch(`${getApiUrl()}/conversations/${sessionId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export default {
  sendMessage,
  createAppointment,
  getConversation,
};
