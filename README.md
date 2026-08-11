# 🌍 JourneySync

> AI-powered trip planning and travel management platform.

JourneySync is a full-stack web application that helps users plan and manage their complete trip from a single platform. Users can discover tourist places and restaurants, plan local transportation, build and optimize itineraries using AI, manage their budget and expenses, check weather, and maintain a travel checklist.

---

## ✨ Features

- **User Authentication:** Secure registration and login using JWT-based authentication with access and refresh tokens.

- **Trip Management:** Create, update, view, and delete trips with information such as source, destination, number of days, number of travelers, and total budget.

- **Places Discovery:** Discover tourist attractions for the selected destination with information such as name, location, images, description, opening/closing timings, ratings, and estimated entry fees.

- **Restaurant Discovery:** Discover restaurants around the destination with information such as name, images, description, ratings, reviews, opening/closing timings, estimated cost, and famous dishes.

- **AI-Enhanced Travel Information:** Use Groq LLM to generate or enrich information that is unavailable from external APIs, such as descriptions, famous dishes, and contextual travel information.

- **Local Transportation:** Enter a source and destination to find estimated distance, travel time, local transportation options, estimated fare, and cost-saving alternatives.

- **AI Transportation Suggestions:** AI can suggest cheaper or more convenient alternatives such as public transportation instead of a taxi.

- **AI Itinerary Planner:** Analyze selected places, restaurants, transportation, trip duration, and budget before creating the final itinerary.

- **Itinerary Optimization:** AI identifies inefficient ordering, excessive travel, time conflicts, and other planning issues and suggests improvements.

- **Final Itinerary:** Generate a structured trip itinerary containing selected places, restaurants, and transportation.

- **Budget Tracker:** Track estimated costs of places, restaurants, transportation, and other planned activities against the total trip budget.

- **AI Budget Optimization:** Analyze planned expenses and suggest cheaper alternatives to help users stay within their budget.

- **Expense Tracker:** Record actual expenses during the trip and compare them with the estimated trip budget.

- **Weather:** Display weather information for the selected destination.

- **Travel Checklist:** Create, complete, and manage a personalized checklist for the trip.

---

## 🤖 AI Integration

JourneySync uses **Groq LLM** as an intelligence layer on top of external travel data and APIs.

AI is used for:

- Generating missing place descriptions
- Generating restaurant descriptions and famous dishes
- Analyzing selected places and restaurants
- Evaluating the planned itinerary
- Suggesting better itinerary ordering
- Identifying inefficient travel plans
- Suggesting cheaper transportation options
- Analyzing planned expenses
- Suggesting ways to reduce the trip budget

The application follows a hybrid approach where structured information is obtained from external APIs and the LLM is used for enrichment, analysis, and recommendations.

---

## 🚀 Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Cookie Parser
- CORS
- dotenv
- Axios

### Database

- MongoDB
- Mongoose

### AI

- Groq API
- LLM-based itinerary analysis
- LLM-based budget optimization
- AI-generated travel information

### External APIs

- Places / Location API
- Routing / Distance API
- Weather API

---

## 🏗️ Project Structure

```text
JourneySync/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── db/
│   │   └── utils/
│   │
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md


## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd JourneySync

cd backend
npm install

cd frontend
npm install

PORT=5000

MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRE=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=10d

GROQ_API_KEY=your_groq_api_key

PLACES_API_KEY=your_places_api_key

WEATHER_API_KEY=your_weather_api_key

cd backend
npm run dev

cd frontend
npm run dev
