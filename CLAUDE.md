# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A flashcard application with a FastAPI backend (Python/SQLite) and React/TypeScript frontend (Vite), fully containerized with Docker.

## Development Environment

All development is done through Docker Compose. Ensure Docker Desktop is running before starting.

### Starting the Application

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

### Stopping the Application

```bash
docker-compose down
```

### Rebuilding After Changes

```bash
# Rebuild specific service
docker-compose build api
docker-compose build spa

# Or rebuild everything
docker-compose up --build
```

### Running Commands Inside Containers

```bash
# Backend container
docker exec -it simpleflashcard-api bash

# Frontend container
docker exec -it simpleflashcardub-spa bash
```

### Backend Development

The backend uses hot reload in development mode. Changes to Python files in `app/` are automatically detected.

To reinitialize the database:
```bash
docker exec -it simpleflashcard-api python initDb.py
```

### Frontend Development

The frontend has hot reload enabled. Changes to files in `spa/src/` automatically update in the browser.

Frontend scripts (run inside container or locally if Node.js installed):
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Backend Structure (`/app`)

The backend is a monolithic FastAPI application in `main.py`:

- **Database**: SQLite (`db.db`) with direct SQL queries
- **Connection**: Dependency injection via `get_db()` function
- **Models**: Pydantic models for request/response validation
- **Router**: All endpoints under `/api` prefix
- **Resources**: Collections and Cards with full CRUD operations

Database schema initialized in `initDb.py`:
- `Collections`: id, name, createdOn, isFavorite, color
- `Cards`: id, entry, value, hint, createdOn, collectionId

Backend follows these patterns:
- Use Pydantic models for validation
- Database connections via dependency injection with `Depends(get_db)`
- Return dict objects directly from SQLite Row results
- Raise HTTPException for error responses

### Frontend Structure (`/spa/src`)

The frontend follows a service layer architecture:

```
src/
├── api/
│   └── client.ts           # Axios client configuration
├── services/
│   ├── collectionService.ts  # Collections API calls
│   └── cardService.ts        # Cards API calls
├── models/
│   ├── Collection.ts         # TypeScript interfaces
│   └── Card.ts
├── pages/                    # Route components
├── components/               # Reusable components
└── main.tsx                  # App entry point
```

Frontend patterns:
- **API Client**: Axios instance in `api/client.ts` with base URL `/api`
- **Services**: Typed functions wrapping API calls (e.g., `getCollections()`, `createCard()`)
- **Models**: TypeScript interfaces matching backend Pydantic models
- **Proxy**: Vite dev server proxies `/api` requests to backend

When adding new API endpoints:
1. Add endpoint in backend `main.py` with Pydantic models
2. Create/update TypeScript interface in `src/models/`
3. Add service function in `src/services/`
4. Use service function in components/pages

### API Communication

The frontend communicates with the backend via:
- Development: Vite proxy (`/api` → `http://api:8000`)
- API base: All endpoints prefixed with `/api`
- Format: JSON request/response bodies

### Environment Variables

Configure via `.env` file (copy from `.env.example`):
- `API_PORT`: Backend API port (default: 8000)

Frontend receives `VITE_API_URL` via docker-compose but proxies through Vite's dev server.

## Testing

No test framework is currently configured. When adding tests:
- Backend: Use pytest with FastAPI's TestClient
- Frontend: Use Vitest (already configured with Vite)

## Additional Resources

See documentation in `/docs`:
- `development-workflow.md`: Development workflow details
- `production-strategy.md`: Production deployment strategy
