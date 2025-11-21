import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export const Header = ({
  onRefresh,
  onToggleSidebar,
  projects,
  currentProjectId,
  onProjectChange
}) => {
  return (
    <div className="chat-header">

      {/* Sidebar Toggle */}
      <button
        className="menu-button"
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={faArrowsLeftRight} size="lg" />
      </button>

      <div className="header-content">
        <img
          src="icons/claire-logo.svg"
          alt="Claire Icon"
          className="header-logo"
        />
      </div>

      {projects && projects.length > 0 && (
        <select
          className="project-dropdown"
          value={currentProjectId || ""}
          onChange={(e) => onProjectChange(Number(e.target.value))}
          title="Switch project"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      )}

      {/* Replace Refresh Icon with New Chat Icon */}
      <button
        className="refresh-button"
        onClick={onRefresh}
        title="Start new conversation"
      >
        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
      </button>
    </div>
  );
};
