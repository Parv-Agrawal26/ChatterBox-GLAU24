# ChatterBox

ChatterBox is a simple full-stack real-time private messaging app. It uses a React frontend and a Node.js + Express backend with MongoDB for persistence. The app supports user registration/login, one-to-one messaging, message history, and real-time message delivery using Socket.IO.

This README documents how the project is structured, how to run it in development and production, required environment variables, the HTTP API, and the socket events used for real-time updates.

## Repository layout

- `backend/` - Express server, database connection, API routes, Socket.IO server.
   - `server.js` - main server file (HTTP + Socket.IO).
   - `config/mongoose-connection.js` - connects to MongoDB.
   - `middlewares/verifyToken.js` - reads JWT from cookie and verifies requests.
   - `models/userModel.js` - Mongoose User model.
   - `models/messageModel.js` - Mongoose Message model.
- `frontend/` - React app (Create React App).
   - `src/services/api.js` - HTTP helpers for auth, users, messages.
   - `src/services/socket.js` - Socket.IO client instance.
- `package.json` - root scripts to build/start the app.

## Key features

- User registration and login (passwords hashed with bcrypt).
- Authentication using JWT stored in an HTTP-only cookie.
- One-to-one private messages persisted to MongoDB.
- Real-time messaging via Socket.IO with basic online user tracking.
- Frontend includes an emoji picker (optional) and a simple chat UI.

## Environment variables

Create a `.env` file in `backend/` (or set environment variables in your environment) with at least:

- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - secret used to sign JWT tokens
- `PORT` (optional) - port for the backend (defaults to 5000)

Optional frontend vars (for development):

- `REACT_APP_API_BASE_URL` - API base URL (defaults to `http://localhost:5000` in development)
- `REACT_APP_SOCKET_URL` - Socket.IO server URL (defaults to `http://localhost:5000`)

Example `.env` (backend):

PORT=5000
MONGO_URL=mongodb://localhost:27017/chatterbox
JWT_SECRET=some_strong_secret

## Install & run (development)

Use PowerShell on Windows or your preferred shell.

1) Install dependencies

```powershell
cd C:\Users\agraw\OneDrive\Desktop\chat\ChatterBox-GLAU24
npm install
cd frontend
npm install
```

2) Start backend and frontend in separate terminals

Backend:

```powershell
cd backend
node server.js
```

Frontend (dev server):

```powershell
cd frontend
npm start
```

When running locally in development, the frontend defaults to `http://localhost:3000` and the backend to `http://localhost:5000`.

## Build & run (production)

To build the frontend and serve it from the Express server (single process):

```powershell
cd C:\Users\agraw\OneDrive\Desktop\chat\ChatterBox-GLAU24
npm run build
node backend/server.js
```

The root `package.json` includes a `build` script which installs frontend dependencies then runs the CRA build (`npm run build --prefix frontend`) and the Express server serves the static files from `frontend/build`.

## API (HTTP)

All endpoints that require authentication expect an HTTP-only cookie named `token` containing a JWT. The frontend sets `credentials: 'include'` on requests so cookies are sent.

- POST `/register`
   - Body: { username, email, password }
   - Response: 201 on success
- POST `/login`
   - Body: { email, password }
   - Response: sets `token` cookie and returns { message, userId, username }
- POST `/logout`
   - Response: clears cookie
- GET `/users` (protected)
   - Returns an array of users (each: _id, username) excluding the authenticated user
- GET `/messages/:userId` (protected)
   - Returns chat history (messages between the authenticated user and :userId)
- POST `/messages` (protected)
   - Body: { receiverId, content }
   - Saves message and emits `new_message` via Socket.IO to receiver (if online) and sender.

Note: In the code the routes are mounted at the root (`/register`, `/login`, etc.). If you use a proxy or change base paths, adjust the frontend `REACT_APP_API_BASE_URL` accordingly.

## Socket.IO events

Server side (in `backend/server.js`):
- `connection` - new socket connection
- `user_connected` (client -> server) - payload: userId; the server stores a mapping userId -> socketId
- `new_message` (server -> client) - emitted when a message is saved; the client should listen for this to show real-time incoming messages

Client side (in `frontend/src/services/socket.js`):
- The socket client connects to `REACT_APP_SOCKET_URL` or `http://localhost:5000` by default.

The frontend emits `user_connected` with the authenticated user's id after login so the server can deliver messages to that socket.

## Data models

- User (`backend/models/userModel.js`)
   - username: String (unique)
   - email: String (unique)
   - password: String (hashed)
- Message (`backend/models/messageModel.js`)
   - content: String
   - sender: ObjectId -> User
   - receiver: ObjectId -> User
   - timestamp: Date

## Frontend overview

- `src/services/api.js` contains fetch wrappers for auth, users, and messages. They use `credentials: 'include'` so the cookie-based JWT is sent.
- `src/services/socket.js` exports a singleton Socket.IO client used by React components to listen for `new_message` events and to emit `user_connected`.
- `src/App.js` demonstrates the flow: login/register UI, fetching users, selecting a user to chat with, fetching messages, sending messages, and receiving real-time messages.