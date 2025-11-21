 export const WelcomeGreeting = () => {
  return (
    <div className="welcome-center">
      {/* <div className="welcome-greeting">{getGreeting()}</div> */}
      <div className="welcome-title" style={{ fontSize: '28px' }}>Welcome to Claire AI</div>
      <div className="welcome-description">
        Chat with me or select text and click "Ask Claire."
      </div>
    </div>
  );
};
