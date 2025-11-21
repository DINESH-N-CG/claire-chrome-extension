# Claire AI Extension

## Development Setup

1. **Install dependencies:**
   ```Console
   npm install
   ```

2. **Run development server:**
   ```Console
   npm run dev
   ```

3. **Build for production:**
   ```Console
   npm run build
   ```

4. **Load extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder after building

## Project Structure

```
src/
  components/
    Header.jsx          - Header with logo and refresh button
    ChatMessages.jsx    - Messages container with auto-scroll
    WelcomeGreeting.jsx - Initial greeting message
    Message.jsx         - Individual message bubble
    TypingIndicator.jsx - Loading animation
    ChatInput.jsx       - Input area with selected text preview
  styles/
    Header.css          - Header styles
    ChatMessages.css    - Messages area styles
    WelcomeGreeting.css - Greeting styles
    Message.css         - Message bubble styles
    TypingIndicator.css - Loading animation styles
    ChatInput.css       - Input area styles
    App.css             - Global styles
  hooks/
    useChat.js          - Chat state and API logic
    useSelectedText.js  - Selected text management
  App.jsx              - Main app component
  sidepanel.jsx        - Entry point
  config.js            - Configuration constants

Root:
  background.js        - Background service worker
  content.js           - Content script for text selection
  content.css          - Content script styles
  icons/              - Extension icons
  manifest.json       - Extension manifest
```

