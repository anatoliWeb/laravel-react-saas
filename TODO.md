# TODO.md - Laravel + React SaaS Dashboard

> Goal: Build a portfolio-grade mini SaaS system demonstrating clean architecture, API-first design, token-based auth, and a lightweight admin panel.

---

## Phase 0 - Project Initialization

- [x] Step 1: Create repository and initialize README, TODO.md, .gitignore
- [x] Step 2: Define project structure (backend, frontend, docker, docs)
- [x] Step 3: Add .editorconfig and basic coding standards
- [x] Step 4: Setup initial Git commit with clean structure

---

## Phase 1 - Docker & Environment

- [x] Step 5: Create docker-compose.yml (PHP, Nginx, Node)
- [x] Step 6: Configure Nginx for Laravel backend
- [x] Step 7: Setup Laravel container (PHP-FPM)
- [x] Step 8: Setup Node container for React
- [x] Step 9: Add .env.example with base config
- [x] Step 10: Verify project runs with docker-compose up

---

## Phase 2 - Laravel Backend (API)

- [x] Step 11: Initialize Laravel project in /backend
- [x] Step 12: Configure API routes file
- [x] Step 13: Create UsersController (stub)
- [x] Step 14: Create StatsController (stub)
- [x] Step 15: Add GET /api/users endpoint (mocked data)
- [x] Step 16: Add GET /api/stats endpoint (mocked data)

---

## Phase 3 - Backend Structure

- [x] Step 17: Create Services layer (UserService, StatsService)
- [x] Step 18: Move logic from controllers into services
- [x] Step 19: Add DTOs or simple data structures
- [x] Step 20: Add basic error handling (try/catch + logs)

---

## Phase 4 - Authentication (Sanctum)

- [x] Step 21: Install Laravel Sanctum
- [x] Step 22: Configure token-based authentication
- [x] Step 23: Create endpoint for issuing tokens
- [x] Step 24: Protect API routes with auth middleware
- [x] Step 25: Test API with Bearer token

---

## Phase 5 - Admin Panel (Laravel)

- [x] Step 26: Create /admin route group
- [x] Step 27: Setup simple admin layout (Blade or Livewire)
- [x] Step 28: Create Users management page (list only)
- [x] Step 29: Create Token management page
- [x] Step 30: Add create/delete token functionality

### Access Control

- [x] Implement RBAC system (roles + permissions)
- [x] Add direct user permissions support
- [x] Create role and permission middleware
- [x] Protect admin routes with permission checks

### Data & Seeds

- [x] Add seed data for roles and permissions
- [x] Add demo users with different roles
- [x] Generate API tokens for testing

### Roles & Permissions UI

- [x] Create roles management page
- [x] Implement role permissions editor
- [x] Add permissions CRUD (create/edit/delete)
- [x] Add user roles & permissions editor

### UI / UX Improvements

- [x] Implement sidebar navigation (grouped + icons)
- [x] Add active state and permission-based menu visibility
- [x] Add breadcrumbs component
- [x] Improve layout structure and spacing
- [x] Add SCSS design system (variables, components, layout)
- [x] Add basic JS interactivity (sidebar toggle)

### Activity System (Audit)

- [x] Implement ActivityLog model and migration
- [x] Create centralized ActivityService
- [x] Add global helper activity_log()
- [x] Implement model observers (User, Token)
- [x] Ensure automatic activity logging
- [x] Add fallback manual logging
- [x] Fix silent failure in logging logic

### Infrastructure / API Integration

- [x] Implement centralized CORS handling in Laravel
- [x] Add custom CorsMiddleware with preflight support
- [x] Move CORS configuration to config/cors.php
- [x] Add environment-based CORS configuration (.env)
- [x] Remove dependency on nginx for CORS
- [x] Ensure SPA compatibility (React -> Laravel API)

---

## Phase 6 - React Frontend

- [x] Step 31: Initialize React app (Vite)
- [x] Step 32: Setup folder structure (pages, components, services)
- [x] Step 33: Create API client (axios/fetch wrapper)
- [x] Step 34: Create Dashboard page
- [x] Step 35: Fetch /api/stats and display data
- [x] Step 36: Create Users page
- [x] Step 37: Fetch /api/users and display list

---

## Phase 7 - Frontend Improvements

- [x] Step 38: Add loading states
- [x] Step 39: Add error handling (API failures)
- [x] Step 40: Add simple UI styling (cards, layout)
- [x] Step 41: Store API token (local storage or env)

---

## Phase 8 - Integration

- [x] Step 42: Connect frontend to backend via Docker network
- [x] Step 43: Test full flow (token -> API -> UI)
- [x] Step 44: Fix CORS issues if needed
- [x] Step 45: Validate endpoints via frontend

---

## Phase 9 - Logging & Stability

- [x] Step 46: Add Laravel logging (errors, API calls)
- [x] Step 47: Add simple request logging middleware
- [x] Step 48: Handle edge cases (empty data, failures)

---

## Phase 10 - Documentation

- [x] Step 49: Complete README.md (overview, stack, run steps)
- [x] Step 50: Add architecture.md in /docs
- [x] Step 51: Document API endpoints with examples
- [x] Step 52: Add "Why this stack" section

---

## Phase 11 - Polish & Portfolio Ready

- [x] Step 53: Clean code and remove debug logs
- [ ] Step 54: Ensure consistent naming
- [ ] Step 55: Review commit history (clean, logical steps)
- [ ] Step 56: Add screenshots (optional)
- [ ] Step 57: Final test (fresh docker-compose up)
- [ ] Step 58: Publish repository

---

## Notes

- Each step = 1 Git commit
- Use clear commit messages:
  - feat: add users endpoint
  - feat: implement dashboard page
  - fix: handle api error response
- Keep code simple and readable
- Avoid overengineering

---

## Final Goal

A clean, structured, realistic SaaS demo project showing:

- API-first backend (Laravel)
- Token-based auth (Sanctum)
- Admin panel
- React frontend
- Docker setup
- Real development workflow

---

## Settings / Permissions

- [ ] Add user language preferences (backend integration)
- [ ] Add language permissions per user
- [ ] Hide language switcher if only one language
- [ ] Sync allowed languages from backend
