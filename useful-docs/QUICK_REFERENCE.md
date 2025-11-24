# Claire Extension - Quick Reference Guide

## 🚀 Quick Start

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
```

### Load Extension
1. Run `npm run build`
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → Select `dist/` folder

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration & permissions |
| `background.js` | Service worker (background tasks) |
| `content.js` | Injected into web pages (text selection) |
| `src/App.jsx` | Main React application |
| `src/core/constants.ts` | All configuration constants |
| `src/routes.ts` | API route definitions |
| `vite.config.js` | Build configuration |

---

## 🔑 Key Constants

### API Endpoints (src/core/constants.ts)
```typescript
BASE_URL: 'http://localhost:8080'
ENDPOINTS:
  - /chat                    # Send messages
  - /dev/chat-history        # Get chat history
  - /project                 # Get projects
  - /auth/identity           # Check auth
  - /auth/logout             # Logout
  - /sso/login              # SSO login
```

### Chrome Storage Keys
```typescript
user                       # User data
isAuthenticated           # Auth status
selectedText              # Selected text from page
selectedTextUrl           # Page URL
selectedTextPageTitle     # Page title
currentSessionId          # Active chat session
currentProjectId          # Active project
lastActivityTime          # For inactivity detection
```

---

## 🎯 Core Features Flow

### 1. User Authentication
```
LoginPage → SSO Login → auth-callback.html → Background Script → App.jsx
```

### 2. Text Selection
```
User selects text → content.js → "Ask Claire" tooltip → 
background.js → chrome.storage → App.jsx → ChatInput preview
```

### 3. Send Message
```
ChatInput → useChat hook → POST /chat → Response → 
Update conversation history → ChatMessages display
```

### 4. Chat History
```
Sidebar → Click session → useChatSessions.loadSession() → 
GET /dev/chat-history → Load messages → Display in ChatMessages
```

### 5. Project Switching
```
Header dropdown → Select project → useProjects.switchProject() → 
Store currentProjectId → Refresh chat sessions → New conversation
```

---

## 🔧 Common Tasks

### Add New API Endpoint
1. Add to `src/core/constants.ts` → `API_CONFIG.ENDPOINTS`
2. Create API call in feature hook (e.g., `useChat.js`)
3. Handle response and update state

### Add New Component
1. Create in appropriate feature folder: `src/features/{feature}/components/`
2. Export from `index.ts` in component folder
3. Import in parent component

### Add New Constant
1. Add to `src/core/constants.ts`
2. Export in appropriate category (API_CONFIG, TIMING, UI, etc.)
3. Import where needed: `import { CONSTANT } from './core/constants'`

### Add New Helper Function
1. Add to `src/core/helpers.ts`
2. Export the function
3. Import where needed: `import { helperFunction } from './core/helpers'`

---

## 🐛 Debugging

### Check Background Script
```
chrome://extensions/ → Claire Extension → "service worker" link
```

### Check Content Script
```
Open any webpage → F12 → Console tab → Look for "Claire content script loaded"
```

### Check Side Panel
```
Open side panel → F12 → Console tab
```

### Check Storage
```
chrome://extensions/ → Claire Extension → "storage" link
```

---

## 📦 Build Output (dist/)

After `npm run build`:
```
dist/
├── sidepanel.html          # Side panel HTML
├── sidepanel.js            # Bundled React app (321 KB)
├── sidepanel.css           # Bundled styles (246 KB)
├── background.js           # Service worker
├── content.js              # Content script
├── content.css             # Content script styles
├── manifest.json           # Extension config
├── auth-callback.html      # Auth callback page
├── claire-logo.svg         # Logo
└── icons/                  # Extension icons
    ├── claire-logo-16px.png
    ├── claire-logo-48px.png
    └── claire-logo-128px.png
```

---

## 🎨 UI Components

### Layout Components
- **Header** - Logo, project dropdown, refresh button
- **Sidebar** - Chat session history

### Chat Components
- **ChatMessages** - Message list display
- **ChatInput** - Input field, file upload, send button
- **Message** - Individual message bubble
- **TypingIndicator** - Loading animation
- **InactivityNotice** - Inactivity overlay

### Auth Components
- **LoginPage** - SSO login screen

### Welcome Components
- **WelcomeGreeting** - Initial greeting screen

---

## 🔌 Chrome APIs Used

| API | Purpose |
|-----|---------|
| `chrome.runtime` | Messaging, extension info |
| `chrome.storage` | Store data locally |
| `chrome.sidePanel` | Side panel management |
| `chrome.tabs` | Tab management |
| `chrome.scripting` | Content script injection |
| `chrome.notifications` | Browser notifications |
| `chrome.action` | Extension icon & badge |

---

## 🌐 Message Types (Background ↔ Content Script)

```typescript
OPEN_SIDE_PANEL        # Content → Background: Open panel with text
UPDATE_SELECTED_TEXT   # Background → Side Panel: Update selected text
AUTH_SUCCESS          # Callback → Background: Auth successful
AUTH_FAILURE          # Callback → Background: Auth failed
CLOSE_SIDE_PANEL      # Any → Background: Close panel
PING                  # Any → Background: Health check
```

---

## 📝 Code Patterns

### Custom Hook Pattern
```javascript
export const useFeature = () => {
  const [state, setState] = useState();
  
  const doSomething = async () => {
    // Logic here
  };
  
  return { state, doSomething };
};
```

### API Call Pattern
```javascript
try {
  const response = await axios.post(url, data, { withCredentials: true });
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

### Component Pattern
```jsx
export const Component = ({ prop1, prop2 }) => {
  const [state, setState] = useState();
  
  return (
    <div className="component-class">
      {/* JSX */}
    </div>
  );
};
```

---

## 🔐 Security Notes

- All API calls use `withCredentials: true` for cookies
- Content script runs in isolated world
- No eval() or inline scripts (CSP compliant)
- Authentication via backend SSO
- Sensitive data in httpOnly cookies

---

## 📊 State Flow

```
Chrome Storage
    ↓
React Hooks (useState, useEffect)
    ↓
Component State
    ↓
UI Re-render
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Install extension
- [ ] Login with SSO
- [ ] Send a message
- [ ] Upload a file
- [ ] Select text on webpage
- [ ] Click "Ask Claire" tooltip
- [ ] Switch projects
- [ ] View chat history
- [ ] Create new chat
- [ ] Test inactivity notification
- [ ] Logout and re-login

### Build Testing
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] All files in dist/
- [ ] Extension loads in Chrome
- [ ] Side panel opens

---

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `PROJECT_STRUCTURE.md` | Code organization & architecture |
| `EXTENSION_FLOW.md` | Complete flow documentation |
| `QUICK-START.md` | Getting started guide |
| `README-REACT.md` | React-specific notes |

---

## 🚨 Common Gotchas

1. **Content script not loading**: Check host_permissions in manifest
2. **Auth not working**: Ensure backend is running on localhost:8080
3. **Side panel blank**: Check console for React errors
4. **Text selection not working**: Minimum 5 characters required
5. **Build fails**: Delete node_modules and run npm install

---

## 📞 Support

- **Documentation**: See EXTENSION_FLOW.md for detailed flows
- **Structure**: See PROJECT_STRUCTURE.md for code organization
- **Issues**: Check browser console and extension errors

---

**Version**: 1.0.0  
**Last Updated**: November 21, 2025
