// Configuration - Replace with your Claire app URL
const AI_APP_URL = "http://localhost:3000/app"; // CHANGE THIS! 
let SESSION = "";

// Mark that content script is loaded
window.claireContentScriptLoaded = true;
console.log('Claire content script loaded');

async function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

(async () => {
  if (!SESSION) {
    SESSION = await uuidv4();
  }
})();

let selectionTooltip = null;
let currentSelectedText = '';
let tooltipTimeout = null;

// "Ask Claire" tooltip for text selection ONLY
function createSelectionTooltip() {
  if (selectionTooltip) return selectionTooltip;

  selectionTooltip = document.createElement("div");
  selectionTooltip.id = "claire-selection-tooltip";
  selectionTooltip.innerHTML = "Ask Claire";
  selectionTooltip.style.cssText = `
    position: absolute;
    background: #4F46E5;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    display: none;
    font-family: 'Segoe UI'
    transition: all 0.2s;
    user-select: none;
    white-space: nowrap;
    pointer-events: auto;
  `;

  selectionTooltip.addEventListener("mouseenter", () => {
    selectionTooltip.style.background = "#4338CA";
    selectionTooltip.style.transform = "scale(1.05)";
  });

  selectionTooltip.addEventListener("mouseleave", () => {
    selectionTooltip.style.background = "#4F46E5";
    selectionTooltip.style.transform = "scale(1)";
  });

  // mousedown
  selectionTooltip.addEventListener("mousedown", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedText = currentSelectedText;
    if (selectedText) {
      console.log("Ask Claire clicked with text:", selectedText.substring(0, 50) + "...");

      // Change button text to show loading
      selectionTooltip.innerHTML = "Opening...";

      try {
        // Send message to open side panel with text
        const response = await chrome.runtime.sendMessage({
          type: "OPEN_CLAIRE",
          text: selectedText,
          url: window.location.href,
          pageTitle: document.title,
          context: "text_selection",
        });

        console.log("Message sent, response:", response);

        if (response && response.success) {
          console.log("Side panel opened successfully");
        } else {
          console.error("Failed to open side panel:", response);
          selectionTooltip.innerHTML = "Error";
          setTimeout(() => {
            selectionTooltip.innerHTML = "Ask Claire";
          }, 2000);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        selectionTooltip.innerHTML = "Error";
        setTimeout(() => {
          selectionTooltip.innerHTML = "Ask Claire";
        }, 2000);
      }
    }

    // Hide tooltip after click
    setTimeout(() => {
      hideSelectionTooltip();
      currentSelectedText = '';
    }, 300);
  });

  document.body.appendChild(selectionTooltip);
  return selectionTooltip;
}

// Show tooltip near selected text
function showSelectionTooltip(x, y) {
  const tooltip = createSelectionTooltip();
  tooltip.style.display = "block";
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y - 45}px`;
}

// Hide selection tooltip
function hideSelectionTooltip() {
  if (selectionTooltip) {
    selectionTooltip.style.display = "none";
    selectionTooltip.innerHTML = "Ask Claire"; // Reset text
  }
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
}

// Handle text selection
document.addEventListener("mouseup", (e) => {
  if (e.target.id === "claire-selection-tooltip" || 
      e.target.closest("#claire-selection-tooltip")) {
    return;
  }

  // Clear existing timeout
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }

  // delay to ensure selection is complete
  tooltipTimeout = setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();

    // Only show tooltip for meaningful text selections (more than 1 character)
    if (selectedText && selectedText.length > 1) {
      // Store the selected text
      currentSelectedText = selectedText;
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Show tooltip near the selection
        showSelectionTooltip(
          rect.left + rect.width / 2 - 50,
          rect.top + window.scrollY
        );
      }
    } else {
      hideSelectionTooltip();
      currentSelectedText = '';
    }
  }, 10);
});

// Hide tooltip clicking elsewhere
document.addEventListener("mousedown", (e) => {
  if (e.target.id !== "claire-selection-tooltip" && 
      !e.target.closest("#claire-selection-tooltip")) {
    // delay to check if a new selection is being made
    setTimeout(() => {
      const selectedText = window.getSelection().toString().trim();
      if (!selectedText || selectedText.length <= 1) {
        hideSelectionTooltip();
        currentSelectedText = '';
      }
    }, 50);
  }
});

// Close tooltip on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideSelectionTooltip();
    currentSelectedText = '';
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "PING") {
    sendResponse({ status: "ok" });
  }
  return true;
});