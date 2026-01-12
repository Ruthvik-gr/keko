import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const HARDCODED_CONFIG = {
  userId: 'user_001',
  userName: 'Ruthvik',
  petName: 'Buddy',
  source: 'vet-chatbot-sdk'
};

let chatbotRoot = null;

function initVetChatbot(options = {}) {
  const config = options.context || window.VetChatbotConfig || HARDCODED_CONFIG;

  if (options.apiUrl) {
    window.VetChatbotApiUrl = options.apiUrl;
  }

  let container = document.getElementById('vet-chatbot-root');

  if (!container) {
    container = document.createElement('div');
    container.id = 'vet-chatbot-root';
    document.body.appendChild(container);
  }

  if (!chatbotRoot) {
    chatbotRoot = ReactDOM.createRoot(container);
  }

  chatbotRoot.render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>
  );
}

function destroyVetChatbot() {
  const container = document.getElementById('vet-chatbot-root');
  if (container && chatbotRoot) {
    chatbotRoot.unmount();
    chatbotRoot = null;
    container.remove();
  }
}

window.VetChatbot = {
  init: initVetChatbot,
  destroy: destroyVetChatbot
};

window.initVetChatbot = initVetChatbot;
