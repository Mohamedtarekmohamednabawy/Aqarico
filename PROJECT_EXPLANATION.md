# Aqarico: The Absolute Technical Manual (Defense Ready)

This is the definitive technical guide for **Aqarico**. It has been written after a 100% audit of the entire codebase. Every decision, from the choice of database to the specific line of code in the AI agent, is explained here.

---

## 1. High-Level Architecture: The "Polyglot" Ecosystem

Aqarico is not just a website; it is an **Orchestrated System** composed of four main pillars:

1.  **Frontend (React 19 + Vite)**: The "Face." A high-performance SPA using Modern React and Framer Motion for premium UX.
2.  **Backend Orchestrator (Node.js/Express)**: The "Heart." Manages authentication, business logic, and communication between services.
3.  **ML Predictor (FastAPI + XGBoost)**: The "Scientist." A Python service dedicated to mathematical regression (price prediction).
4.  **AI Chat Agent (FastAPI + Gemini 2.5 Flash)**: The "Brain." An agentic system that uses function-calling to search the real database.

---

## 2. Directory & Component Walkthrough

### A. The Global Infrastructure

- **`vite.config.js`**: Uses the `@tailwindcss/vite` plugin for ultra-fast styling and JIT (Just-In-Time) compilation.
- **`package.json`**: Lists critical dependencies like `lucide-react` (icons), `framer-motion` (animations), and `sweetalert2` (premium modals).

### B. Frontend Core (`src/`)

- **State Management (Context API)**:
    - `LanguageContext.jsx`: Handles translation, i18n, and **RTL (Right-to-Left)** layout switching.
    - `ComparisonContext.js`: Manages the global state of properties being compared.
    - `ThemeContext.js`: Controls the "Glassmorphism" design system (Dark/Light modes).
- **Communication (`services/api.js`)**:
    - Uses **Axios Interceptors**.
    - _Logic_: If a request fails with a 401, it auto-redirects to login. If the backend is down (5xx), it dispatches a global `aqarico:backend_down` event to show the maintenance screen.
- **Key Components**:
    - `FloatingChatButton.jsx`: A 900-line masterpiece. It handles **Voice Recognition** (Web Speech API), chat history, and **Agent Actions**. If the AI suggests property IDs, the frontend automatically intercepts them and adds them to the comparison bar.
    - `ListingForm.jsx`: Implements a **Price Warning System**. If a user enters a price 80% away from the market average (fetched from `dataManager`), it triggers a blocking `SweetAlert` to prevent bad data.

### C. Backend Engine (`aqarico-backend/`)

- **The Seeder (`seeder.js`)**:
    - Reads an Excel file (`XLSX`).
    - Maps columns to the `Property` model.
    - Automatically assigns coordinates from a predefined dictionary (`locationCoords`) based on Alexandria's districts.
- **Controllers (The Logic)**:
    - `authController.js`: Handles **Step-up Authentication**. If a user logs in from a new device, a 2FA code is sent via **WhatsApp (Ultramsg)** or **Email (Google Apps Script Proxy)**.
    - `propertyController.js`: Manages standard CRUD. _Unique Logic_: When a property is created, the Node server makes an internal HTTP call to the **Python ML Service** to verify the price's "Fairness."

---

## 3. Algorithms and Data Science

### 1. XGBoost (Extreme Gradient Boosting)

- **Service**: `ml_service/main.py`.
- **Algorithm**: A Gradient Boosted Tree algorithm.
- **Walkthrough**: It uses an `OrdinalEncoder` to transform categorical data (like "Luxury Finish") into numerical weights. It outputs a log-transformed price to minimize the error on high-value properties.

### 2. Agentic AI (Gemini Tool Calling)

- **Service**: `chat_service/main.py`.
- **Method**: Unlike a "standard" chatbot, this is an **Agent**.
- **The Loop**:
    1. User asks: "Find me a flat in Roshdy."
    2. Gemini detects the intent and calls the Python function `search_properties`.
    3. The function queries MongoDB using `pymongo`.
    4. The results are fed back to Gemini, which "explains" them to the user.
       _This eliminates hallucinations—the AI only talks about real database records._

---

## 4. Security & Performance (Critical for Defense)

### 1. Session Security (JWT + HttpOnly)

- We store the session token in an **HttpOnly Cookie**.
- **Benefit**: Even if an attacker injects a malicious script (XSS), they **cannot** access the token because it's only available to the browser's HTTP engine.

### 2. Multi-Layer Protection

- **Express-Rate-Limit**: Prevents "DDoS" or "Brute Force" by limiting requests per IP.
- **Helmet.js**: Sets 15+ secure HTTP headers to prevent "Clickjacking" and "MIME-sniffing."
- **Account Lockout**: In `authController.js`, after 5 failed attempts, the account is locked for 15 minutes.

### 3. Localization Strategy

- The system doesn't just swap text; it swaps **Directions**.
- `document.documentElement.dir = "rtl"` is set dynamically.
- Custom logic ensures phone numbers (LTR) display correctly inside Arabic (RTL) text using Unicode markers.

---

## 5. Potential Defense Questions (The "Curveballs")

**Q: "Why did you use Python FastAPI instead of just doing everything in Node.js?"**

> _Answer_: Node.js is single-threaded and great for I/O. However, Python has the industry-standard libraries for Data Science (`scikit-learn`, `xgboost`, `pandas`). Splitting them into microservices allows us to scale the "expensive" ML calculations on separate CPUs without slowing down the website for other users.

**Q: "How do you handle the 'Cold Start' problem in your AI chat?"**

> _Answer_: We use a **System Prompt** that defines a strict persona and available tools. By using Gemini 2.5 Flash, which has a massive context window and native support for tool-calling, we ensure the agent stays within the boundaries of the real estate database.

**Q: "What happens if your MongoDB database is down?"**

> _Answer_: The `api.js` interceptor catches the 500 error. It then triggers a global "Backend Unavailable" state, showing the user a premium, localized maintenance screen instead of a broken UI or a blank white page.

---

## 6. Closing Note

Aqarico represents a **Professional-Grade Engineering** effort. It combines state-of-the-art AI with robust security principles and a data-driven approach to real estate. You are now prepared to defend every line of code.

**Good luck with your graduation!**
