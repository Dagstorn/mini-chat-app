# Mini Chat App

A minimal real-time chat application built with Expo React Native, Socket.IO, and a Node.js backend.

---

## Features

- Chats list, contats list, starting new chat with a contact
- Real-time messaging with WebSocket (Socket.IO)
- User presence and message seen status
- Clean and modular code structure (services, hooks, UI components)
- Works on iOS and Android

---

## Project Structure

```
server/             # Basic backend server with Web Sockets and REST endpoints
app/                # App router
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
├── lib/            # shared utility that encapsulates socket connection
├── services/       # API and WebSocket logic
├── store/          # Global state (Zustand)
└── types/          # Shared TypeScript types
```

## Get started

### Prerequisites

- Node.js (v16+)
- Android Studio or Xcode for emulator/simulator
- Expo CLI
  ```bash
  npm install -g expo-cli
  ```

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
npm install
npx expo start
```

## 🧪 Testing

Basic manual testing supported. To improve:
