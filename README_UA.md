# Laravel + React SaaS Dashboard

## Мова

- 🇺🇦 Українська (поточна)
- 🇬🇧 English (./README.md)

## Опис

Цей проєкт демонструє сучасний підхід до розробки веб-додатків з використанням архітектури API-first.

Система побудована з чітким розділенням між backend (Laravel) та frontend (React), що забезпечує масштабованість, гнучкість та зручність підтримки.

---

## Архітектура

Система складається з двох основних частин:

### Backend (Laravel)
- Бізнес-логіка
- REST API
- Авторизація та токени
- Адмін-панель

### Frontend (React)
- Інтерфейс користувача
- Взаємодія з API
- Відображення даних

### Взаємодія
- HTTP + JSON
- Авторизація через Bearer Token

---

## Технології

### Backend
- PHP 8+
- Laravel
- Laravel Sanctum

### Frontend
- React (Vite)
- Axios / Fetch

### Інфраструктура
- Docker
- Nginx

---

## Функціонал

- API-first підхід
- Токенна авторизація
- Адмін-панель для керування доступом
- Розділення логіки (Controller / Service)
- Docker-оточення

---

## API (приклад)

```
GET /api/users
GET /api/stats
```

### Приклад відповіді

```json
{
  "users": [
    { "id": 1, "name": "Іван" },
    { "id": 2, "name": "Марія" }
  ]
}
```

---

## Авторизація

```
Authorization: Bearer YOUR_TOKEN
```

Токени створюються через адмін-панель.

---

## Як запустити

1. Клонувати репозиторій

```
git clone <repo>
cd project
```

2. Створити .env

```
cp .env.example .env
```

3. Запустити Docker

```
docker-compose up -d
```

---

## Структура

```
/backend
/frontend
/docker
/docs
```

---

## Документація

- Архітектура: [docs/architecture.md](./docs/architecture.md)
- Команди: [docs/commands.md](./docs/commands.md)
- План розробки: [TODO.md](./TODO.md)

---

## Примітки

- Проєкт демонструє підхід до побудови систем
- Основний акцент — структура та архітектура
- Логіка спрощена для наочності

---

## Подальший розвиток

- База даних
- Ролі та доступи
- Логування
- Моніторинг

## Ліцензія

MIT License

Див. файл [LICENSE](./LICENSE) для деталей.