import { useState, useMemo } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

export const Header = ({ onRefresh, onToggleSidebar, projects, currentProjectId, onProjectChange }) => {
  const currentProject = projects?.find(p => p.id === currentProjectId);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchFilter.trim()) return projects;
    
    const searchTerm = searchFilter.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm)
    );
  }, [projects, searchFilter]);
  
  return (
    <div className="chat-header">
      <button 
        className="menu-button" 
        onClick={onToggleSidebar}
        title="Chat history"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div className="header-content">
        <img
          src="icons/claire-logo.svg"
          alt="Claire Icon"
          className="header-logo"
        />
      </div>
      
      {projects && projects.length > 0 && (
        <NavDropdown
          id="project-dropdown"
          title={currentProject?.name || 'Select Project'}
          menuVariant="light"
          className="project-dropdown"
        >
          <div className="dropdown-search-wrapper" onClick={(e) => e.stopPropagation()}>
            <Form.Control
              type="text"
              placeholder="Search projects..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="dropdown-search-input"
              autoFocus
            />
          </div>
          <NavDropdown.Divider />
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <NavDropdown.Item
                key={project.id}
                active={project.id === currentProjectId}
                onClick={() => {
                  onProjectChange(project.id);
                  setSearchFilter('');
                }}
              >
                {project.name}
              </NavDropdown.Item>
            ))
          ) : (
            <div className="dropdown-no-results">No projects found</div>
          )}
        </NavDropdown>
      )}

      
      <button
        className="new-chat"
        onClick={onRefresh}
        title="New Chat"
      >
        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
      </button>
    </div>
  );
}
