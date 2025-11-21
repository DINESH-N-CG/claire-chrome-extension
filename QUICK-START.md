#  Quick Start Guide

### Load the Extension in Chrome

1. **Open Chrome Extensions page:**
   - Type `chrome://extensions/` in the address bar
   - OR click the puzzle icon → "Manage Extensions"

2. **Enable Developer Mode:**
   - Toggle the switch in the top-right corner

3. **Load Your Extension:**
   - Click "Load unpacked"
   - Navigate to: `c:\exection\dist`
   - Click "Select Folder"

4. **Done!** Your extension is now loaded and ready to use.

### How to Use

- Click the Claire icon in your toolbar
- The side panel will open with Claire AI
- Select text on any webpage and ask questions about it!

### Making Changes

#### Development Mode (with hot reload)
```Console
npm run dev
```
Visit http://localhost:5173 to see your changes live

#### Build for Production
```Console
npm run build
```
Then reload the extension in Chrome (`chrome://extensions/` → click refresh icon)

### File Structure
- **src/components/**: All UI components (JSX files only)
- **src/styles/**: All CSS files
- **src/hooks/**: Business logic (chat, selected text)
- **src/config.js**: Settings like API URL
- **background.js**: Chrome extension background service
- **content.js**: Handles text selection on web pages

### Troubleshooting

**Extension not working?**
- Make sure you loaded the `dist` folder (not the root folder)
- Check the console for errors (`chrome://extensions/` → Details → Inspect views)

**Changes not showing?**
- Run `npm run build` after making changes
- Click the refresh icon on your extension in `chrome://extensions/`


