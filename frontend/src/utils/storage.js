const STORAGE_KEY = 'vet_chatbot_session';

export const saveSessionId = (sessionId) => {
  try {
    localStorage.setItem(STORAGE_KEY, sessionId);
  } catch (error) {
    console.error('Error saving session ID:', error);
  }
};

export const getSessionId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error getting session ID:', error);
    return null;
  }
};

export const clearSessionId = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session ID:', error);
  }
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default {
  saveSessionId,
  getSessionId,
  clearSessionId,
  generateUUID,
};
