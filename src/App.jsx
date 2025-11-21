import { useState } from 'react';
import { Header } from './layout';
import { ChatMessages, ChatInput, InactivityNotice } from './features/chat';
import { Sidebar } from './features/chatHistory';
import { LoginPage, useAuth } from './features/auth';
import { useChat, useSelectedText } from './features/chat';
import { useChatSessions } from './features/chatHistory';
import { useProjects } from './features/projects';
import { useInactivity } from './shared/hooks/useInactivity';
import './styles/App.css';
import './styles/ProjectDropdown.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isInactive, resetActivity } = useInactivity(0.5); // 0.5 minutes = 30 seconds for testing

  const {
    conversationHistory,
    isProcessing,
    status,
    greetingVisible,
    sendMessage,
    refreshChat,
    loadHistory
  } = useChat();

  const { selectedText, selectedTextUrl, selectedTextPageTitle, clearSelectedText } = useSelectedText();
  
  const {
    sessions,
    currentSessionId,
    loading,
    loadSession,
    createNewSession,
    refreshSessions
  } = useChatSessions();

  const {
    projects,
    currentProjectId,
    loading: projectsLoading,
    switchProject
  } = useProjects();

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="chat-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>👋</div>
          <div>Loading Claire...</div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
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
        onSendMessage={(message, selectedText, selectedTextUrl, attachedFile) => {
          resetActivity();
          sendMessage(message, selectedText, selectedTextUrl, attachedFile);
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
