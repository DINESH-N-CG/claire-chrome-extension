# 🛣️ Route Configuration Guide

## Overview

The Claire Chrome Extension now uses a **centralized, server-synchronized route configuration** similar to the Express.js server structure. All API routes are organized in `src/routes.ts` with complete type safety and helper functions.

---

## 📁 File Structure

```
src/
├── routes.ts                  # Centralized route configuration ⭐ NEW
├── routes.example.ts          # Usage examples and patterns ⭐ NEW
└── shared/
    └── api/
        └── apiClient.js       # Enhanced with route-based API methods
```

---

## 🎯 Key Features

### ✅ Centralized Configuration
- All routes defined in one place (`routes.ts`)
- Matches server-side route structure
- Easy to maintain and update

### ✅ Type Safety
- TypeScript constants with `as const`
- Autocomplete support in IDEs
- Compile-time error checking

### ✅ Helper Functions
- `getApiUrl()` - Build full API URLs
- `buildPath()` - Replace route parameters
- `buildApiUrl()` - Combine both operations
- `getExtensionUrl()` - Get Chrome extension URLs

### ✅ Route Registry
- Metadata for each route (method, auth, CORS)
- Runtime validation support
- Documentation in code

---

## 📚 Route Categories

### 1. Extension Routes
Internal Chrome extension pages:
```typescript
EXTENSION_ROUTES.SIDEPANEL       // '/sidepanel.html'
EXTENSION_ROUTES.AUTH_CALLBACK   // '/auth-callback.html'
```

### 2. Authentication & Authorization
```typescript
API_ROUTES.SSO.LOGIN            // '/sso/login'
API_ROUTES.AUTH.IDENTITY        // '/auth/identity'
API_ROUTES.AUTH.LOGOUT          // '/auth/logout'
API_ROUTES.AUTH.SESSION         // '/auth/session'
```

### 3. User Management
```typescript
API_ROUTES.USER.BASE            // '/user'
API_ROUTES.USER.PROFILE         // '/user/profile'
API_ROUTES.USER.SETTINGS        // '/user/settings'
```

### 4. Project Management
```typescript
API_ROUTES.PROJECT.BASE         // '/project'
API_ROUTES.PROJECT.LIST         // '/project'
API_ROUTES.PROJECT.DETAIL       // '/project/:id'
API_ROUTES.PROJECT.CREATE       // '/project'
API_ROUTES.PROJECT.UPDATE       // '/project/:id'
API_ROUTES.PROJECT.DELETE       // '/project/:id'
```

### 5. Chat Routes
```typescript
API_ROUTES.CHAT.BASE            // '/chat'
API_ROUTES.CHAT.SEND            // '/chat'
API_ROUTES.CHAT.STREAM          // '/chat/stream'
API_ROUTES.APP.CHAT             // '/app/chat'
```

### 6. Development Routes
```typescript
API_ROUTES.DEV.USER_PERMISSIONS          // '/dev/user-permissions'
API_ROUTES.DEV.LLM                       // '/dev/llm'
API_ROUTES.DEV.JS_FUNCTION               // '/dev/js-function'
API_ROUTES.DEV.FLOW                      // '/dev/flow'
API_ROUTES.DEV.PIPELINE                  // '/dev/pipeline'
API_ROUTES.DEV.PYTHON_SCRIPT             // '/dev/python-script'
API_ROUTES.DEV.PERSONAL_ACCESS_TOKEN     // '/dev/personal-access-token'
API_ROUTES.DEV.KNOWLEDGE_GRAPH           // '/dev/knowledge-graph'
API_ROUTES.DEV.CHAT_HISTORY              // '/dev/chat-history'
```

### 7. Knowledge Management
```typescript
// Knowledge Base
API_ROUTES.KNOWLEDGE_BASE.LIST           // '/knowledge-base'
API_ROUTES.KNOWLEDGE_BASE.DETAIL         // '/knowledge-base/:id'
API_ROUTES.KNOWLEDGE_BASE.CREATE         // '/knowledge-base'

// Knowledge Database
API_ROUTES.KNOWLEDGE_DB.LIST             // '/knowledge-db'
API_ROUTES.KNOWLEDGE_DB.DETAIL           // '/knowledge-db/:id'
API_ROUTES.KNOWLEDGE_DB.CREATE           // '/knowledge-db'

// Collections
API_ROUTES.COLLECTION.LIST               // '/collection'
API_ROUTES.COLLECTION.DETAIL             // '/collection/:id'
API_ROUTES.COLLECTION.CREATE             // '/collection'
```

### 8. Plugin System
```typescript
API_ROUTES.PLUGIN.LIST                   // '/plugin'
API_ROUTES.PLUGIN.DETAIL                 // '/plugin/:id'
API_ROUTES.PLUGIN.CREATE                 // '/plugin'
API_ROUTES.PLUGIN.UPDATE                 // '/plugin/:id'
API_ROUTES.PLUGIN.DELETE                 // '/plugin/:id'
API_ROUTES.PLUGIN.EXECUTE                // '/plugin/:id/execute'
```

### 9. Pipeline Routes
```typescript
API_ROUTES.PIPELINE_APP.BASE             // '/pipeline-app'
API_ROUTES.PIPELINE_APP.EXECUTE          // '/pipeline-app/execute'
API_ROUTES.CUSTOM_FUNCTION.BASE          // '/function'
API_ROUTES.CUSTOM_FUNCTION.EXECUTE       // '/function/execute'
```

### 10. REST API Routes
```typescript
API_ROUTES.REST.PIPELINE.BASE            // '/rest/pipeline'
API_ROUTES.REST.PIPELINE.EXECUTE         // '/rest/pipeline/execute'
API_ROUTES.REST.PLUGIN.BASE              // '/rest/plugin'
API_ROUTES.REST.PLUGIN.EXECUTE           // '/rest/plugin/execute'
API_ROUTES.REST.KNOWLEDGE_DB.BASE        // '/rest/knowledge-db'
API_ROUTES.REST.KNOWLEDGE_DB.QUERY       // '/rest/knowledge-db/query'
API_ROUTES.REST.CHAT.BASE                // '/rest/chat'
API_ROUTES.REST.CHAT.SEND                // '/rest/chat'
```

---

## 🔧 Usage Examples

### Basic Usage

```javascript
import { API_ROUTES, getApiUrl } from './routes';

// Simple API URL
const chatUrl = getApiUrl(API_ROUTES.CHAT.SEND);
// Result: 'http://localhost:8080/chat'

const loginUrl = getApiUrl(API_ROUTES.SSO.LOGIN);
// Result: 'http://localhost:8080/sso/login'
```

### Routes with Parameters

```javascript
import { API_ROUTES, buildApiUrl } from './routes';

// Build URL with parameters
const projectUrl = buildApiUrl(API_ROUTES.PROJECT.DETAIL, { id: '123' });
// Result: 'http://localhost:8080/project/123'

const pluginUrl = buildApiUrl(API_ROUTES.PLUGIN.EXECUTE, { id: 'my-plugin' });
// Result: 'http://localhost:8080/plugin/my-plugin/execute'
```

### Using Enhanced API Client

```javascript
import { api } from './shared/api/apiClient';

// Authentication
await api.auth.checkIdentity();
await api.auth.logout();

// Projects
const projects = await api.project.list();
const project = await api.project.get('123');
await api.project.create({ name: 'New Project' });
await api.project.update('123', { name: 'Updated' });
await api.project.delete('123');

// Chat
await api.chat.send('Hello', 'project-123', []);
const history = await api.chat.getHistory('session-456');

// Plugins
const plugins = await api.plugin.list();
await api.plugin.execute('plugin-789', { input: 'data' });

// Knowledge Base
const kbs = await api.knowledgeBase.list();
await api.knowledgeBase.create({ name: 'KB1' });

// Collections
const collections = await api.collection.list();
```

### React Component Example

```javascript
import { useEffect, useState } from 'react';
import { api } from '../shared/api/apiClient';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await api.project.list();
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

### Advanced: Generic API Hook

```javascript
import { useState, useEffect } from 'react';
import { api } from '../shared/api/apiClient';

function useApiData(apiMethod, ...args) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await apiMethod(...args);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiMethod, JSON.stringify(args)]);

  return { data, loading, error };
}

// Usage:
function MyComponent() {
  const { data: projects, loading } = useApiData(api.project.list);
  const { data: plugins } = useApiData(api.plugin.list);
  
  // ...
}
```

---

## 🎨 Route Registry

The `ROUTE_REGISTRY` provides metadata for each route:

```typescript
export const ROUTE_REGISTRY = {
  SSO_LOGIN: { 
    path: API_ROUTES.SSO.LOGIN, 
    method: 'GET', 
    requiresAuth: false 
  },
  CHAT_SEND: { 
    path: API_ROUTES.CHAT.SEND, 
    method: 'POST', 
    requiresAuth: false, 
    corsEnabled: true 
  },
  PROJECT_LIST: { 
    path: API_ROUTES.PROJECT.LIST, 
    method: 'GET', 
    requiresAuth: true 
  },
  // ... more routes
};
```

### Using Route Registry

```javascript
import { ROUTE_REGISTRY } from './routes';

// Check if route requires authentication
const requiresAuth = ROUTE_REGISTRY.PROJECT_LIST.requiresAuth; // true

// Get HTTP method
const method = ROUTE_REGISTRY.CHAT_SEND.method; // 'POST'

// Check CORS
const corsEnabled = ROUTE_REGISTRY.CHAT_SEND.corsEnabled; // true
```

---

## 🔄 Migration Guide

### Before (Old Way)
```javascript
// Hardcoded URLs scattered throughout code
const response = await fetch('http://localhost:8080/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' })
});

const projects = await fetch('http://localhost:8080/project');
const projectDetail = await fetch(`http://localhost:8080/project/${id}`);
```

### After (New Way)
```javascript
// Using centralized routes
import { api } from './shared/api/apiClient';

const response = await api.chat.send('Hello', projectId);
const projects = await api.project.list();
const projectDetail = await api.project.get(id);
```

---

## 🚀 Benefits

### 1. **Maintainability**
- One place to update routes
- Changes propagate automatically
- No scattered hardcoded URLs

### 2. **Type Safety**
- TypeScript autocomplete
- Compile-time checks
- Prevent typos in URLs

### 3. **Consistency**
- Matches server-side structure
- Easy to understand for backend devs
- Clear organization

### 4. **Discoverability**
- All routes visible in one file
- Easy to find what's available
- Self-documenting code

### 5. **Testing**
- Easy to mock routes
- Consistent API interface
- Better test coverage

---

## 📝 Best Practices

### ✅ DO

```javascript
// ✅ Use the API client
import { api } from './shared/api/apiClient';
await api.chat.send(message, projectId);

// ✅ Use route constants
import { API_ROUTES, buildApiUrl } from './routes';
const url = buildApiUrl(API_ROUTES.PROJECT.DETAIL, { id: projectId });

// ✅ Use helper functions
const fullUrl = getApiUrl(API_ROUTES.CHAT.SEND);
```

### ❌ DON'T

```javascript
// ❌ Don't hardcode URLs
const url = 'http://localhost:8080/chat';

// ❌ Don't build URLs manually
const url = `${baseUrl}/project/${id}`;

// ❌ Don't duplicate route definitions
const CHAT_URL = '/chat'; // Already in routes.ts
```

---

## 🔧 Configuration

### Environment Variables

Set `REACT_APP_API_BASE_URL` in your `.env` file:

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:8080

# .env.production
REACT_APP_API_BASE_URL=https://api.claire.complianceg.com
```

The route configuration will automatically use the correct base URL.

---

## 📖 Complete API Reference

### Available API Modules

```javascript
import { api } from './shared/api/apiClient';

// All available APIs:
api.auth          // Authentication APIs
api.project       // Project management
api.chat          // Chat functionality
api.knowledgeBase // Knowledge base management
api.knowledgeDb   // Knowledge database operations
api.plugin        // Plugin system
api.collection    // Collection management
api.dev           // Development APIs
api.rest          // REST API routes
```

### API Methods by Module

**Auth API**
- `api.auth.checkIdentity()` - Check authentication status
- `api.auth.logout()` - Logout user
- `api.auth.getSsoLoginUrl()` - Get SSO login URL

**Project API**
- `api.project.list()` - List all projects
- `api.project.get(id)` - Get project details
- `api.project.create(data)` - Create new project
- `api.project.update(id, data)` - Update project
- `api.project.delete(id)` - Delete project

**Chat API**
- `api.chat.send(message, projectId, attachments)` - Send message
- `api.chat.getHistory(sessionId)` - Get chat history

**Plugin API**
- `api.plugin.list()` - List all plugins
- `api.plugin.get(id)` - Get plugin details
- `api.plugin.create(data)` - Create plugin
- `api.plugin.update(id, data)` - Update plugin
- `api.plugin.delete(id)` - Delete plugin
- `api.plugin.execute(id, payload)` - Execute plugin

---

## 🎓 Examples

For complete usage examples, see:
- **`src/routes.example.ts`** - 20+ code examples
- **`src/shared/api/apiClient.js`** - Enhanced API client
- **Component files** - Real-world usage in React components

---

## 🔗 Server Synchronization

The routes are organized to **match the Express.js server structure**:

| Extension Route | Server Route | Purpose |
|----------------|--------------|---------|
| `API_ROUTES.SSO.LOGIN` | `app.use("/sso", ssoRouter)` | SSO Authentication |
| `API_ROUTES.AUTH.IDENTITY` | `app.use("/auth", identityRouter)` | Identity Check |
| `API_ROUTES.PROJECT.BASE` | `app.use("/project", projectRouter)` | Project Management |
| `API_ROUTES.CHAT.BASE` | `app.use("/chat", chatRouter)` | Chat Functionality |
| `API_ROUTES.DEV.*` | `app.use("/dev/*", ...)` | Development APIs |
| `API_ROUTES.REST.*` | `app.use("/rest/*", ...)` | REST APIs |

---

## 📚 Additional Resources

- **Server Code**: Review `server/index.ts` for backend routes
- **API Documentation**: Check API docs for endpoint details
- **Type Definitions**: See TypeScript interfaces in route registry

---

## ✅ Summary

✅ **Centralized** - All routes in one place  
✅ **Type-Safe** - TypeScript support  
✅ **Organized** - Matches server structure  
✅ **Maintainable** - Easy to update  
✅ **Discoverable** - Clear and documented  
✅ **Consistent** - Unified API client  

**Your extension now has production-ready route management!** 🚀
