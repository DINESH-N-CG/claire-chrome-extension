import { useEffect, useState } from "react";
import axios from "axios";

import { Header } from "./layout";
import {
  ChatMessages,
  ChatInput,
  InactivityNotice,
  useChat,
  useSelectedText,
} from "./features/chat";
import { Sidebar, useChatSessions } from "./features/chatHistory";
import { LoginPage } from "./features/auth";
import { useProjects } from "./features/projects";
import { useInactivity } from "./shared/hooks/useInactivity";
import "./styles/App.css";
import "./styles/ProjectDropdown.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isInactive, resetActivity } = useInactivity(0.5); // 0.5 minutes = 30 seconds for testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = "http://localhost:8080";
  const [authLoading, setAuthLoading] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/identity`, {
        withCredentials: true,
      });

      if (response.data) {
        await chrome.storage.local.set({
          user: response.data,
          isAuthenticated: true,
        });
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      await chrome.storage.local.remove(["user", "isAuthenticated"]);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    conversationHistory,
    isProcessing,
    status,
    greetingVisible,
    sendMessage,
    refreshChat,
    loadHistory,
  } = useChat();

  const {
    selectedText,
    selectedTextUrl,
    selectedTextPageTitle,
    clearSelectedText,
  } = useSelectedText();

  const {
    sessions,
    currentSessionId,
    loading,
    loadSession,
    createNewSession,
    refreshSessions,
  } = useChatSessions();

  const {
    projects,
    currentProjectId,
    loading: projectsLoading,
    switchProject,
  } = useProjects();

  useEffect(() => {
    checkAuth();
  }, [authLoading]);

  console.log("app login", user, isAuthenticated);
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div
        className="chat-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>👋</div>
          <div>Loading Claire...</div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        {...{
          setAuthLoading,
        }}
      />
    );
  }

  const handleSelectSession = async (sessionId) => {
    const history = await loadSession(sessionId);
    if (history) {
      loadHistory(history);
      setSidebarOpen(false);
    }
  };

  const handleNewSession = async () => {
    await createNewSession();
    refreshChat();
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    if (!sidebarOpen) {
      refreshSessions(); // Refresh sessions when opening sidebar
    }
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectChange = async (projectId) => {
    await switchProject(projectId);
    // Refresh chat sessions for the new project
    refreshSessions();
    // Start a new conversation for the new project
    refreshChat();
  };

  return (
    <div className="chat-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        loading={loading}
      />

      <Header
        onRefresh={refreshChat}
        onToggleSidebar={handleToggleSidebar}
        projects={projects}
        currentProjectId={currentProjectId}
        onProjectChange={handleProjectChange}
      />

      <ChatMessages
        messages={conversationHistory}
        greetingVisible={greetingVisible}
        isProcessing={isProcessing}
      />

      <ChatInput
        onSendMessage={(
          message,
          selectedText,
          selectedTextUrl,
          attachedFiles
        ) => {
          resetActivity();
          sendMessage(message, selectedText, selectedTextUrl, attachedFiles);
        }}
        isProcessing={isProcessing}
        selectedText={selectedText}
        selectedTextUrl={selectedTextUrl}
        selectedTextPageTitle={selectedTextPageTitle}
        onClearSelectedText={clearSelectedText}
      />

      {isInactive && <InactivityNotice onDismiss={resetActivity} />}
    </div>
  );
}

export default App;
