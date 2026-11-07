# Aqarico: The Trusted Real Estate Platform

Aqarico is a high-performance, product-grade real estate interface designed for searching, comparing, managing listings, verifying agents, and making informed market decisions. It features a modern, warm design system and advanced AI capabilities to simplify the real estate journey.

## 🚀 Key Features

- **Advanced Property Search**: Deep filtering by price, area, location, finish type, amenities, and more.
- **AI Real Estate Consultant**: An agentic chatbot powered by Google Gemini 2.5 Flash, capable of searching listings, comparing properties, and providing market insights in Arabic and English.
- **ML Price Prediction**: Integrated XGBoost model to provide accurate price estimates for properties based on location and specifications.
- **Market Dashboard**: Scannable data visualizations using Chart.js to track price trends and market distribution.
- **Trusted Agent Network**: Dedicated profiles for verified agents and agencies.
- **Comparison Tool**: A floating decision-focused UI to compare property specifications side-by-side.
- **Multi-layered Security**: Secure JWT authentication via HTTP-only cookies, device fingerprinting, and account lockout protection.
- **Bilingual Support**: Full RTL/LTR support for Arabic and English users.

## 🛠 Tech Stack

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Vanilla CSS
- **Routing**: React Router 7
- **Animations**: Framer Motion
- **State/Data**: Axios, Context API
- **Maps**: Leaflet + React Leaflet
- **Charts**: Chart.js + React-Chartjs-2

### Backend

- **Framework**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (Secure Cookies) + Bcryptjs
- **File Storage**: Cloudinary (via Multer)
- **Payments**: Stripe
- **Microservices**:
    - **ML Service**: Python + FastAPI + XGBoost (Price Prediction)
    - **AI Chat Service**: Python + FastAPI + Google Gemini 2.5 Flash

## 📦 Project Structure

```text
Aqarico-main/
├── src/                # Frontend source (React/Vite)
│   ├── components/     # UI components (PropertyCards, Dashboards, etc.)
│   ├── pages/          # Application routes
│   ├── services/       # API service layers
│   ├── theme/          # Design tokens and theme logic
│   └── i18n/           # Localization (EN/AR)
├── aqarico-backend/    # Main Node.js API
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth, Rate-limiting, Error handling
│   ├── ml_service/     # Python microservice for XGBoost prediction
│   └── chat_service/   # Python microservice for Gemini AI chatbot
├── public/             # Static assets
└── package.json        # Frontend dependencies
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account
- Cloudinary account
- Gemini API Key

### 1. Clone the repository

```bash
git clone https://github.com/NinjaSphinXO/Aqarico2.git
cd Aqarico2
```

### 2. Frontend Setup

```bash
npm install
# Create a .env file in the root directory
# VITE_API_URL=http://localhost:5000/api
```

### 3. Backend Setup

```bash
cd aqarico-backend
npm install
# Create a .env file based on .env.example
# Add your MONGODB_URI, JWT_SECRET, CLOUDINARY and STRIPE keys.
```

### 4. Microservices Setup (Python)

Navigate to both `ml_service` and `chat_service` directories:

```bash
cd ml_service
pip install -r requirements.txt
# Repeat for chat_service
```

## 🏃 How to Run

1. **Start the Backend**:
    ```bash
    cd aqarico-backend
    npm run dev
    ```
2. **Start the Microservices**:

    ```bash
    # In separate terminals
    cd aqarico-backend/ml_service
    uvicorn main:app --port 8000 --reload

    cd aqarico-backend/chat_service
    uvicorn main:app --port 8001 --reload
    ```

3. **Start the Frontend**:
    ```bash
    cd Aqarico2
    npm run dev
    ```

## 🛡 License

Distributed under the **ISC License**. See `package.json` in the backend for more details.
