# Claire Chrome Extension - Complete Flow Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Extension Lifecycle](#extension-lifecycle)
4. [Component Flow](#component-flow)
5. [Authentication Flow](#authentication-flow)
6. [Chat Flow](#chat-flow)
7. [Text Selection Flow](#text-selection-flow)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Build & Deployment](#build--deployment)

---

## Overview

**Claire** is a Chrome extension that provides an AI assistant accessible via a side panel. It allows users to:
- Chat with an AI assistant
- Select text on any webpage and ask questions about it
- Manage chat history and sessions
- Switch between multiple projects
- Authenticate via SSO

### Tech Stack
- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.3.3
- **Styling**: CSS + Bootstrap 5.3.8
- **Icons**: FontAwesome
- **HTTP Client**: Axios 1.13.2
- **Extension API**: Chrome Manifest V3

---

## Architecture

### File Structure
```
claire-chrome-extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (background script)
├── content.js                 # Content script (injected into pages)
├── content.css                # Content script styles
├── sidepanel.html            # Side panel entry point
├── auth-callback.html        # SSO authentication callback page
├── vite.config.js            # Build configuration
├── package.json              # Dependencies
│
├── src/                      # React application source
│   ├── App.jsx               # Main application component
│   ├── sidepanel.jsx         # Side panel entry point
│   ├── routes.ts             # Route configuration
│   │
│   ├── core/                 # Shared utilities
│   │   ├── constants.ts      # App constants
│   │   ├── helpers.ts        # Utility functions
│   │   ├── hooks.ts          # Hook re-exports
│   │   ├── components/       # Reusable components
│   │   └── index.ts          # Barrel export
│   │
│   ├── features/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── chat/            # Chat functionality
│   │   ├── chatHistory/     # Chat sessions
│   │   ├── projects/        # Project management
│   │   └── welcome/         # Welcome screen
│   │
│   ├── layout/              # Layout components
│   │   └── Header/          # Header with navigation
│   │
│   ├── shared/              # Shared utilities (legacy)
│   │   ├── api/             # API client
│   │   ├── hooks/           # Shared hooks
│   │   └── config.js        # Configuration
│   │
│   └── styles/              # Global styles
│       ├── App.css
│       └── ProjectDropdown.css
│
├── icons/                    # Extension icons
│   ├── claire-logo.svg
│   ├── claire-logo-16px.png
│   ├── claire-logo-48px.png
│   └── claire-logo-128px.png
│
└── dist/                     # Build output (generated)
```

---

## Extension Lifecycle

### 1. Installation Flow
```
User installs extension
    ↓
chrome.runtime.onInstalled triggered (background.js)
    ↓
Initialize storage:
  - enabled: true
  - firstRun: true
  - lastActivityTime: Date.now()
    ↓
Set side panel behavior (open on icon click)
    ↓
Inject content script into all existing tabs
    ↓
Start inactivity monitoring (30s interval)
```

### 2. Startup Flow
```
Browser starts
    ↓
chrome.runtime.onStartup triggered (background.js)
    ↓
Set side panel behavior
    ↓
Start inactivity monitoring
```

### 3. Update Flow
```
Extension updated
    ↓
chrome.runtime.onInstalled (reason: 'update')
    ↓
Set side panel behavior
    ↓
Re-inject content scripts
    ↓
Start inactivity monitoring
```

---

## Component Flow

### Main Application Flow (App.jsx)

```
App Component Mount
    ↓
Check authentication (useAuth hook)
    ├─ Not Authenticated → Show LoginPage
    └─ Authenticated → Continue
         ↓
    Initialize hooks:
      - useChat (conversation history, send message)
      - useSelectedText (text selection from content script)
      - useChatSessions (chat history)
      - useProjects (project management)
      - useInactivity (activity monitoring)
         ↓
    Render UI:
      ├─ Sidebar (chat sessions)
      ├─ Header (logo, project dropdown, refresh button)
      ├─ ChatMessages (conversation display)
      ├─ ChatInput (user input, file upload)
      └─ InactivityNotice (if inactive)
```

### Component Hierarchy
```
App
├── Sidebar (chat sessions list)
│   └── Session items (clickable)
│
├── Header
│   ├── Menu button (toggle sidebar)
│   ├── Logo
│   ├── Project dropdown
│   └── Refresh button (new chat)
│
├── ChatMessages
│   ├── WelcomeGreeting (if no messages)
│   ├── Message[] (user/assistant messages)
│   │   ├── User message (with optional context)
│   │   └── Assistant message
│   └── TypingIndicator (when processing)
│
├── ChatInput
│   ├── Plus button (file upload)
│   ├── Textarea (message input)
│   ├── Send button
│   └── Attachment preview (if file attached)
│
└── InactivityNotice (overlay when inactive)
```

---

## Authentication Flow

### SSO Login Flow
```
1. User clicks "Sign in with SSO" (LoginPage)
     ↓
2. handleLogin() opens new tab: http://localhost:8080/sso/login
     ↓
3. User completes SSO on backend
     ↓
4. Backend redirects to: chrome-extension://[ID]/auth-callback.html?status=success
     ↓
5. auth-callback.html:
   - Sends AUTH_SUCCESS message to background script
   - Sets isAuthenticated: true in storage
   - Closes after 2 seconds
     ↓
6. background.js receives AUTH_SUCCESS:
   - Opens side panel
   - User now authenticated
     ↓
7. App.jsx detects isAuthenticated change:
   - Loads main UI
   - Fetches user identity from /auth/identity
```

### Authentication Failure Flow
```
1. Backend redirects to: chrome-extension://[ID]/auth-callback.html?status=error&error=message
     ↓
2. auth-callback.html:
   - Shows error message
   - Sends AUTH_FAILURE message
   - Clears authentication data
   - Closes after 3 seconds
     ↓
3. background.js receives AUTH_FAILURE:
   - Removes isAuthenticated from storage
   - Opens side panel (shows LoginPage)
```

### Authentication Check
```
App loads
    ↓
useAuth hook executes
    ↓
Call GET /auth/identity (with credentials)
    ├─ Success → Set isAuthenticated: true, store user data
    └─ Failure → Set isAuthenticated: false, show LoginPage
```

---

## Chat Flow

### Sending a Message
```
1. User types message in ChatInput
     ↓
2. Optional: User attaches file (image/document)
     ↓
3. User clicks send button or presses Enter
     ↓
4. handleSend() triggered:
   - Reset inactivity timer
   - Call sendMessage(message, selectedText, selectedTextUrl, attachedFile)
     ↓
5. sendMessage (useChat hook):
   - Add user message to conversation history
   - Set isProcessing: true (shows typing indicator)
   - Prepare request payload:
     {
       message: string,
       context: selectedText (if any),
       contextUrl: selectedTextUrl (if any),
       attachments: [file] (if any),
       sessionId: currentSessionId,
       projectId: currentProjectId
     }
     ↓
6. POST to /chat endpoint
     ↓
7. Response handling:
   ├─ Success:
   │   - Add assistant response to conversation
   │   - Set isProcessing: false
   │   - Update last activity time
   │
   └─ Error:
       - Show error message
       - Set isProcessing: false
     ↓
8. UI updates:
   - New messages displayed in ChatMessages
   - Input cleared
   - File attachment removed
   - Auto-scroll to bottom
```

### Loading Chat History
```
1. User clicks on a session in Sidebar
     ↓
2. onSelectSession(sessionId) triggered
     ↓
3. loadSession(sessionId) (useChatSessions hook):
   - GET /dev/chat-history?sessionId={sessionId}
     ↓
4. Response contains message array
     ↓
5. loadHistory(messages) (useChat hook):
   - Replace conversation history with loaded messages
   - Close sidebar
     ↓
6. ChatMessages re-renders with history
```

### Creating New Session
```
1. User clicks "Refresh" button in Header
   OR clicks "New Chat" in Sidebar
     ↓
2. handleNewSession() / refreshChat() triggered
     ↓
3. Clear conversation history
     ↓
4. Generate new sessionId
     ↓
5. Show welcome greeting
     ↓
6. Close sidebar (if open)
```

---

## Text Selection Flow

### Content Script Integration
```
1. User selects text on any webpage
     ↓
2. content.js detects selection (mouseup event)
     ↓
3. Selection validation:
   - Text length > 5 characters
   - Not already selected
   - Not a form element
     ↓
4. Show "Ask Claire" tooltip near selection
     ↓
5. User clicks tooltip:
   - Get page title and URL
   - Send message to background script:
     {
       type: 'OPEN_SIDE_PANEL',
       text: selectedText,
       url: pageUrl,
       pageTitle: pageTitle,
       context: 'text_selection'
     }
     ↓
6. background.js receives message:
   - Store in chrome.storage.local:
     * selectedText
     * selectedTextUrl
     * selectedTextPageTitle
     * context
     * timestamp
   - Open side panel
   - Send UPDATE_SELECTED_TEXT message to side panel
     ↓
7. Side panel (App.jsx) receives update:
   - useSelectedText hook gets selected text
   - Display in ChatInput preview
     ↓
8. User types question or clicks send:
   - Selected text included as context
   - Sent to /chat endpoint with context
     ↓
9. AI responds with context-aware answer
```

---

## State Management

### Chrome Storage (chrome.storage.local)
```javascript
{
  // Authentication
  isAuthenticated: boolean,
  user: { id, name, email, ... },
  
  // Text Selection
  selectedText: string,
  selectedTextUrl: string,
  selectedTextPageTitle: string,
  context: 'text_selection',
  timestamp: number,
  
  // Activity Tracking
  lastActivityTime: number,
  
  // Session Management
  currentSessionId: string,
  forceNewConversation: boolean,
  
  // Project Management
  currentProjectId: string,
  
  // Extension State
  enabled: boolean,
  firstRun: boolean
}
```

### React State (in App.jsx)
```javascript
// From useChat
conversationHistory: Message[]
isProcessing: boolean
status: string
greetingVisible: boolean

// From useSelectedText
selectedText: string
selectedTextUrl: string
selectedTextPageTitle: string

// From useChatSessions
sessions: Session[]
currentSessionId: string
loading: boolean

// From useProjects
projects: Project[]
currentProjectId: string
loading: boolean

// From useAuth
isAuthenticated: boolean
isLoading: boolean
user: User

// From useInactivity
isInactive: boolean

// Local state
sidebarOpen: boolean
```

---

## API Integration

### API Endpoints

#### 1. Authentication
```
GET /auth/identity
- Check if user is authenticated
- Returns user details
- Uses cookies (withCredentials: true)

POST /auth/logout
- Logout user
- Clears session cookies

GET /sso/login
- Redirects to SSO provider
- Returns to chrome-extension://[ID]/auth-callback.html
```

#### 2. Chat
```
POST /chat
Request:
{
  message: string,
  context?: string,           // Selected text
  contextUrl?: string,        // Page URL
  attachments?: File[],       // Uploaded files
  sessionId?: string,         // Current session
  projectId: string           // Current project
}

Response:
{
  response: string,           // AI response
  sessionId: string,          // Session ID
  messageId: string           // Message ID
}
```

#### 3. Chat History
```
GET /dev/chat-history
- Returns list of chat sessions
Response: Session[]

GET /dev/chat-history?sessionId={id}
- Returns messages for specific session
Response: Message[]
```

#### 4. Projects
```
GET /project
- Returns list of available projects
Response: Project[]
```

### API Client (shared/api/apiClient.js)
```javascript
- Uses axios for HTTP requests
- Base URL: http://localhost:8080
- Includes credentials in all requests (cookies)
- Error handling with try/catch
```

---

## Build & Deployment

### Development Build
```bash
npm run dev
# Starts Vite dev server
# Hot reload enabled
# Source maps included
```

### Production Build
```bash
npm run build
# Compiles React app with Vite
# Output directory: dist/
# Files generated:
#   - sidepanel.html
#   - sidepanel.js (bundled React app)
#   - sidepanel.css (bundled styles)
#   - claire-logo.svg
#   - background.js (copied)
#   - content.js (copied)
#   - content.css (copied)
#   - manifest.json (copied)
#   - auth-callback.html (copied)
#   - icons/ (copied)
```

### Loading Extension in Chrome
```
1. Open Chrome
2. Navigate to chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the dist/ folder
6. Extension loaded and ready to use
```

### Build Configuration (vite.config.js)
```javascript
- Entry point: src/sidepanel.jsx
- Output: dist/sidepanel.html
- Plugins:
  * @vitejs/plugin-react (React support)
  * copy-extension-files (custom plugin)
    - Copies non-React files to dist/
    - Copies icons to dist/icons/
- Build optimizations:
  * Minification
  * Code splitting
  * Tree shaking
```

---

## Key Features

### 1. Side Panel Integration
- Opens alongside web content
- Persistent across tabs
- Keyboard shortcut: Ctrl+Shift+A (Windows) / Cmd+Shift+A (Mac)
- Toolbar icon click opens panel

### 2. Text Selection Context
- Select text on any webpage
- "Ask Claire" tooltip appears
- Context automatically included in query
- Works on all websites (except restricted pages)

### 3. Chat History
- Sessions automatically saved
- Browse previous conversations
- Resume any session
- Search through history (future feature)

### 4. Project Management
- Switch between different projects
- Project-specific chat history
- Dropdown in header for quick switching

### 5. Inactivity Detection
- Monitors user activity
- Shows reminder after 30 seconds of inactivity
- Browser notification
- Badge on extension icon

### 6. File Attachments
- Upload images and documents
- Preview before sending
- Sent with message context
- Supported formats: .txt, .pdf, .doc, .docx, .jpg, .jpeg, .png

---

## Security Considerations

### 1. Authentication
- SSO via backend server
- Cookies with httpOnly flag
- Session validation on each API call
- Auto-logout on auth failure

### 2. Content Script Isolation
- Runs in isolated world
- No access to page JavaScript
- Cannot be tampered with by websites
- Secure message passing via chrome.runtime

### 3. Permissions
- activeTab: Only access active tab when needed
- storage: Chrome local storage (encrypted)
- sidePanel: Side panel API access
- tabs: Tab management
- scripting: Content script injection
- notifications: Browser notifications
- host_permissions: <all_urls> for content script injection

### 4. CSP (Content Security Policy)
- Defined in manifest.json
- Restricts script execution
- Prevents XSS attacks
- Allows only trusted resources

---

## Performance Optimizations

### 1. Code Splitting
- React components lazy loaded
- Vite handles automatic code splitting
- Smaller initial bundle size

### 2. State Management
- Local state in components
- Chrome storage for persistence
- Minimal re-renders with React hooks

### 3. API Optimization
- Debounced input (if needed)
- Cached API responses (projects, sessions)
- Abort controllers for cancelled requests

### 4. Content Script Optimization
- Event listeners added only once
- Tooltip created lazily
- Minimal DOM manipulation
- No continuous polling

---

## Error Handling

### 1. Network Errors
- Try/catch on all API calls
- User-friendly error messages
- Retry logic (future enhancement)
- Offline detection (future enhancement)

### 2. Authentication Errors
- Redirect to login page
- Clear invalid tokens
- Show error reason
- Allow re-authentication

### 3. Extension Errors
- Console logging for debugging
- Error boundaries (future enhancement)
- Graceful degradation
- User notifications

---

## Future Enhancements

### Planned Features
1. **Search Chat History** - Find past conversations
2. **Export Conversations** - Download chat history
3. **Keyboard Shortcuts** - Quick actions
4. **Dark Mode** - Theme switching
5. **Multi-language Support** - Internationalization
6. **Voice Input** - Speech-to-text
7. **Code Syntax Highlighting** - Better code display
8. **Markdown Support** - Rich text formatting
9. **Offline Mode** - Cache recent chats
10. **Settings Page** - User preferences

### Technical Improvements
1. Migrate JavaScript to TypeScript
2. Add unit tests (Jest, React Testing Library)
3. Add E2E tests (Playwright)
4. Implement error boundaries
5. Add analytics (privacy-friendly)
6. Improve accessibility (ARIA labels)
7. Add service worker caching
8. Implement retry logic for failed requests

---

## Troubleshooting

### Common Issues

**1. Extension not loading**
- Check manifest.json syntax
- Verify all files exist in dist/
- Check Chrome version compatibility
- Review browser console for errors

**2. Side panel not opening**
- Check if side panel permission granted
- Verify background.js loaded
- Check setPanelBehavior executed
- Review extension errors in chrome://extensions/

**3. Content script not injecting**
- Check if on restricted page (chrome://, etc.)
- Verify content_scripts in manifest
- Check host_permissions
- Review page console for errors

**4. Authentication failing**
- Check backend server running
- Verify API endpoints correct
- Check network tab for responses
- Ensure cookies enabled

**5. Text selection not working**
- Check content script loaded
- Verify selection length > 5 characters
- Check if element is form input
- Review content.js console logs

---

## Development Guidelines

### Code Style
- Use functional components (React hooks)
- PascalCase for components
- camelCase for functions/variables
- Descriptive variable names
- JSDoc comments for complex functions

### File Organization
- Feature-based structure
- Co-located styles with components
- Barrel exports (index files)
- Separate concerns (UI/logic/state)

### Git Workflow
- Feature branches
- Descriptive commit messages
- Pull request reviews
- Semantic versioning

### Testing Strategy
- Unit tests for utilities
- Component tests for UI
- Integration tests for features
- E2E tests for critical flows

---

## Dependencies

### Production Dependencies
```json
{
  "@fortawesome/fontawesome-svg-core": "^7.1.0",
  "@fortawesome/free-regular-svg-icons": "^7.1.0",
  "@fortawesome/free-solid-svg-icons": "^7.1.0",
  "@fortawesome/react-fontawesome": "^3.1.0",
  "axios": "^1.13.2",
  "bootstrap": "^5.3.8",
  "react": "^18.3.1",
  "react-bootstrap": "^2.10.10",
  "react-dom": "^18.3.1"
}
```

### Development Dependencies
```json
{
  "@types/chrome": "^0.0.268",
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.1",
  "vite": "^5.3.3"
}
```

---

## Contact & Support

- **Repository**: github.com/DINESH-N-CG/claire-chrome-extension
- **Issues**: Use GitHub Issues for bug reports
- **Documentation**: See PROJECT_STRUCTURE.md for code organization

---

## License

Copyright © 2025 Claire AI
All rights reserved.

---

**Last Updated**: November 21, 2025
**Version**: 1.0.0
**Maintainer**: DINESH-N-CG
