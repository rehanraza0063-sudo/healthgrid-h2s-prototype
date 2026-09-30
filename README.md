# HealthGrid — Smart Healthcare Resource & Supply Intelligence Platform
*Know. Predict. Respond.* First working prototype for the GDG hackathon ("Smart Health & Supply Chain Resilience").

## Run
```
npm install
npm run dev
```
(Map tiles need internet; everything else is offline.)

## Architecture
`src/data/mockData.js` (single source of synthetic data) → `src/services/` (nearby search, redistribution, rule-based AI) → `src/pages` + `src/components` (UI).
Reservations persist in LocalStorage (`hg-reservations`). No backend, no auth, no Python.

## Synthetic data
ALL data is synthetic: 12 facilities (fictional coordinates), 156 medicine records, ~130 equipment records, beds, footfall, population, staff, alerts.
Specialist / blood / ambulance counts in Resource Finder are generated deterministically. Reservations and transfers are simulations, not real bookings.
Travel distance = straight line × 1.3; ETA is an estimate.

## 2-minute jury demo
1. **Overview** – 12 facilities on the map, KPIs, risk monitor. (15s)
2. Click **PHC Dharavi** marker → *Open details*: very high density, +26% footfall, emergency beds 4/4.
3. **Find Nearby Resources** → PHC Kurla: 4 emergency beds, oxygen concentrators, healthy stock.
4. **Reserve Bed** → submit → reservation ID (simulation).
5. Back to Dharavi: "Emergency bed shortage resolved" banner.
6. **Medicines** → Amoxicillin at Dharavi (2.4 days) → **Find Nearby Stock** → recommended redistribution (200 units).
7. **AI Assistant** → "Why was this facility selected?" 
8. Bonus: **Emergency Mode** and **Resource Network → Find a Resource** (Ventilator).

## Future Intelligence
Gemini (natural-language analytics, replaces `services/ai.js`), Firebase (live facility updates), BigQuery (history), Vertex AI (demand forecasting, medicine consumption, bed occupancy, equipment failure prediction, surge prediction), Cloud Run (API/optimisation service for cross-district redistribution). The prototype does not depend on any of them.
