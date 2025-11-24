# Claire Chrome Extension - Project Structure

This document explains the organizational structure of the Claire Chrome Extension codebase.

## Directory Structure

```
src/
├── core/                    # Shared/reusable code across all features
│   ├── constants.ts         # App-wide constants (API config, timing, storage keys)
│   ├── helpers.ts           # Utility functions (formatText, truncate, debounce, etc.)
│   ├── hooks.ts             # Re-exports of all custom hooks for convenience
│   ├── components/          # Reusable UI components (future)
│   └── index.ts             # Barrel export for core module
│
├── features/                # Feature-based organization
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth-specific components (LoginPage)
│   │   ├── hooks/           # Auth hooks (useAuth)
│   │   └── index.ts         # Feature barrel export
│   │
│   ├── chat/                # Chat feature
│   │   ├── components/      # Chat components (ChatInput, ChatMessages, Message, etc.)
│   │   ├── hooks/           # Chat hooks (useChat, useSelectedText)
│   │   └── index.ts         # Feature barrel export
│   │
│   ├── chatHistory/         # Chat history/sessions feature
│   │   ├── components/      # History components (Sidebar)
│   │   ├── hooks/           # History hooks (useChatSessions)
│   │   └── index.ts         # Feature barrel export
│   │
│   ├── projects/            # Projects feature
│   │   ├── hooks/           # Project hooks (useProjects)
│   │   └── index.ts         # Feature barrel export
│   │
│   └── welcome/             # Welcome screen feature
│       ├── components/      # Welcome components (WelcomeGreeting)
│       └── index.ts         # Feature barrel export
│
├── layout/                  # Layout components
│   ├── Header/              # Header layout component
│   └── index.js             # Layout barrel export
│
├── shared/                  # Shared utilities (legacy, being migrated to core/)
│   ├── api/                 # API client
│   ├── hooks/               # Shared hooks
│   └── config.js            # Configuration (uses core/constants)
│
├── styles/                  # Global styles
│   ├── App.css              # Main app styles
│   └── ProjectDropdown.css  # Project dropdown styles
│
├── routes.ts                # Centralized route configuration
├── App.jsx                  # Main application component
└── sidepanel.jsx            # Extension sidepanel entry point
```

## Key Principles

### 1. Feature-Based Organization
Each feature has its own directory containing:
- `components/` - Feature-specific UI components
- `hooks/` - Feature-specific custom hooks
- `index.ts` - Barrel export for clean imports

### 2. Barrel Exports Pattern
Every directory has an `index.ts`/`index.js` file that re-exports public items:

```typescript
// Instead of:
import { LoginPage } from './features/auth/components/LoginPage/LoginPage';

// Use:
import { LoginPage } from './features/auth';
```

### 3. Centralized Constants
All configuration values, API endpoints, and magic numbers are in `core/constants.ts`:

```typescript
import { API_CONFIG, TIMING, STORAGE_KEYS } from './core/constants';
```

### 4. Utility Functions
Common helper functions are in `core/helpers.ts`:

```typescript
import { truncateText, formatFileSize, debounce } from './core/helpers';
```

### 5. Centralized Routes
Route paths are defined in `routes.ts`:

```typescript
import { ROUTES, getApiUrl } from './routes';
```

## Component Structure

Each component follows this pattern:

```
ComponentName/
├── index.ts              # Exports component
├── ComponentName.tsx     # Component implementation
└── ComponentName.css     # Component styles (co-located)
```

## Import Guidelines

1. **Core imports** (most common):
   ```typescript
   import { API_CONFIG, truncateText } from './core';
   ```

2. **Feature imports**:
   ```typescript
   import { useAuth, LoginPage } from './features/auth';
   import { ChatInput, useChat } from './features/chat';
   ```

3. **Layout imports**:
   ```typescript
   import { Header } from './layout';
   ```

## Naming Conventions

- **Components**: PascalCase (e.g., `ChatInput.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utilities**: camelCase (e.g., `helpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONFIG`)
- **Directories**: camelCase (e.g., `chatHistory/`)

## Migration Notes

The project is transitioning from `shared/` to `core/` for better organization:
- ✅ Constants centralized in `core/constants.ts`
- ✅ Helpers centralized in `core/helpers.ts`  
- ✅ Hooks re-exported in `core/hooks.ts`
- ⏳ API client still in `shared/api/` (future: move to `core/api/`)

## Development Workflow

1. **Adding a new feature**: Create a folder in `features/` with components and hooks subdirectories
2. **Adding a reusable component**: Place in `core/components/`
3. **Adding a utility function**: Add to `core/helpers.ts`
4. **Adding a constant**: Add to `core/constants.ts`
5. **Always create barrel exports**: Add `index.ts` files for clean imports

## File Extensions

- `.ts` - TypeScript files (constants, helpers, types)
- `.tsx` - TypeScript React components
- `.js` - JavaScript files (legacy, being migrated)
- `.jsx` - JavaScript React components (legacy, being migrated)
- `.css` - Component styles
- `.scss` - Sass styles (if used)
