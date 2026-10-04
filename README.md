# FoodPack AI: Intelligent Food Packaging Material Recommendation System
### Ministry of Food Processing Industries (MoFPI) Hackathon 2026

An AI-powered decision support and recommendation system designed to optimize food packaging material selection, extend commodity shelf life, prevent food loss, and ensure strict compliance with **FSSAI (IS 9845)**, **FDA 21 CFR**, and **ASTM/ISO** packaging barrier standards.

---

## 🚀 Key Features

1. **Authentication & Session Security**:
   - Secure password hashing using `bcryptjs` (cost factor 12).
   - JWT-based authentication with token persistence, role separation (`admin`, `operator` / `food_technologist`), and protected routes.
   - Zero hardcoded secrets, all managed via `.env`.

2. **Food Commodity Management**:
   - Full CRUD operations with rich food science parameters:
     - Categories: Fresh Produce, Dairy, Bakery, Meat/Poultry, Seafood, Dry Foods/Spices, Ready-to-Eat (RTE), Oils & Fats.
     - Sensitivities: Oxygen ($O_2$), Moisture ($H_2O$), Light/UV, Temperature, and Respiration Rate.
     - Storage Conditions: Ambient, Chilled ($0-4^\circ\text{C}$), Frozen ($-18^\circ\text{C}$), Controlled Atmosphere (CA/MAP).

3. **Packaging Material Database**:
   - Barrier transmission metrics:
     - Oxygen Transmission Rate (OTR, $\text{cc}/\text{m}^2\cdot\text{day}\cdot\text{atm}$)
     - Water Vapor Transmission Rate (WVTR, $\text{g}/\text{m}^2\cdot\text{day}$)
     - Light Barrier transmission percentage ($0-100\%$)
     - Thermal stability range ($\text{Min}^\circ\text{C}$ to $\text{Max}^\circ\text{C}$)
     - Active Scavengers: Oxygen Absorbers, Ethylene Scavengers, Antimicrobial Coatings.
     - Circularity & Sustainability: 10-point Recyclability Score, Certified Compostability flag, and Raw Cost Index ($\text{INR}/\text{kg}$).

4. **Multi-Agent AI Recommendation Engine**:
   - **Planner Agent**: Analyzes commodity spoilage mechanisms and normalizes user priorities (Protection vs. Cost vs. Sustainability).
   - **Barrier Evaluation Agent**: Compares barrier properties against food degradation limits.
   - **Shelf-Life Kinetics Agent**: Predicts post-packaging shelf-life multiplier and estimated days.
   - **Compliance Agent**: Validates FSSAI / FDA food contact regulations and mechanical puncture resistance.
   - **Sustainability Agent**: Evaluates circularity and raw material cost trade-offs.
   - **AI Synthesis Agent**: Generates concise technical justifications using **Google Gemini AI SDK** (or intelligent Food Packaging Rules Engine fallback).

5. **Side-by-Side Material Comparison**:
   - Compare 2 to 4 packaging materials simultaneously for any food commodity.
   - Real-time SVG Radar / Spider Charts comparing 5 performance vectors.
   - Highlighted badges for Best Protection, Most Sustainable, and Most Economical choices.

6. **FoodPack AI Conversational Agent**:
   - Natural language food packaging assistant with RAG grounding in the live packaging database.
   - Returns structured technical justifications, preservation mechanisms, and suggested commercial formats.

7. **Dashboard & Report Exporting**:
   - KPI metrics, sector distribution charts, and recent recommendations feed.
   - One-click branded **MoFPI PDF Advisory Report** export and **CSV Data Export**.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (Pages Router), React 18, Tailwind CSS, Zustand, Axios, Lucide React, Canvas Confetti, jsPDF, jspdf-autotable.
- **Backend**: Node.js, Express, MongoDB (with automatic **In-Memory MongoDB fallback** for zero-setup local dev), Mongoose, JWT, bcryptjs, Helmet, Express-Validator, Morgan, Compression, Socket.IO.
- **AI Integration**: Google Generative AI (`@google/generative-ai`), OpenRouter API, and built-in Food Science Rules Engine.

---

## 📦 Prerequisites

- **Node.js**: v18.0.0 or newer (tested on Node v24.x)
- **npm**: v9.0.0 or newer

*(Note: External MongoDB installation is optional; the server includes an automatic in-memory MongoDB fallback so it runs out-of-the-box!)*

---

## ⚙️ Installation & Setup

### 1. Clone & Install Dependencies
From the repository root, install dependencies for root, server, and client:

```bash
npm run install:all
```
*(Or install manually in each folder: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

---

### 2. Environment Configuration

#### Backend Configuration (`server/.env`):
Create or check `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Security
JWT_SECRET=mofpi_foodpack_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d
CREDENTIAL_ENCRYPTION_KEY=12345678901234567890123456789012

# MongoDB Connection (Auto-fallbacks to In-Memory if not running locally)
MONGODB_URI=mongodb://127.0.0.1:27017/foodpack_mofpi

# AI Integration API Keys (Optional - Rule-based food science engine activates if left blank)
GEMINI_API_KEY=
OPENROUTER_API_KEY=
```

#### Frontend Configuration (`client/.env.local`):
Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

### 3. Seed Database (Optional - Happens automatically on first run)

```bash
npm run seed
```

---

### 4. Start the Application

To run both backend and frontend concurrently with one command:
```bash
npm run dev
```

Alternatively, run in separate terminals:
- **Server**: `npm run dev:server` (Starts API on `http://localhost:5000`)
- **Client**: `npm run dev:client` (Starts UI on `http://localhost:3000`)

---

## 🔑 Demo Credentials (Preset)

| Role | Email | Password |
| :--- | :--- | :--- |
| **MoFPI Chief Admin** | `admin@mofpi.gov.in` | `Password@123` |
| **Packaging Scientist** | `priya@foodpack.org` | `Password@123` |

*(You can also register a new account at `/register` or use the 1-click demo filler buttons on `/login`.)*

---

## 🧪 Verification & Testing API Endpoints

- `GET /api/health` - System health check and service status
- `POST /api/auth/login` - User authentication and JWT issue
- `GET /api/commodities` - List and filter food commodities
- `GET /api/materials` - List packaging materials with barrier specs
- `POST /api/recommendations` - Run multi-agent AI evaluation
- `POST /api/comparisons` - Compare 2-4 materials side-by-side
- `POST /api/chat/message` - Query FoodPack AI RAG assistant
- `GET /api/dashboard/summary` - Aggregated metrics and sector stats

---

## 🏛️ Developed for
**Ministry of Food Processing Industries (MoFPI)**  
Hackathon 2026 Problem Statement: *AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities*
