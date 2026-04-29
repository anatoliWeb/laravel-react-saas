# Architecture

## Overview

This document describes the system architecture, design decisions, and component interactions.

The system follows an API-first, service-oriented approach with clear separation between backend and frontend.

---

## High-Level Architecture

Frontend (React) → API (Laravel) → Services → Database / Redis

---

## Components

### Backend (Laravel)

Responsible for:
- Business logic
- REST API
- Authentication (Sanctum)
- Admin panel

Structure:
- Controllers (entry points)
- Services (business logic)
- Models (data layer)

---

### Frontend (React)

Responsible for:
- UI rendering
- API communication
- User interaction

Communicates with backend via HTTP (JSON API).

---

### Database (MySQL)

Used for:
- Persistent storage
- Users, tokens, and future business data

Data is stored in Docker volume to ensure persistence.

---

### Redis

Used for:
- Caching
- Queue (future use)
- Fast in-memory storage

---

### Nginx

Acts as:
- Reverse proxy
- Static file server
- Entry point for HTTP requests

---

### WebSocket (optional)

Used for:
- Real-time updates
- Event-driven communication

---

## Authentication Flow

1. Token created in admin panel
2. Client stores token
3. Requests include:
   Authorization: Bearer TOKEN
4. Backend validates via Sanctum

---

## Data Flow Example

1. Frontend requests /api/users
2. Request hits Nginx
3. Routed to Laravel
4. Controller calls Service
5. Service returns data
6. JSON response sent to frontend

---

## Key Design Decisions

- API-first approach
- Separation of concerns
- Dockerized environment
- Token-based authentication
- Stateless backend

---

## Future Improvements

- Queue workers (Redis)
- Role-based access control
- Monitoring & logging system
- Horizontal scaling

---

## Notes

- System is designed to be easily extendable
- Structure prioritizes clarity and maintainability
