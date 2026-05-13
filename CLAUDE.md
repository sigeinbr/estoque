# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Estoque** is a full-stack inventory management application with:
- **Frontend**: Angular 17 SPA with PrimeNG UI components
- **Backend**: NestJS REST API with PostgreSQL database
- **Architecture**: Modular monorepo with separate frontend and api directories

The application handles user authentication, access control via groups/permissions, modules, UGs (organizational units), menus, and access logging.

## Repository Structure

```
estoque/
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── _auth/         # JWT authentication, guards
│   │   ├── _shared/       # DTOs, utilities, decorators, pagination
│   │   ├── usuarios/      # User management (entities: usuario, usuario-menu, usuario-ug, usuario-modulo)
│   │   ├── grupos-permissoes/  # Permission groups
│   │   ├── modulos/       # Module management
│   │   ├── menus/         # Menu management
│   │   ├── ugs/           # Organizational units
│   │   ├── log-acessos/   # Access logging
│   │   ├── tokens/        # Token management
│   │   ├── consultas/     # Queries/reports
│   │   └── relatorios/    # Reports
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   └── nest-cli.json
│
├── frontend/              # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── _shared/   # Interceptors, services, components, utilities
│   │   │   │   ├── services/api/  # HTTP clients (including _auth)
│   │   │   │   └── interceptors/  # JWT token interceptor
│   │   │   ├── _pages/    # Page components (e.g., login)
│   │   │   ├── _dashboard/ # Dashboard components
│   │   │   └── app-routing.module.ts
│   │   └── environments/  # Environment configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── angular.json
│   └── dist/              # Build output
│
└── .env                   # Database, JWT, email, and API URL configuration
```

## Technology Stack

### Backend (API)
- **NestJS** 10.x - Framework
- **TypeORM** 0.3.x - ORM with PostgreSQL driver
- **JWT** (@nestjs/jwt 10.x) - Authentication
- **bcrypt** - Password hashing
- **nodemailer** - Email sending
- **class-validator / class-transformer** - DTO validation
- **luxon** - DateTime handling
- **Jest** - Testing

### Frontend
- **Angular** 17.x - Framework
- **PrimeNG** 17.x - UI component library
- **PrimeFlex** - CSS utilities
- **RxJS** 7.8.x - Reactive programming
- **TypeScript** 5.4.x

### Development
- **ESLint** + **Prettier** (both projects) - Code quality
- **Karma** + **Jasmine** (frontend) - Unit testing

## Key Commands

### Backend (api/)
```bash
# Development
npm run start              # Start with hot reload (watch mode)
npm run start:debug        # Debug mode with watch

# Build & Production
npm run build              # Compile TypeScript to dist/
npm run start:prod         # Run compiled app

# Code Quality
npm run lint               # ESLint with --fix
npm run format             # Prettier format

# Testing
npm run test               # Run Jest suite
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:debug         # Debug tests
npm run test:e2e           # End-to-end tests
```

### Frontend (frontend/)
```bash
# Development
npm start                  # Dev server on http://0.0.0.0:4200
npm run watch              # Continuous build for development

# Build
npm run build              # Production build to dist/frontend/

# Testing
npm run test               # Run Karma/Jasmine tests
```

## Architecture Patterns

### Authentication Flow
1. **LoginAuthDto** sent to `/auth/login` endpoint
2. **AuthService** validates credentials, returns JWT token
3. Frontend stores token (handled by **JwtTokenInterceptor**)
4. **AuthGuard** (global, APP_GUARD) validates token on protected routes
5. **@Public()** decorator marks routes that bypass authentication

### Database Design
- **PostgreSQL** as primary database
- **TypeORM** entities with `autoLoadEntities: true`
- Schema synchronization disabled (`synchronize: false`)
- Entities auto-loaded from `src/**/*.entity.ts` pattern

### Frontend State & Services
- **AppConfigService** initializes app configuration via APP_INITIALIZER
- **HTTP Interceptor** (JwtTokenInterceptor) automatically attaches JWT to requests
- **PrimeNG MessageService** for toast notifications
- **Locale** set to Portuguese (PT-BR)

### API Response Pattern
- Standardized response models in `_shared/models/`
- Pagination utilities in `_shared/pagination/`
- DTOs for request/response validation
- Global ValidationPipe on NestJS app

### CORS & Validation
- CORS enabled globally in NestJS
- Global ValidationPipe for DTO validation
- JSON payload limit set to 20mb

## Environment Variables

Located in `/api/.env` (referenced by NestJS app.module.ts):
- `DB_HOST, DB_PORT, DB_DATABASE` - PostgreSQL connection
- `DB_SIS_USERNAME, DB_SIS_PASSWORD` - Database credentials
- `JWT_SECRET, JWT_EXPIRATION_TIME` - Token configuration
- `EMAIL_USER, EMAIL_PASSWORD` - Email service credentials
- `URL_FRONT_ESTOQUE, URL_API_ADM` - External URLs

Frontend environment files: `frontend/src/environments/`

## Development Workflow

### Adding a New API Module
1. Create folder in `api/src/{module-name}/`
2. Generate with NestJS CLI: `nest generate resource {module-name}`
3. Create entity, DTO, service, controller
4. Import module in `app.module.ts`
5. Add TypeORM import for entities

### Adding a Frontend Feature
1. Create component/service in `frontend/src/app/`
2. Use PrimeNG components for UI
3. Inject API services for backend calls
4. Handle errors through MessageService

### Running Both Services Locally
1. Ensure PostgreSQL is running (configured in .env)
2. Terminal 1: `cd api && npm run start`
3. Terminal 2: `cd frontend && npm start`
4. Frontend accesses API via configured URLs

## Testing

### API Tests
- Unit tests: `api/src/**/*.spec.ts`
- E2E tests: `api/test/jest-e2e.json`
- Run with `npm run test:watch` for development

### Frontend Tests
- Tests: `frontend/src/**/*.spec.ts`
- Run with `npm run test`

## Important Notes

- API listens on port **3000** by default
- Frontend dev server listens on **4200**
- JWT tokens expire after 30 minutes (JWT_EXPIRATION_TIME)
- All database operations use TypeORM with PostgreSQL
- Frontend uses strict TypeScript mode (tsconfig.json)
- Backend uses more permissive TS settings for flexibility
- PrimeNG requires Bootstrap CSS (handled via primeflex/primeicons dependencies)
