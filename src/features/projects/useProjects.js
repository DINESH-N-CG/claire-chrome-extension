import { useState, useEffect } from 'react';

const safeChrome = typeof chrome !== 'undefined' && chrome?.storage?.local;

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
    loadCurrentProject();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/project/all', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const projectList = data.rows || data || [];
        setProjects(projectList);
      } else {
        console.error('Failed to load projects:', response.status);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentProject = async () => {
    if (safeChrome) {
      const stored = await chrome.storage.local.get(['currentProjectId']);
      if (stored.currentProjectId) {
        setCurrentProjectId(stored.currentProjectId);
      } else {
        // Default to project ID 1 if none stored
        setCurrentProjectId(1);
        await chrome.storage.local.set({ currentProjectId: 1 });
      }
    } else {
      setCurrentProjectId(1);
    }
  };

  const switchProject = async (projectId) => {
    setCurrentProjectId(projectId);
    if (safeChrome) {
      await chrome.storage.local.set({ currentProjectId: projectId });
    }
    return projectId;
  };

  return {
    projects,
    currentProjectId,
    loading,
    switchProject,
    refreshProjects: loadProjects
  };
};
