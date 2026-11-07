# Aqarico Backend — Full Implementation Plan (v2)
### Fully Aligned with Frontend Codebase

---

## Critical Context for the Builder

The frontend is a **fully functioning React SPA** that currently uses **localStorage as its entire data layer** — there is no API layer, no axios, no fetch, no environment variables, and no backend integration of any kind. Your job is to:

1. Build the full Node.js + Express backend described in this document
2. Build a Python FastAPI microservice for ML price prediction
3. **Also create a frontend API layer** — create `src/services/api.js` in the React project and replace all `localStorage` calls in `src/data/dataManager.js`, `src/utils/favoritesManager.js`, and all auth logic with real `axios` calls to the backend endpoints defined here

---

## Tech Stack

| Layer | Technology |
|---|---|
| Main Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Image Uploads | Cloudinary (free tier) |
| Payments | Stripe (test mode only — no real money) |
| ML Prediction | Python FastAPI microservice (separate process) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| File handling | multer (memory storage) |
| HTTP calls (Node to Python) | axios |
| Frontend HTTP client | axios (to be added to React project) |

---

## Environment Variables (.env)

Create this file in the backend root. Never commit it to GitHub — add it to `.gitignore`.

```
PORT=5000
MONGODB_URI=mongodb+srv://Aqarico:<password>@cluster0.uela3ky.mongodb.net/aqarico?appName=Cluster0
JWT_SECRET=aqarico_super_secret_jwt_key_2024
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx

ML_SERVICE_URL=http://localhost:8000
```

Create a `.env.example` with the same keys but empty values — this one IS safe to commit.

---

## Repository Structure

```
aqarico-backend/
├── server.js
├── .env                        # Never commit this
├── .env.example                # Safe to commit
├── .gitignore
├── package.json
│
├── config/
│   └── db.js                   # MongoDB connection
│
├── middleware/
│   ├── auth.js                 # JWT verification, attaches req.user
│   ├── roles.js                # Role-based access control
│   └── errorHandler.js         # Global error handler
│
├── models/
│   ├── User.js
│   ├── Property.js
│   ├── Agent.js
│   ├── Booking.js
│   └── Comparison.js
│
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── properties.js
│   ├── agents.js
│   ├── favorites.js
│   ├── bookings.js
│   ├── predict.js
│   ├── analytics.js
│   └── chat.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── propertyController.js
│   ├── agentController.js
│   ├── favoriteController.js
│   ├── bookingController.js
│   ├── predictController.js
│   ├── analyticsController.js
│   └── chatController.js
│
├── utils/
│   ├── generateToken.js
│   ├── stripe.js
│   └── cloudinary.js
│
└── ml_service/                 # Python FastAPI — runs as a separate process
    ├── main.py
    ├── requirements.txt
    └── models/
        ├── xgboost_real_estate_model.pkl
        └── data_encoder.pkl
```

---

## MongoDB Models

### 1. User Model (`models/User.js`)

The frontend registration form sends `firstName` and `lastName` as separate fields — not a single `name` field. Store them separately.

The frontend `EditProfile` page has these role options: `"Individual Seller"`, `"Real Estate Agent"`, `"Property Agency"`, `"Developer"`. Map them to backend roles as follows:

| Frontend Label | Backend Role Value |
|---|---|
| Individual Seller | seller |
| Real Estate Agent | agent |
| Property Agency | agency |
| Developer | developer |

Also include `admin` as a backend-only role not selectable from the UI, and `buyer` as the default for new registrations.

```js
{
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },               // bcrypt hashed
  role:      { type: String, enum: ['buyer', 'seller', 'agent', 'agency', 'developer', 'admin'], default: 'buyer' },
  phone:     { type: String },
  country:   { type: String },
  avatar:    { type: String },                               // Cloudinary URL
  favorites: [{ type: ObjectId, ref: 'Property' }],
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

JWT payload should contain: `{ id, firstName, lastName, email, role, avatar }` — the frontend needs firstName, lastName, and avatar to display in the navbar.

### 2. Property Model (`models/Property.js`)

The listing form (`ListingForm.jsx`) sends `amenities` as a JSON-stringified array of toggled strings such as `["Furnished", "Elevator", "Security"]`. The backend must parse this array and convert it into individual binary fields for the ML model.

The form also sends `coordinates` as a JSON-stringified object from the map picker: `{"lat": 31.2, "lng": 29.9}`.

```js
{
  // Listing form fields sent directly from frontend
  title:          { type: String, required: true, maxlength: 50 },
  description:    { type: String, maxlength: 500 },
  price:          { type: Number, required: true },
  location:       { type: String, required: true },
  coordinates:    { lat: Number, lng: Number },
  type:           { type: String, enum: ['sale', 'rent'], required: true },
  category:       { type: String },                          // "Apartment", "Villa", "Studio", etc.
  area:           { type: Number, required: true },
  bedrooms:       { type: Number, required: true },
  bathrooms:      { type: Number, required: true },
  images:         [{ type: String }],                        // Cloudinary URLs

  // Amenities stored as binary fields (parsed from amenities array)
  furnished:         { type: Number, enum: [0, 1], default: 0 },
  electricityMeter:  { type: Number, enum: [0, 1], default: 0 },
  naturalGas:        { type: Number, enum: [0, 1], default: 0 },
  waterMeter:        { type: Number, enum: [0, 1], default: 0 },
  elevator:          { type: Number, enum: [0, 1], default: 0 },
  security:          { type: Number, enum: [0, 1], default: 0 },

  // Additional ML model fields, optional
  district:       { type: String },
  finish:         { type: String, enum: ['Semi Finished', 'Lux', 'Super Lux', 'Extra Super Lux', 'Without Finish'] },
  yearBuilt:      { type: Number },
  floor:          { type: Number, default: 0 },

  // Platform fields
  predictedPrice: { type: Number },                          // set automatically after ML call
  owner:          { type: ObjectId, ref: 'User', required: true },
  agent:          { type: ObjectId, ref: 'Agent' },
  isVerified:     { type: Boolean, default: false },
  status:         { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
  provenanceTag:  { type: String },
  views:          { type: Number, default: 0 },
  createdAt:      { type: Date, default: Date.now }
}
```

Amenities array to binary fields mapping — do this in the property controller:

```js
const amenitiesMap = {
  'Furnished':         'furnished',
  'Elevator':          'elevator',
  'Security':          'security',
  'Natural Gas':       'naturalGas',
  'Electricity Meter': 'electricityMeter',
  'Water Meter':       'waterMeter',
};
const parsedAmenities = JSON.parse(req.body.amenities || '[]');
parsedAmenities.forEach(a => {
  if (amenitiesMap[a]) propertyData[amenitiesMap[a]] = 1;
});
```

Valid location values (all 48 Alexandria neighborhoods from the dataset):
'Abo Qir', 'Camp Cesar', 'San Stefano', 'Lauran', 'Bakoos', 'Glim', 'Fleming', 'Cleopatra', 'Sidi Gaber', 'Roshdy', 'Smouha', 'Zezenia', 'Kafr Abdo', 'Sidi Bishr', 'Bolekly', 'El Mandara', 'El Seyouf', 'El Awayed', 'Abu Youssef', 'Bahary', 'Mansheya', 'Ibrahimia', 'El Asafra', 'Miami', 'Sporting', 'El Chatby', 'Ganaklis', 'Victorya', 'El Hadara', 'Moharram Bek', 'Saba Basha', 'Mahta El Raml', 'El Amreya', 'Stanley', 'El Mamoura', 'El Montazah', 'El Bitash', 'El Qabari', 'El Wardiyan', 'Mina El Basal', 'King Mariout', 'Abu Talat', 'El Dekhila', 'El Hanouvel', 'Kilo 21', 'El Max', "El Saa'ah Sq", 'Ras Al Tin'

Valid district values: 'El Montazah', 'Wasat', 'Sharq', 'El Agami', 'El Gomrok', 'El Amreya', 'Gharb'

### 3. Agent Model (`models/Agent.js`)

```js
{
  user:               { type: ObjectId, ref: 'User', required: true, unique: true },
  bio:                { type: String },
  phone:              { type: String },
  isVerifiedByAdmin:  { type: Boolean, default: false },
  assignedListings:   [{ type: ObjectId, ref: 'Property' }],
  createdAt:          { type: Date, default: Date.now }
}
```

### 4. Booking Model (`models/Booking.js`)

There is no booking form in the current frontend. A simple booking modal or page will need to be added to the React project as part of the integration work.

```js
{
  property:              { type: ObjectId, ref: 'Property', required: true },
  buyer:                 { type: ObjectId, ref: 'User', required: true },
  amount:                { type: Number, required: true },
  stripePaymentIntentId: { type: String },
  stripeStatus:          { type: String },
  status:                { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt:             { type: Date, default: Date.now }
}
```

### 5. Comparison Model (`models/Comparison.js`)

```js
{
  user:       { type: ObjectId, ref: 'User' },
  properties: [{ type: ObjectId, ref: 'Property' }],
  createdAt:  { type: Date, default: Date.now }
}
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Body: `{ firstName, lastName, email, password, phone, country }`. Returns JWT + user. |
| POST | `/login` | Public | Body: `{ email, password }`. Returns JWT + user. |
| GET | `/me` | Private | Returns current user from token. Used on app load to restore session. |

Register and login response shape:
```json
{
  "token": "eyJ...",
  "user": {
    "_id": "...",
    "firstName": "Omar",
    "lastName": "Refai",
    "email": "omar@email.com",
    "role": "seller",
    "avatar": null,
    "phone": "...",
    "country": "EG"
  }
}
```

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Admin | Get single user |
| PUT | `/:id` | Admin | Update any user |
| DELETE | `/:id` | Admin | Delete any user |
| PUT | `/profile` | Private | Update own profile. Body: `{ firstName, lastName, phone, country, role }`. Requires `currentPassword`. |
| PUT | `/profile/avatar` | Private | Upload avatar. `multipart/form-data` with `avatar` field. Returns new Cloudinary URL. |
| PUT | `/password` | Private | Body: `{ oldPassword, newPassword, confirmPassword }` |
| DELETE | `/account` | Private | Body: `{ password }`. Deletes own account after verification. |

### Properties — `/api/properties`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all properties with filters |
| GET | `/my` | Auth | Get logged-in user's own listings (ManageListings page) |
| GET | `/map/pins` | Public | Lightweight map data only: `{ _id, coordinates, price, type, status, title }` |
| GET | `/:id` | Public | Single property, auto-increments views |
| POST | `/` | Auth | Create listing. `multipart/form-data`. Triggers ML + Cloudinary. |
| PUT | `/:id` | Owner/Admin | Update property |
| DELETE | `/:id` | Owner/Admin | Delete property |
| PUT | `/:id/verify` | Admin | Toggle isVerified |
| POST | `/compare` | Public | Body: `{ propertyIds: ["id1","id2","id3"] }`. Returns full details of each. |

Supported query params for GET `/api/properties`:
```
?type=sale|rent
?location=Smouha
?category=Apartment
?minPrice=500000
?maxPrice=2000000
?minArea=80
?maxArea=200
?bedrooms=3
?bathrooms=2
?isVerified=true
?searchQuery=smouha
?page=1
?limit=12
?sortBy=price|createdAt|area
?sortOrder=asc|desc
```

POST `/api/properties` multipart/form-data body:
```
title, description, price, location, type, category,
area, bedrooms, bathrooms,
amenities       (JSON stringified array: '["Furnished","Elevator"]'),
coordinates     (JSON stringified object: '{"lat":31.2,"lng":29.9}'),
district        (optional),
finish          (optional),
yearBuilt       (optional),
floor           (optional),
images          (one or more image files)
```

### Agents — `/api/agents`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | All agents with user info populated |
| GET | `/:id` | Public | Single agent with their listings |
| PUT | `/:id/verify` | Admin | Toggle isVerifiedByAdmin |
| PUT | `/:id` | Agent/Admin | Update bio and phone |

### Favorites — `/api/favorites`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Private | Get current user's favorites (populated Property objects) |
| POST | `/:propertyId` | Private | Add to favorites |
| DELETE | `/:propertyId` | Private | Remove from favorites |

### Bookings — `/api/bookings`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-payment-intent` | Private | Body: `{ propertyId }`. Returns `{ clientSecret }` from Stripe. |
| POST | `/confirm` | Private | Body: `{ propertyId, stripePaymentIntentId }`. Saves booking, sets property to booked. |
| GET | `/my` | Private | Current user's bookings |
| GET | `/` | Admin | All bookings |
| PUT | `/:id/cancel` | Owner/Admin | Cancel booking, reset property to available |

### Price Prediction — `/api/predict`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Accepts 14 ML fields, calls Python service, returns predicted price |

Request body:
```json
{
  "location": "Smouha",
  "district": "Wasat",
  "finish": "Lux",
  "area": 120,
  "bedrooms": 3,
  "bathrooms": 2,
  "yearBuilt": 2010,
  "floor": 3,
  "furnished": 1,
  "electricityMeter": 1,
  "naturalGas": 1,
  "waterMeter": 1,
  "elevator": 1,
  "security": 0
}
```

Response:
```json
{ "predictedPrice": 1450000, "currency": "EGP" }
```

### Analytics — `/api/analytics`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/market` | Public | Avg price by location, count by district, count by type, price distribution |
| GET | `/dashboard` | Admin | Total users, listings, bookings, recent activity |

### Chat — `/api/chat`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Body: `{ message }`. Returns placeholder for now. |

Response: `{ "reply": "AI assistant is coming soon. Stay tuned!" }`

---

## Middleware

### `middleware/auth.js`
Reads `Authorization: Bearer <token>`, verifies with JWT_SECRET, attaches full user to `req.user`. Returns 401 if missing or invalid.

### `middleware/roles.js`
Usage: `roles('admin')` or `roles('admin', 'seller')`. Checks `req.user.role`. Returns 403 if unauthorized.

### `middleware/errorHandler.js`
Global error handler at the bottom of `server.js`. All controllers use `next(err)`. Always returns `{ success: false, message: "..." }`.

---

## Python FastAPI ML Microservice

Location: `ml_service/` inside the backend repo.
Run command: `uvicorn main:app --reload --port 8000`
The React frontend never calls this directly. Only Node.js calls it internally.

### `ml_service/requirements.txt`
```
fastapi
uvicorn
xgboost
scikit-learn
pandas
numpy
```

### How `ml_service/main.py` must work

1. On startup load both pickle files from `models/` folder
2. The `data_encoder.pkl` is a numpy array of column names in this exact order: `['Area', 'Bedrooms', 'Bathrooms', 'Location', 'District', 'Year Built', 'Finish', 'Floor', 'Furnished', 'Electricity Meter', 'Natural Gas', 'Water Meter', 'Elevator', 'Security']`
3. Accept `POST /predict` with the 14 fields as JSON
4. Build a pandas DataFrame using column names matching the encoder
5. Pass to `model.predict()` — target encoding for Location, District, Finish is already baked into the model pipeline
6. CRITICAL: The model outputs Log_Price (natural log). Reverse it with numpy:
```python
import numpy as np
log_price = model.predict(df)[0]
actual_price = int(round(np.exp(log_price)))
```
7. Return `{ "predictedPrice": actual_price }`

Node.js predict controller calls it like this:
```js
const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, mlFields);
// If Python service is down, catch error and return { predictedPrice: null }
```

---

## Property Creation Flow

When POST /api/properties is called:
1. Validate required fields
2. Parse `amenities` JSON string → set individual binary fields
3. Parse `coordinates` JSON string → `{ lat, lng }`
4. Upload all image files to Cloudinary → array of URLs
5. Save property to MongoDB with `owner: req.user._id`
6. If `type === 'sale'`, call Python ML service with the 14 fields
7. Store returned `predictedPrice` back on the property document
8. Return full property object to frontend

For `type === 'rent'`, skip ML call and set `predictedPrice: null`.

---

## Authentication Flow

1. Register: hash password (bcrypt saltRounds 10) → save user → return JWT + user object
2. Login: find by email → compare password → return JWT + user object
3. JWT payload: `{ id, role }` minimal
4. JWT expiry: 30 days
5. Frontend stores: token as `aqarico_token` in localStorage, user as `aqarico_user` in localStorage
6. App load: frontend calls GET /api/auth/me with stored token to restore session

---

## Stripe Payment Flow

1. Frontend calls POST /api/bookings/create-payment-intent with `{ propertyId }`
2. Backend creates Stripe PaymentIntent. Amount is property price in piastres (EGP × 100).
3. Backend returns `{ clientSecret }` to frontend
4. Frontend uses Stripe.js + `confirmCardPayment(clientSecret)` with test card
5. On success, frontend calls POST /api/bookings/confirm with `{ propertyId, stripePaymentIntentId }`
6. Backend verifies PaymentIntent with Stripe, saves booking, updates property status to `booked`

Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 9995` (declined). Any future date, any CVC.

---

## Frontend API Layer Migration

Create `src/services/api.js` in the React project:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aqarico_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Create `src/services/` folder with these files:
- `authService.js` — register, login, getMe
- `propertyService.js` — getProperties, getProperty, createProperty, updateProperty, deleteProperty, getMyProperties, compareProperties, getMapPins
- `favoriteService.js` — getFavorites, addFavorite, removeFavorite
- `agentService.js` — getAgents, getAgent
- `bookingService.js` — createPaymentIntent, confirmBooking, getMyBookings
- `userService.js` — updateProfile, updateAvatar, updatePassword, deleteAccount
- `analyticsService.js` — getMarketData
- `chatService.js` — sendMessage

Create `.env` in the React project root:
```
VITE_API_URL=http://localhost:5000/api
```

Files to migrate:

| File | What to replace |
|---|---|
| `src/data/dataManager.js` | Replace all localStorage CRUD with axios calls to /api/properties |
| `src/utils/favoritesManager.js` | Replace localStorage with axios calls to /api/favorites |
| `src/pages/Login.jsx` | Replace localStorage auth with POST /api/auth/login |
| `src/pages/Register.jsx` | Replace localStorage auth with POST /api/auth/register |
| `src/pages/EditProfile.jsx` | Replace with PUT /api/users/profile and PUT /api/users/profile/avatar |
| `src/pages/PasswordSecurity.jsx` | Replace with PUT /api/users/password |
| `src/pages/DeleteAccount.jsx` | Replace with DELETE /api/users/account |
| `src/pages/ManageListings.jsx` | Replace with GET /api/properties/my |
| `src/components/FloatingChatButton.jsx` | Replace hardcoded response with POST /api/chat |

---

## Role Permissions Summary

| Action | buyer | seller | agent | agency | developer | admin |
|---|---|---|---|---|---|---|
| Browse properties | yes | yes | yes | yes | yes | yes |
| View property details | yes | yes | yes | yes | yes | yes |
| Add/remove favorites | yes | yes | yes | yes | yes | yes |
| Compare properties | yes | yes | yes | yes | yes | yes |
| Book a property | yes | yes | yes | yes | yes | yes |
| Create listing | no | yes | yes | yes | yes | yes |
| Edit/delete own listing | no | yes | yes | yes | yes | yes |
| Verify listings | no | no | no | no | no | yes |
| Verify agents | no | no | no | no | no | yes |
| Manage all users | no | no | no | no | no | yes |
| Admin dashboard | no | no | no | no | no | yes |
| Price prediction | yes | yes | yes | yes | yes | yes |

---

## Dataset Reference

- File: Processed_Properties.xlsx — 20,572 records, Alexandria Egypt only
- Price range: 80,000 to 11,500,000 EGP
- Area range: 40 to 227 m²
- Bedrooms: 1 to 4
- Floor: 0 (ground) to 21
- All amenity fields are binary: 0 or 1
- The model predicts Log_Price — always reverse with np.exp()
- Prediction is Alexandria-specific. If location is outside the 48 known neighborhoods, return a warning alongside the result.

---

## Suggested Implementation Order

1. config/db.js + server.js skeleton + .env setup
2. All Mongoose models
3. All middleware (auth, roles, errorHandler)
4. utils/generateToken.js
5. Auth routes and controllers (register, login, me)
6. Property routes and controllers (CRUD + filters + map pins + compare)
7. ml_service/main.py — Python FastAPI service
8. Predict route and controller
9. Wire up ML call and Cloudinary in property creation
10. Favorites routes and controllers
11. Agent routes and controllers
12. Booking routes and Stripe integration
13. User management routes (profile, password, avatar, delete, admin CRUD)
14. Analytics routes
15. Chat placeholder route
16. Frontend migration — create src/services/api.js and migrate all localStorage calls

---

## General Implementation Notes

- CORS: Allow http://localhost:5173 (Vite default) and http://localhost:3000
- Consistent response shape: always `{ success: true, data: ... }` for success, `{ success: false, message: "..." }` for errors
- Async handling: use asyncHandler wrapper or try/catch in every controller
- Pagination: all list endpoints support ?page and ?limit, defaults are page 1 limit 12
- View counter: use $inc to avoid race conditions
- Owner check: always verify property.owner.toString() === req.user._id.toString() before edit/delete
- Never return password field: always use .select('-password') on user queries
- ML service resilience: if Python service is down, set predictedPrice to null and continue — do not crash Node server

---

*Aqarico — Where Dreams Find Homes*
*Faculty of Computers and Data Science, Alexandria University*
*Supervised by Dr. Bothina*
