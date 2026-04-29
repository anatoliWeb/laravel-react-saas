# TODO.md — Laravel + React SaaS Dashboard

> Goal: Build a portfolio-grade mini SaaS system demonstrating clean architecture, API-first design, token-based auth, and a lightweight admin panel.

---

## Phase 0 — Project Initialization

- [x] Step 1: Create repository and initialize README, TODO.md, .gitignore
- [x] Step 2: Define project structure (backend, frontend, docker, docs)
- [x] Step 3: Add .editorconfig and basic coding standards
- [x] Step 4: Setup initial Git commit with clean structure

---

## Phase 1 — Docker & Environment

- [x] Step 5: Create docker-compose.yml (PHP, Nginx, Node)
- [x] Step 6: Configure Nginx for Laravel backend
- [x] Step 7: Setup Laravel container (PHP-FPM)
- [x] Step 8: Setup Node container for React
- [x] Step 9: Add .env.example with base config
- [x] Step 10: Verify project runs with docker-compose up

---

## Phase 2 — Laravel Backend (API)

- [x] Step 11: Initialize Laravel project in /backend
- [x] Step 12: Configure API routes file
- [x] Step 13: Create UsersController (stub)
- [x] Step 14: Create StatsController (stub)
- [x] Step 15: Add GET /api/users endpoint (mocked data)
- [x] Step 16: Add GET /api/stats endpoint (mocked data)

---

## Phase 3 — Backend Structure

- [x] Step 17: Create Services layer (UserService, StatsService)
- [x] Step 18: Move logic from controllers into services
- [X] Step 19: Add DTOs or simple data structures
- [X] Step 20: Add basic error handling (try/catch + logs)

---

## Phase 4 — Authentication (Sanctum)

- [ ] Step 21: Install Laravel Sanctum
- [ ] Step 22: Configure token-based authentication
- [ ] Step 23: Create endpoint for issuing tokens
- [ ] Step 24: Protect API routes with auth middleware
- [ ] Step 25: Test API with Bearer token

---

## Phase 5 — Admin Panel (Laravel)

- [ ] Step 26: Create /admin route group
- [ ] Step 27: Setup simple admin layout (Blade or Livewire)
- [ ] Step 28: Create Users management page (list only)
- [ ] Step 29: Create Token management page
- [ ] Step 30: Add create/delete token functionality

---

## Phase 6 — React Frontend

- [ ] Step 31: Initialize React app (Vite)
- [ ] Step 32: Setup folder structure (pages, components, services)
- [ ] Step 33: Create API client (axios/fetch wrapper)
- [ ] Step 34: Create Dashboard page
- [ ] Step 35: Fetch /api/stats and display data
- [ ] Step 36: Create Users page
- [ ] Step 37: Fetch /api/users and display list

---

## Phase 7 — Frontend Improvements

- [ ] Step 38: Add loading states
- [ ] Step 39: Add error handling (API failures)
- [ ] Step 40: Add simple UI styling (cards, layout)
- [ ] Step 41: Store API token (local storage or env)

---

## Phase 8 — Integration

- [ ] Step 42: Connect frontend to backend via Docker network
- [ ] Step 43: Test full flow (token → API → UI)
- [ ] Step 44: Fix CORS issues if needed
- [ ] Step 45: Validate endpoints via frontend

---

## Phase 9 — Logging & Stability

- [ ] Step 46: Add Laravel logging (errors, API calls)
- [ ] Step 47: Add simple request logging middleware
- [ ] Step 48: Handle edge cases (empty data, failures)

---

## Phase 10 — Documentation

- [ ] Step 49: Complete README.md (overview, stack, run steps)
- [ ] Step 50: Add architecture.md in /docs
- [ ] Step 51: Document API endpoints with examples
- [ ] Step 52: Add “Why this stack” section

---

## Phase 11 — Polish & Portfolio Ready

- [ ] Step 53: Clean code and remove debug logs
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
"""

file_path = "/mnt/data/TODO.md"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

file_path