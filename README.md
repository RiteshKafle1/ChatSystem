# 🌐 Mini Chat App (Realtime + JWT + Redis + Socket.IO)

### _(Node.js + Express + MongoDB + Redis + JWT + Socket.IO + Rate limiting + Arcjet detection)_

A **realtime chat application** with secure authentication (access + refresh tokens), Redis-backed token management, rate-limiting, Arcjet detection for suspicious activity, and Socket.IO-powered messaging.
Users can **signup, login, logout, refresh access tokens, view contacts, send & receive messages, and stream message events in realtime**.

---

## ✨ Highlights

### 🔐 Authentication & Security

- **Access & Refresh tokens** — short-lived access token + long-lived refresh token.
- **Redis** stores refresh & access tokens for fast lookup and token invalidation.
- **JWT** used for token payloads (jsonwebtoken).
- **Rate limiting** to prevent abuse (per-IP & per-user).
- **Arcjet (detection)** for suspicious behavior / bot detection (integrated in auth & messaging flows).
- **Cookie** support for tokens depending on client needs.

### 💬 Messaging

- **Socket.IO** for realtime send/receive message events and presence.
- **Message service** for storing messages in MongoDB and retrieving contact lists + history.

### 🔁 Token Flow

- Login -> receive access token (short) + refresh token (long)
- Access token expiry -> client calls `/auth/refresh` with refresh token -> server validates Redis -> issues new access token
- Logout invalidates refresh token in Redis.

---

## 🧩 Tech Stack

| Purpose              | Technology                                |
| -------------------- | ----------------------------------------- |
| Backend              | Node.js, Express                          |
| DB                   | MongoDB + Mongoose                        |
| Token store / cache  | Redis (refresh tokens)                    |
| Realtime             | Socket.IO                                 |
| Auth                 | JWT (jsonwebtoken)                        |
| Password hashing     | bcrypt                                    |
| Rate limit           | express-rate-limit / custom redis limiter |
| Suspicious detection | Arcjet (integrated)                       |

---

## 📁 Folder Structure

```
backend/
├── config/
│   ├── db.js
│   ├── redis.js
│   └── rateLimit.js
│   └── .env.js
│   └── arcjet.js
├── controllers/
│   ├── auth.controller.js
│   └── message.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── rateLimit.middleware.js
│   └── arcjet.middleware.js
├── models/
│   ├── User.model.js
│   └── Message.model.js
├── routes/
│   ├── auth.route.js
│   └── message.route.js
├── services/
│
│   ├── user.service.js
│   └── message.service.js
├── utils/
│   └── responseHandler.js
│   └── token.js
├── client.js
└── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
npm install
```

### 2. Environment variables

Create a `.env`:

```env
PORT=
MONGO_URI=
REDIS_URL=
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ARCJET_SECRET_KEY=your_arcjet_key
NODE_ENV=development
```

### 3. Start services

Make sure MongoDB , Redis and server are running. Then:

```bash
npm run dev
# or
npm start
```

---

## 🔄 API — Quick Reference

> All protected endpoints require a valid access token (cookie).

### Auth

- `POST /api/auth/signup`
  Body: `{ fullname, email, password }`
  Returns: userId, fullName, email

- `POST /api/auth/login`
  Body: `{ email, password }`
  Returns: accessToken, refreshToken,userId, fullName, email

- `POST /api/auth/refresh`
  Body: cookie — returns new access token & new refresh token. Server validates refresh token in Redis.

- `POST /api/auth/logout`

### Messages / Contacts

- `GET /api/contacts` — list contacts
- `GET /api/messages/:contactId?` — view conversation
- `POST /api/messages/:contactId`
  Body: `{ to: userId, text: "..." }` — sends message and emits socket event

### Detection

evaluate suspicious request (auto-called by middleware)

---

## 🔌 Socket.IO Events

Server-side emits / listens:

**Client -> Server**

- `join` `{ userId, token }` — authenticate socket and join user room
- `send_message` `{ to, text, tempId }` — send message to user (server persists then emits delivered)
- `typing` `{ to, isTyping }`

**Server -> Client**

- `message` `{ from, message }` — new message received
- `message_status` `{ messageId, status }` — delivered/read updates
- `presence_update` `{ userId, status }` — online/offline updates

---

## ✅ Token lifecycle

- **Access Token** — short expiry (15 minutes). Contains user id . On each request verify signature.
- **Refresh Token** — long expiry (e.g. 7 days). Store a hashed refresh token in Redis keyed by `refresh:<userId>:<tokenId>` . On refresh, validate the token exists and is not revoked. Rotate refresh & access tokens where possible.

- **Redis** — use TTL to automatically expire tokens/blacklist entries.

---

## 🔒 Rate limiting & Arcjet

- Use `express-rate-limit` with Redis-backed store for distributed rate limiting (if deployed across multiple instances).
- Add stricter limits on auth endpoints (`/auth/login`, `/auth/signup`, `/auth/refresh`).
- Integrate Arcjet in middleware to score incoming requests (IP, headers, behavior). If Arcjet flags suspicious, increase rate limit, require challenge, or block.
- Log suspicious events for later review.

👩‍💻 Author & Contribute

Ritesh — built with Node, Socket.IO, Redis and Arcjet.
Contributions welcome: fork, branch, PR. Add tests and docs for new features.
