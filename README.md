# Kavach-City AI

**Real-time Smart City Infrastructure Monitoring & AI Decision Platform**

Kavach-City AI is a full-stack urban intelligence dashboard that simulates, monitors, and analyzes city-wide infrastructure in real time. It covers 10 ward sensors across 6 resource domains, drives AI-powered emergency plans via Featherless AI (Qwen3), and provides deep analytics including budget allocation, congestion alerts, predictive forecasts, and ward-level health scoring.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [AI Integration](#ai-integration)
- [Analytics & Budget Module](#analytics--budget-module)

---

## Features

| Module | Description |
|--------|-------------|
| **Live Dashboard** | Real-time ward sensor streaming via Socket.io — 10 wards, 5-second refresh |
| **Predictive Digital Twin** | Moving-average trend forecasting per resource with slope analysis |
| **Disaster Simulation** | Toggle power outage, flood, traffic jam, or pipeline burst scenarios |
| **City Health Index** | Weighted KPI score (0–100) aggregating all ward resource states |
| **Historical Replay** | Replay any 30-minute window of sensor readings from MongoDB |
| **AI Tactical Reasoning** | Ward-level emergency plans via Featherless AI (Qwen3-VL-30B), with structured JSON output and local fallback |
| **Infrastructure Analytics** | City-wide utilization, zone comparison charts, 24h/7d forecasts, hotspot map |
| **Budget Allocation Analysis** | Per-ward budget vs. demand analysis, sector funding breakdown, underfunding detection, AI redistribution recommendations |
| **Congestion Alerts** | Resource-level alert feed (Overloaded / Congested) with severity badges |
| **Ward → Command Center** | Click any ward in Analytics to deep-link it into the Dashboard with full detail panel |
| **Glassmorphism UI** | Light-theme glassmorphism design — refined slate/indigo palette, no rainbow |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Vite + React)              │
│  Landing → Dashboard → Analytics → Technology → About   │
│                                                          │
│  Components: MapView · WardPanel · HealthIndex ·        │
│  AIExplainPanel · DisasterToggle · ReplayPanel          │
│                                                          │
│  Analytics: CapacityStress · StatusDistribution ·       │
│  CongestionAlerts · ForecastChart · HotspotMap ·        │
│  UtilizationGrid · Recommendations · BudgetAnalysis     │
└──────────────────┬──────────────────────────────────────┘
                   │  HTTP REST + Socket.io
┌──────────────────▼──────────────────────────────────────┐
│                 BACKEND (Node.js + Express)              │
│                                                          │
│  SimulationService  →  5s tick, 10 wards, 6 resources  │
│  PredictionService  →  Moving average + trend slope     │
│  AIService          →  Featherless AI (chat/completions)│
│                                                          │
│  REST API: /api/analytics · /api/budget · /api/ai       │
│            /api/ai/city   · /api/ai/budget              │
│            /api/history   · /api/wards                  │
└──────────────────┬──────────────────────────────────────┘
                   │  Mongoose ODM
┌──────────────────▼──────────────────────────────────────┐
│                 MongoDB (kavach database)                │
│  Collections: wards · sensorreadings                    │
└─────────────────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│          Featherless AI  (api.featherless.ai/v1)         │
│  Model: Qwen/Qwen3-VL-30B-A3B-Instruct                  │
│  Endpoints used: /chat/completions                      │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing (6 routes) |
| Framer Motion | 12 | Page & component animations |
| Recharts | 3 | Bar, Line, Pie charts |
| Leaflet | 1.9 | Interactive ward hotspot map |
| Socket.io-client | 4.7 | Live sensor stream |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Express | 4.18 | HTTP server & REST API |
| Socket.io | 4.7 | Real-time bidirectional events |
| Mongoose | 7 | MongoDB ODM |
| Axios | 1.4 | Featherless AI HTTP calls |
| dotenv | 16 | Environment variable loading |
| nodemon | — | Dev auto-restart |

---

## Project Structure

```
Round2/
├── backend/
│   ├── models/
│   │   ├── Ward.js              # Ward schema (6 resources + capacities + budgets)
│   │   └── SensorReading.js     # Time-series sensor snapshot
│   ├── services/
│   │   ├── simulationService.js # 10-ward simulation loop (5s tick)
│   │   ├── predictionService.js # Moving average + trend analysis
│   │   └── aiService.js         # Featherless AI integration + local fallback
│   ├── server.js                # Express + Socket.io + all API routes
│   ├── .env                     # Secrets (not committed)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   │   ├── BudgetAnalysis.jsx    # Budget allocation dashboard
│   │   │   │   ├── CapacityStress.jsx    # Bar charts: city + zone utilization
│   │   │   │   ├── CongestionAlerts.jsx  # Alert feed with severity filter
│   │   │   │   ├── ForecastChart.jsx     # 24h / 7d predictive line chart
│   │   │   │   ├── HotspotMap.jsx        # Leaflet map with status circles
│   │   │   │   ├── Recommendations.jsx   # Priority-ranked action cards
│   │   │   │   ├── StatusDistribution.jsx# Pie chart of ward health states
│   │   │   │   └── UtilizationGrid.jsx   # Paginated ward card grid
│   │   │   ├── AIExplainPanel.jsx        # AI tactical reasoning panel
│   │   │   ├── DisasterToggle.jsx        # Disaster scenario selector
│   │   │   ├── GlassCard.jsx             # Glassmorphism card wrapper
│   │   │   ├── HealthIndex.jsx           # City health KPI gauge
│   │   │   ├── MapView.jsx               # Leaflet live map
│   │   │   ├── Navbar.jsx                # Sticky navigation bar
│   │   │   ├── ReplayPanel.jsx           # Historical replay controls
│   │   │   └── WardPanel.jsx             # Ward list + selected detail
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Public home (/)
│   │   │   ├── Dashboard.jsx     # Command Center (/dashboard)
│   │   │   ├── Analytics.jsx     # Analytics hub (/analytics)
│   │   │   ├── Technology.jsx    # Tech stack page (/technology)
│   │   │   ├── About.jsx         # About page (/about)
│   │   │   └── NotFound.jsx      # 404
│   │   ├── services/
│   │   │   └── socketService.js  # Socket.io client singleton
│   │   ├── styles/
│   │   │   ├── theme.css         # Global CSS variables (slate/indigo palette)
│   │   │   └── glass.css         # Glassmorphism + ward-row utilities
│   │   └── App.jsx               # Router root
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017 (or a MongoDB Atlas URI)
- A Featherless AI API key (optional — local fallback works without it)

### 1. Clone and install

```bash
# Root dependencies (if any)
cd Round2
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**`backend/.env`**
```env
MONGODB_URI=mongodb://localhost:27017/
PORT=4000
LLM_API_KEY=your_featherless_api_key
LLM_BASE_URL=https://api.featherless.ai/v1
LLM_MODEL=Qwen/Qwen3-VL-30B-A3B-Instruct
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:4000
```

---

## Running Locally

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd Round2/backend
npm run dev          # nodemon auto-restart
# or
npm start            # plain node
```

**Terminal 2 — Frontend**
```bash
cd Round2/frontend
npm run dev          # Vite dev server → http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

> If port 4000 is already in use on Windows, run:
> ```powershell
> Get-NetTCPConnection -LocalPort 4000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
> ```

---

## Environment Variables

| Variable | Location | Required | Description |
|----------|----------|----------|-------------|
| `MONGODB_URI` | backend/.env | Yes | MongoDB connection string |
| `PORT` | backend/.env | No | Backend port (default: 4000) |
| `LLM_API_KEY` | backend/.env | No | Featherless AI key — enables real AI responses |
| `LLM_BASE_URL` | backend/.env | No | Featherless base URL (default: `https://api.featherless.ai/v1`) |
| `LLM_MODEL` | backend/.env | No | Model ID (default: `Qwen/Qwen3-VL-30B-A3B-Instruct`) |
| `VITE_API_URL` | frontend/.env | No | Backend base URL (default: `http://localhost:4000`) |

---

## API Reference

### Core

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wards` | All 10 ward documents from MongoDB |
| `GET` | `/api/history?minutes=30` | Sensor reading history (default 30 min) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics` | Full analytics computation: utilization, zones, forecasts, alerts, recommendations |
| `GET` | `/api/budget` | Ward-wise budget allocation, demand vs. budget gap, sector totals, underfunded wards, ranking |

### AI

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/ai?wardId=W-1` | — | Ward-level emergency plan (Featherless or local fallback) |
| `POST` | `/api/ai/city` | `{ cityAvg, hotspots, alerts }` | City-wide AI risk assessment |
| `POST` | `/api/ai/budget` | `{ budgetAnalysis }` | AI-powered budget redistribution recommendations |

### Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `sensors:bulk` | Server → Client | `{ timestamp, wards[] }` — full ward state every 5s |
| `ai:analysis` | Server → Client | `{ wardId, ai }` — triggered when utilization > 90% |
| `disaster:set` | Client → Server | `{ enabled, scenario }` — toggle disaster mode |
| `replay:start` | Client → Server | `{ minutes }` — request historical frames |
| `replay:frames` | Server → Client | Array of SensorReading documents |

---

## AI Integration

The `AIService` calls the Featherless AI OpenAI-compatible `/chat/completions` endpoint with a structured system prompt. It gracefully falls back to deterministic heuristics when no API key is set or the call fails.

### Ward Emergency Plan Response
```json
{
  "severity": 85,
  "status_code": "Warning",
  "prediction": "Power and traffic demand will exceed rated capacity within 30 minutes.",
  "tactical_action": [
    "Initiate phased load-shedding on Ward W-5",
    "Divert traffic via alternate corridors",
    "Alert city operations centre"
  ],
  "summary": "Ward W-5 (Central zone) — power: 92% (Congested), traffic: 88% (Congested)",
  "reasoning": {
    "critical_resources": ["power", "traffic"],
    "risk_assessment": "Two resources simultaneously approaching overload threshold.",
    "conclusion": "Immediate coordinated intervention required."
  },
  "source": "featherless-ai"
}
```

### City AI Insights Response
```json
{
  "cityStatus": "Warning",
  "headline": "Central zone power grid at 94% city-wide average — risk of cascade failure.",
  "top_actions": ["Pre-emptive demand management", "Activate reserve capacity", "Monitor adjacent zones"],
  "risk_score": 67,
  "insight": "Weekly pattern shows Friday peaks historically 12% above Thursday baseline.",
  "source": "featherless-ai"
}
```

---

## Analytics & Budget Module

### Infrastructure Analytics (`/analytics`)

- **KPI Cards** — total wards, city avg utilization, active alerts, overloaded zones, hotspots, underutilized
- **Capacity Stress** — grouped bar charts: city-wide + zone-by-zone comparison across 6 resources
- **Status Distribution** — pie chart of ward health states (Optimal / Congested / Overloaded / Underutilized)
- **Congestion Alerts** — live alert feed filterable by severity
- **Predictive Trends** — 24-hour and 7-day demand projection line charts
- **Hotspot Map** — Leaflet map with color-coded circles per ward status
- **AI City Intelligence** — live Featherless AI panel: city status, risk score, priority actions
- **Recommendations** — priority-ranked (Critical / High / Low) actionable items for city planners
- **Ward Utilization Grid** — clickable card grid for all 10 wards → navigates to Command Center

### Budget Allocation Analysis

The budget module models each ward's infrastructure spending across 6 sectors and compares it against real-time utilization demand:

- **Highest-funded ward** and its per-sector breakdown
- **Top-funded sector** city-wide (traffic, water, power, etc.)
- **Demand–budget gap** — wards where resource demand exceeds allocated budget
- **Underfunded wards** — ranked list with funding deficit percentage
- **Ward ranking** by utilization efficiency (value delivered per budget unit)
- **AI Redistribution Recommendations** — Featherless AI generates reallocation strategies with deficit/surplus analysis

---

## License

MIT — built for the Kavach Smart City AI hackathon.


## Project Overview

Kavach-City AI monitors simulated ward sensors (Power Load, Water Supply, Traffic Density) and provides real-time visualization, predictions, disaster simulation, historical replay, and AI-driven tactical planning.

## Features

- Real-time sensor simulation and Socket.io streaming
- Predictive Digital Twin (moving-average forecasts)
- Disaster Mode with pulsing map markers and AI emergency plans
- City Health Index KPI and gauge
- Historical Replay system (last 30 minutes)
- AI Decision Explainability panel

## Architecture

- Backend: Node.js + Express + MongoDB + Socket.io
- Frontend: Vite + React + Leaflet (map) + lightweight component styles
- AI Integration: Featherless AI (optional via `FEATHERLESS_API_KEY`)

## Installation

1. Add environment variables in `.env`:

```
MONGODB_URI=your_mongo_connection_string
FEATHERLESS_API_KEY=your_key_optional
PORT=4000
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run start:server
```

## Running the Project

Start backend server (above). The frontend is located in `src/` (React). Connect to backend via Socket.io at default port 4000.

## AI Integration

Set `FEATHERLESS_API_KEY` if you have an external AI account. The backend will call Featherless for tactical analysis; otherwise it uses a local heuristic.

### AI Response Example

```json
{
  "severity": 80,
  "status_code": "Warning",
  "prediction": "Power demand likely to exceed 90% within 45 minutes",
  "tactical_action": [
    "Initiate phased load balancing",
    "Notify regional grid operator"
  ],
  "reasoning": {
    "power": { "current": 88, "trendPerMinute": 0.4, "threshold": 90 },
    "conclusion": "Projected exceedance in ~45 minutes based on moving average trend."
  }
}
```

## Future Improvements

- Add user authentication and role-based tactical actions
- Persist AI decisions and feedback loop for ML model training
- Advanced forecasting (ARIMA / LSTM) for production
