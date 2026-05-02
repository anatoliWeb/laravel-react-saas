# Laravel + React SaaS Dashboard

English documentation. Ukrainian version: [README_UA.md](./README_UA.md)

## Overview

This project simulates a real-world SaaS architecture where a Laravel API powers a separate React SPA frontend.

It exists to demonstrate production-style engineering decisions beyond basic CRUD:
- API-first backend with clear contracts
- RBAC-driven access control and permission-aware UI
- centralized activity logging for auditability
- modular frontend architecture with reusable UI systems

The goal is to showcase how backend and frontend evolve together in a scalable monorepo.

## Features

### Backend
- API-first architecture (Laravel)
- RBAC with roles and permissions
- Activity logging system (service + observers)
- FormRequest validation for API inputs
- Service layer for business logic separation
- Sanctum token authentication

### Frontend
- React SPA with Vite
- Protected and permission-aware UI rendering
- Global loader system for async operations
- Modal form system with 422 validation handling
- Reusable DataTable (search, sorting, pagination, actions)
- i18n support (EN / UK / DE)

## Architecture

### Request flow
`Controller -> Service -> Model -> JSON response`

- Controllers keep HTTP concerns minimal.
- Services contain business logic and mutation rules.
- Models handle persistence and relationships.
- FormRequests enforce input contracts.

### Separation of concerns
- Backend is API-first and reusable for multiple clients.
- Frontend consumes API through dedicated service modules.
- RBAC is enforced on both layers:
  - backend middleware/authorization (source of truth)
  - frontend conditional rendering (UX layer)

### Activity logging
- Centralized `ActivityService` is the logging entry point.
- Model observers automate logging for key domain events.
- Dashboard stats can consume recent activity history.

### DTO usage
- DTO-style shaping is used to keep API payloads predictable and UI-friendly.

## Stack

### Backend
- PHP 8.3+
- Laravel 13
- Laravel Sanctum

### Frontend
- React (Vite)
- SCSS
- i18next

### Infrastructure
- Docker Compose
- Nginx
- MySQL 8
- Redis 7

## Security

- Token-based authentication via Sanctum
- Password hashing with Laravel hashing layer
- Validation-first API strategy via FormRequests
- RBAC enforcement with permission middleware
- Frontend hides restricted actions but backend still validates authorization
- Login hardening is designed around API validation and centralized auth endpoints

## Development

### Frontend development
- Source: `frontend/`
- Main app entry: `frontend/src/main.jsx`
- API consumption: `frontend/src/services/`
- i18n files: `frontend/src/i18n/locales/`

### Backend development
- Source: `backend/`
- API routes: `backend/routes/api.php`
- Services: `backend/app/Services/`
- Requests: `backend/app/Http/Requests/`

### Configuration
- Root `.env` is used by Docker services
- Backend env sample: `backend/.env.example`
- Frontend API base URL: `VITE_API_BASE_URL` (in frontend env)

## Running Project

1. Clone repository
```bash
git clone <repository_url>
cd laravel-react
```

2. Create environment file in project root
```bash
cp .env.example .env
```

3. Start Docker services
```bash
docker compose up -d
```

4. Open applications
- Frontend: `http://localhost:5173`
- Backend (Nginx): `http://localhost:8080`
- API example: `http://localhost:8080/api/users`

## Environment Notes

Docker services from `docker-compose.yml`:
- `backend` (php-fpm)
- `nginx`
- `frontend` (Vite dev server)
- `mysql`
- `redis`
- `websocket` (reserved for realtime/dev tasks)

Important notes:
- Database host inside containers should match Docker service name (`mysql`).
- Ports are controlled via `.env` (`APP_PORT`, `FRONT_PORT`).
- Backend and frontend are mounted as volumes for live development.

## Testing

Feature tests exist for critical backend flows (including users API, metadata, activity logging, auth-related API checks).

Run tests inside backend container:
```bash
docker compose exec -T backend php artisan test
```

Or locally (if PHP is installed):
```bash
cd backend
php artisan test
```

## Screenshots

Placeholders (to be replaced with real images):
- Dashboard overview
- Users DataTable
- Create/Edit user modal

## Project Structure

```text
/backend      Laravel API + admin backend logic
/frontend     React SPA
/docker       Dockerfiles and nginx configuration
/docs         Additional project docs
TODO.md       Step-by-step development plan
README.md     English documentation
README_UA.md  Ukrainian documentation
```

## Documentation

- Development plan: [TODO.md](./TODO.md)
- Architecture notes: [docs/architecture.md](./docs/architecture.md)
- Commands reference: [docs/commands.md](./docs/commands.md)

## Development Approach

- Feature-based commits
- Small, testable steps from `TODO.md`
- Clean commit messages with clear scope

Example commit style:
- `feat(users): add roles and permissions sync in API`
- `fix(frontend): handle users fetch retry and empty states`

## Future Improvements

- Add full API documentation (OpenAPI/Swagger)
- Expand end-to-end test coverage for SPA flows
- Add audit filtering/export tools for activity logs
- Introduce CI quality gates (lint + tests + build)
- Finalize production deployment docs

## License

MIT License. See [LICENSE](./LICENSE).
