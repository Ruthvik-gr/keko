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
- **AI**: Google Gemini API, Groq (Llama 3.3 70B)
- **Demo**: React, React Router, Tailwind CSS

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Demo App      │     │  Chat Widget    │     │  Any Website    │
│   (React)       │     │  (React SDK)    │     │  (Embedded)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Backend API Server    │
                    │   (Express.js)          │
                    │                         │
                    │  ┌───────────────────┐  │
                    │  │   AI Service      │  │
                    │  │  ┌─────────────┐  │  │
                    │  │  │  Gemini API │──┼──┼──► Primary
                    │  │  └─────────────┘  │  │
                    │  │  ┌─────────────┐  │  │
                    │  │  │  Groq API   │──┼──┼──► Fallback
                    │  │  └─────────────┘  │  │
                    │  └───────────────────┘  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       MongoDB           │
                    │  (Sessions, Messages,   │
                    │   Appointments)         │
                    └─────────────────────────┘
```

### Components

1. **Chat Widget SDK** - Embeddable React component that can be added to any website
2. **Backend API** - Express.js server handling chat, sessions, and appointments
3. **AI Service** - Multi-provider AI service with automatic fallback
4. **Database** - MongoDB for persisting sessions, messages, and appointments
5. **Demo App** - Sample React application demonstrating SDK integration

## Key Decisions & Trade-offs

### 1. Hardcoded User for Demo
- **Decision**: User context (userId, userName, petName) is hardcoded in the demo for simplicity
- **Trade-off**: In production, this should be dynamically passed from the host application's authentication system
- **Location**: `frontend/src/main.jsx` contains the hardcoded config

### 2. Multi-Provider AI with Fallback
- **Decision**: Implemented Groq (Llama 3.3 70B) as a fallback when Gemini API fails
- **Rationale**: Gemini free tier has strict rate limits (429 errors). Groq provides a generous free tier as backup
- **Flow**: Gemini (gemini-2.0-flash → gemini-1.5-flash-latest → gemini-pro) → Groq
- **Trade-off**: Slight latency increase on fallback, but ensures higher availability

### 3. Session-based Architecture
- **Decision**: Each chat session is stored with a unique sessionId
- **Trade-off**: Requires cleanup strategy for old sessions, but enables conversation history and analytics

### 4. IIFE Build for SDK
- **Decision**: Built the chat widget as an IIFE (Immediately Invoked Function Expression)
- **Rationale**: Easy embedding with a single script tag on any website
- **Trade-off**: Larger bundle size vs modular imports, but simpler integration

### 5. Intent Detection
- **Decision**: AI-powered intent detection to distinguish between Q&A and appointment booking
- **Trade-off**: Additional API call per message, but enables smarter routing

## Assumptions

> **Important: This is a Proof of Concept (POC) and is NOT production-ready.**

### Current Limitations

1. **No Authentication** - The SDK does not implement user authentication. User context is passed directly without verification.

2. **No Rate Limiting** - The API does not implement rate limiting. Production deployment should add rate limiting middleware.

3. **No Input Sanitization** - Basic validation exists, but comprehensive input sanitization for security is not implemented.
