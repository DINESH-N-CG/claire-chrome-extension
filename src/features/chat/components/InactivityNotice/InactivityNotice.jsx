import './InactivityNotice.css';

export const InactivityNotice = ({ onDismiss }) => {
  return (
    <div className="inactivity-overlay" onClick={onDismiss}>
      <div className="inactivity-card" onClick={(e) => e.stopPropagation()}>
        <div className="inactivity-emoji">👋</div>
        <h3 className="inactivity-heading">Still there?</h3>
        <p className="inactivity-text">
          I'm Claire, ready to assist you whenever you need!
        </p>
        <button className="inactivity-button" onClick={onDismiss}>
          Let's chat
        </button>
      </div>
    </div>
  );
};
