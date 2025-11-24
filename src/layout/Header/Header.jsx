import { useState, useMemo } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Header = ({ onRefresh, onToggleSidebar, projects, currentProjectId, onProjectChange }) => {
  const currentProject = projects?.find(p => p.id === currentProjectId);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Filter and limit projects based on search term
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    // If searching, show all matching projects
    if (searchFilter.trim()) {
      const searchTerm = searchFilter.toLowerCase();
      return projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // If no search, show only last 4 modified/used projects
    // Assuming projects are already sorted by most recent, or sort by updatedAt/lastUsed if available
    return projects.slice(0, 4);
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
      
      {projects && projects.length > 0 && (
        <NavDropdown
          id="project-dropdown"
          title={currentProject?.name || 'Select Project'}
          menuVariant="dark"
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
        className="refresh-button" 
        onClick={onRefresh}
        title="Start new conversation"
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ fontSize: '14px' }} />
      </button>
    </div>
  );
};
