# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

设备管理系统 — fullstack device management system with real-time chat and AI assistant.

- **Backend:** Spring Boot 2.7 + Spring Security + JPA + WebSocket + MySQL 8.0
- **Frontend:** Vue 3 + Element Plus + Pinia + Vue Router + Axios + Vite
- **AI:** DeepSeek API integration
- **Build:** Maven (backend), npm/vite (frontend)
- **Java:** 17, **Node:** 16+

## How to Start

### Backend (port 8081)
```bash
cd backend
mvn spring-boot:run
```

### Frontend (port 3005)
```bash
cd frontend
npm install   # first time only
npm run dev
```

### Database
```sql
CREATE DATABASE IF NOT EXISTS device_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Default accounts (auto-created): `admin/admin123` (管理员), `user1/user123` (普通用户)

## Architecture

### Backend Layers (`backend/src/main/java/com/devicemanagement/`)
```
config/        → JWT filter, CORS, Security, WebSocket, DataInitializer
controller/    → REST endpoints (Auth, User, Admin, Device, Friend, Chat, AI)
dto/           → Request/response DTOs (LoginRequest, RegisterRequest, ApiResponse)
entity/        → JPA entities (User, Device, Friend, FriendRequest, ChatMessage, Blacklist)
repository/    → Spring Data JPA repositories
service/       → Business logic (User, Device, Friend, Chat, DeepSeek)
handler/       → WebSocket handler for real-time chat
utils/         → JWT utility
```

### Frontend Structure (`frontend/src/`)
```
views/         → Page components (Login, Register, Dashboard, Devices, UserManagement, Profile, Chat, AiChat)
store/         → Pinia stores (auth.js, chat.js)
router/        → Vue Router config
utils/         → Axios instance with JWT interceptor
```

### Key Architectural Decisions

- **JWT Auth:** Login returns JWT token → stored in localStorage → axios interceptor adds `Authorization: Bearer <token>` to all requests. All axios imports in components/stores MUST use `../utils/axios` (the configured instance), never raw `'axios'` library.
- **WebSocket Chat:** ChatWebSocketHandler manages online user sessions (ConcurrentHashMap). Messages are broadcast in real-time. Message types: CHAT, CHAT_ACK, MARK_READ, MESSAGE_READ, USER_STATUS.
- **Security:** Spring Security with stateless JWT. Routes: `/api/auth/**` permitAll, `/api/admin/**` hasRole ADMIN, others authenticated.
- **CORS:** CorsConfig allows all origins with `allowCredentials(true)`.
- **Default Data:** DataInitializer creates admin user, demo user, and 10 sample devices on first startup.

### WebSocket Message Protocol

| Direction | Type | Description |
|-----------|------|-------------|
| Client → Server | CHAT | Send message (fields: receiverId, content) |
| Client → Server | MARK_READ | Mark messages as read (fields: friendId) |
| Client → Server | TYPING | Typing indicator (fields: receiverId, isTyping) |
| Server → Client | CHAT | New message received |
| Server → Client | CHAT_ACK | Message sent confirmation |
| Server → Client | MESSAGE_READ | Read receipt notification |
| Server → Client | USER_STATUS | Friend online/offline change |

### API Endpoints

- `POST /api/auth/login` / `POST /api/auth/register`
- `GET/PUT /api/user/info` / `PUT /api/user/password`
- `GET /api/admin/users` / `POST /api/admin/users` / `DELETE /api/admin/users/{id}`
- `GET/POST/PUT/DELETE /api/admin/devices` / `GET /api/device/export` / `POST /api/device/import`
- `POST /api/friend/request` / `GET /api/friend/list` / `POST /api/friend/block|unblock/{userId}`
- `GET /api/chat/conversation/{friendId}` / `POST /api/chat/read/{friendId}`
- `POST /api/ai/chat`
