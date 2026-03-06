# Kavach-City AI

Project: Kavach-City AI — real-time urban infrastructure monitoring dashboard.

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
