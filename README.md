# Activity Feed + Notifications System (UI)

This folder contains the **frontend UI** for a mini “activity feed + notifications” system (GitHub/LinkedIn style). It includes pages to explore:

- Activity feed (pull model)
- Realtime notifications stream (push model via SSE)
- Polling notifications fallback
- Windowed “Top 100” analytics

> Note: The UI assumes there is a backend API that exposes the required endpoints (`/events`, `/feed`, `/notifications/stream`, `/notifications`, `/top`). If your backend runs on a different port/host, configure the API base URL accordingly (see “Configuration” below).

---

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or pnpm/yarn if you prefer)

---

## Install

From `event-stream-hub/`:

```sh
npm install
```

---

## Run (dev)

```sh
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).

---

## Build & Preview

```sh
npm run build
npm run preview
```

---

## Configuration

If your backend API is not served from the same origin as the UI, you will typically need one of these:

- A Vite proxy configuration (recommended in dev)
- CORS enabled on the backend

Search for API calls / base URL usage in:

- `src/components/feed/ActivityFeed.tsx`
- `src/components/notifications/NotificationPanel.tsx`
- `src/components/analytics/*`
- `src/components/api/ApiPlayground.tsx`

---

## API Contract (Backend)

The UI is built around these endpoints:

### Event ingestion

- `POST /events`
- Body:
  - `actor_id`, `verb`, `object_type`, `object_id`, `target_user_ids[]`, optional `created_at`
- Response: `{ "event_id": "..." }`

### Feed retrieval

- `GET /feed?user_id=<id>&cursor=<optional>&limit=<optional>`
- Response: `{ "items": [...], "next_cursor": "..." | null }`
- Requirements:
  - Stable, paginated, newest-first (keyset pagination recommended)

### Notifications

- `GET /notifications/stream?user_id=<id>` (SSE or WebSocket)
- `GET /notifications?user_id=<id>&since=<optional>` (polling fallback)

### Analytics

- `GET /top?window=1m|5m|1h`
- Response: `{ "items": [top100...], ... }`

Auth is mocked for the assignment (assume a `user_id` header or query param as your backend expects).

---

## Load Testing (ab)

The assignment requires running `ab` across:

- Stored events: 100k, 300k, 500k, 700k, 900k
- Concurrency: 200, 600, 1000, 1400, 1800
- Requests: `n = 10 * concurrency`

Example commands (backend host/port may differ):

```sh
ab -c 200 -n 2000 "http://localhost:3000/feed?user_id=user_123&limit=20"
ab -c 1000 -n 10000 "http://localhost:3000/notifications?user_id=user_123"
ab -c 600 -n 6000 "http://localhost:3000/top?window=5m"
```

For `POST /events`, create an `event.json` file and run:

```sh
ab -c 200 -n 2000 -p event.json -T application/json "http://localhost:3000/events"
```

---

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- Recharts (analytics charts)
