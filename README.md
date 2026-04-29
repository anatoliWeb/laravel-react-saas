# Laravel + React SaaS Dashboard

## Language

- 🇬🇧 English (default)
- 🇺🇦 Українська: [README_UA.md](./README_UA.md)

## Overview

This project demonstrates a modern API-first web application architecture built with Laravel and React.

It provides a clean separation between backend services and frontend client, with a focus on scalability, maintainability, and real-world development practices.

The system includes:
- RESTful API built with Laravel
- Token-based authentication
- Lightweight admin panel for system management
- React-based dashboard consuming backend services

---

## Architecture

The application follows a service-oriented architecture:

- **Backend (Laravel)**
  - Handles business logic
  - Provides REST API
  - Manages authentication and tokens
  - Includes internal admin panel

- **Frontend (React)**
  - Consumes API via HTTP
  - Displays dashboard and data views
  - Handles user interaction

- **Communication**
  - JSON API over HTTP
  - Bearer token authentication

---

## Stack

### Backend
- PHP 8+
- Laravel
- Laravel Sanctum (token authentication)

### Frontend
- React (Vite)
- Axios / Fetch API

### Infrastructure
- Docker
- Nginx

---

## Features

- API-first architecture
- Token-based authentication (Sanctum)
- Modular backend structure (Controllers + Services)
- Admin panel for managing access
- Clean separation of concerns
- Dockerized environment

---

## API Endpoints (Example)

```
GET /api/users
GET /api/stats
```

### Example Response

```json
{
  "users": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ]
}
```

---

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer YOUR_TOKEN
```

Tokens can be managed via the internal admin panel.

---

## Development Approach

This project follows a structured, incremental development process:

- Feature-based development
- Small, focused commits
- Clear separation between backend and frontend
- Iterative improvements

All development steps are tracked in `TODO.md`.

---

## How to Run

1. Clone the repository

```
git clone <repository_url>
cd project
```

2. Copy environment file

```
cp .env.example .env
```

3. Start containers

```
docker-compose up -d
```

4. Access services

- Backend API: http://localhost/api
- Frontend: http://localhost
- Admin panel: http://localhost/admin

---

## Project Structure

```
/backend     Laravel application (API + Admin)
/frontend    React application
/docker      Docker configuration
/docs        Additional documentation
```

---

## Documentation

- Architecture: [docs/architecture.md](./docs/architecture.md)
- Commands: [docs/commands.md](./docs/commands.md)
- Development Plan: [TODO.md](/TODO.md)

---

## Notes

- This project is designed to reflect real-world development patterns
- Focus is on structure, clarity, and maintainability
- Business logic is intentionally simplified

---

## Future Improvements

- Database integration
- Role-based access control
- Advanced logging and monitoring
- Real-time features
- Extended admin capabilities

---

## License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.