# Laravel + React SaaS Dashboard

Українська документація. Англійська версія: [README.md](./README.md)

## Огляд

Цей проєкт симулює реальну SaaS-архітектуру, де Laravel API обслуговує окремий React SPA фронтенд.

Його мета — показати інженерний підхід рівня production, а не базовий CRUD:
- API-first backend із чіткими контрактами
- RBAC-контроль доступу та permission-aware UI
- централізоване логування активностей для аудиту
- модульна frontend-архітектура з перевикористовуваними UI-системами

Проєкт демонструє, як backend і frontend масштабуються разом у monorepo.

## Функціональність

### Backend
- API-first архітектура (Laravel)
- RBAC (ролі та дозволи)
- Система логування активностей (service + observers)
- Валідація вхідних даних через FormRequest
- Service layer для розділення бізнес-логіки
- Токен-автентифікація через Sanctum

### Frontend
- React SPA на Vite
- Захищений і permission-aware рендеринг UI
- Глобальний loader для async-операцій
- Модальна форма з обробкою 422 помилок
- Перевикористовуваний DataTable (пошук, сортування, пагінація, дії)
- i18n підтримка (EN / UK / DE)

## Архітектура

### Потік запиту
`Controller -> Service -> Model -> JSON response`

- Контролери містять лише HTTP-рівень.
- Сервіси містять бізнес-логіку та правила змін.
- Моделі відповідають за збереження і зв’язки.
- FormRequest фіксує вхідні контракти.

### Розділення відповідальностей
- Backend API-first і придатний для різних клієнтів.
- Frontend працює з API через окремі service-модулі.
- RBAC забезпечується на двох рівнях:
  - backend middleware/authorization (джерело істини)
  - frontend conditional rendering (UX-рівень)

### Логування активностей
- `ActivityService` — центральна точка логування.
- Model observers автоматизують логування ключових подій.
- Dashboard-статистика може використовувати recent activity.

### DTO-підхід
- DTO-подібне формування відповіді зберігає передбачуваний контракт API для UI.

## Стек

### Backend
- PHP 8.3+
- Laravel 13
- Laravel Sanctum

### Frontend
- React (Vite)
- SCSS
- i18next

### Інфраструктура
- Docker Compose
- Nginx
- MySQL 8
- Redis 7

## Безпека

- Токен-автентифікація через Sanctum
- Хешування паролів стандартним Laravel hashing layer
- Validation-first стратегія API через FormRequest
- RBAC enforcement через permission middleware
- Frontend приховує заборонені дії, але backend завжди перевіряє авторизацію
- Захист логіну побудований навколо централізованої auth-логіки і валідації

## Розробка

### Frontend
- Код: `frontend/`
- Entry point: `frontend/src/main.jsx`
- API-шар: `frontend/src/services/`
- i18n-файли: `frontend/src/i18n/locales/`

### Backend
- Код: `backend/`
- API-роути: `backend/routes/api.php`
- Сервіси: `backend/app/Services/`
- Request-класи: `backend/app/Http/Requests/`

### Конфігурація
- Кореневий `.env` використовується Docker-сервісами
- Приклад backend env: `backend/.env.example`
- Базовий URL API для frontend: `VITE_API_BASE_URL`

## Запуск проєкту

1. Клонувати репозиторій
```bash
git clone <repository_url>
cd laravel-react
```

2. Створити файл середовища в корені
```bash
cp .env.example .env
```

3. Підняти Docker-сервіси
```bash
docker compose up -d
```

4. Відкрити сервіси
- Frontend: `http://localhost:5173`
- Backend (Nginx): `http://localhost:8080`
- API приклад: `http://localhost:8080/api/users`

## Нотатки по середовищу

Сервіси з `docker-compose.yml`:
- `backend` (php-fpm)
- `nginx`
- `frontend` (Vite dev server)
- `mysql`
- `redis`
- `websocket` (резерв під realtime/dev задачі)

Важливо:
- Хост БД всередині контейнерів має відповідати Docker-сервісу (`mysql`).
- Порти керуються через `.env` (`APP_PORT`, `FRONT_PORT`).
- Backend і frontend підключені як volumes для live-розробки.

## Тестування

У проєкті є feature-тести для критичних backend-сценаріїв (users API, meta, activity logging, auth API).

Запуск тестів у backend контейнері:
```bash
docker compose exec -T backend php artisan test
```

Локально (якщо встановлено PHP):
```bash
cd backend
php artisan test
```

## Скриншоти

Плейсхолдери (замінити на реальні зображення):
- Dashboard overview
- Users DataTable
- Create/Edit user modal

## Структура проєкту

```text
/backend      Laravel API + backend-логіка адмінки
/frontend     React SPA
/docker       Dockerfiles та nginx-конфігурація
/docs         Додаткова документація
TODO.md       Покроковий план розробки
README.md     Англійська документація
README_UA.md  Українська документація
```

## Документація

- План розробки: [TODO.md](./TODO.md)
- Нотатки по архітектурі: [docs/architecture.md](./docs/architecture.md)
- Довідник команд: [docs/commands.md](./docs/commands.md)

## Підхід до розробки

- Feature-based commits
- Невеликі й тестовані кроки з `TODO.md`
- Чіткі commit messages з ясним scope

Приклади:
- `feat(users): add roles and permissions sync in API`
- `fix(frontend): handle users fetch retry and empty states`

## Подальший розвиток

- Додати повну API документацію (OpenAPI/Swagger)
- Розширити e2e покриття SPA-сценаріїв
- Додати фільтрацію/експорт audit-логів
- Додати CI quality gates (lint + tests + build)
- Завершити production deployment docs

## Ліцензія

MIT License. Деталі у [LICENSE](./LICENSE).
