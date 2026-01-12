# Veterinary Chatbot SDK

A MERN stack chatbot SDK for veterinary clinics with AI-powered responses using Google Gemini API.

## Features

- AI-powered veterinary Q&A using Google Gemini
- Appointment booking via conversational flow
- Embeddable chat widget for any website
- Session management with MongoDB
- Intercom-style UI

## Project Structure

```
Koko/
├── backend/          # Express.js API server
├── frontend/         # React chat widget SDK
└── demo/             # Demo application
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run build
```

### Demo Setup

```bash
cd demo
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
SESSION_TIMEOUT_MINUTES=30
```

## API Endpoints

- `POST /api/chat` - Send message and get AI response
- `POST /api/appointments` - Create appointment
- `GET /api/conversations` - List all sessions
- `GET /api/conversations/:sessionId` - Get conversation history
- `GET /api/appointments/session/:sessionId` - Get appointments for session

## Embedding the Chatbot

Add this script to any website:

```html
<script src="http://localhost:5000/sdk/vet-chatbot.iife.js"></script>
<script>
  VetChatbot.init({
    apiUrl: 'http://localhost:5000/api'
  });
</script>
```

With custom context:

```html
<script src="http://localhost:5000/sdk/vet-chatbot.iife.js"></script>
<script>
  VetChatbot.init({
    apiUrl: 'http://localhost:5000/api',
    context: {
      userId: 'user_123',
      userName: 'John Doe',
      petName: 'Buddy',
      source: 'website'
    }
  });
</script>
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Google Gemini API
- **Demo**: React, React Router, Tailwind CSS
