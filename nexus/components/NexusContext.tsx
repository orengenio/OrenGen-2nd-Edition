import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ChecklistItem, Contact, Opportunity, CalendarEvent, CalendarProvider, FederalProfile } from '../types';
import { INITIAL_CONTACTS, INITIAL_OPPORTUNITIES, INITIAL_CALENDAR_PROVIDERS, MOCK_EVENTS } from '../constants';

interface NexusContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  deleteProject: (id: string) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeProject: Project | undefined;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  activeOpportunity: Opportunity | null;
  setActiveOpportunity: (opp: Opportunity | null) => void;
  previewItem: ChecklistItem | null;
  setPreviewItem: (item: ChecklistItem | null) => void;
  // Tour State
  isTourActive: boolean;
  startTour: () => void;
  endTour: () => void;
  tourStepIndex: number;
  setTourStepIndex: (index: number) => void;
  // Calendar State
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  providers: CalendarProvider[];
  setProviders: React.Dispatch<React.SetStateAction<CalendarProvider[]>>;
  // Federal Profile
  federalProfile: FederalProfile;
  setFederalProfile: React.Dispatch<React.SetStateAction<FederalProfile>>;
  // Agent Evolution
  agentMemory: string;
  setAgentMemory: React.Dispatch<React.SetStateAction<string>>;
  // System Actions
  clearAllData: () => void;
  // User Role
  userRole: 'user' | 'admin' | 'super_admin';
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

// Helper to persist state
function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Settings
  const [darkMode, setDarkMode] = usePersistedState('nexus_dark_mode', true);
  const [language, setLanguage] = usePersistedState('nexus_language', 'en');
  
  // Core Data Entities - Persisted
  const [projects, setProjects] = usePersistedState<Project[]>('nexus_projects', []);
  const [activeProjectId, setActiveProjectId] = usePersistedState<string | null>('nexus_active_project_id', null);
  const [contacts, setContacts] = usePersistedState<Contact[]>('nexus_contacts', INITIAL_CONTACTS);
  const [opportunities, setOpportunities] = usePersistedState<Opportunity[]>('nexus_opportunities', INITIAL_OPPORTUNITIES);
  const [events, setEvents] = usePersistedState<CalendarEvent[]>('nexus_events', MOCK_EVENTS);
  const [providers, setProviders] = usePersistedState<CalendarProvider[]>('nexus_providers', INITIAL_CALENDAR_PROVIDERS);
  const [agentMemory, setAgentMemory] = usePersistedState<string>('nexus_agent_memory', '');
  
  // Federal Profile - Persisted
  const [federalProfile, setFederalProfile] = usePersistedState<FederalProfile>('nexus_federal_profile', {
    legalName: 'OrenGen Solutions LLC',
    uei: 'XY1234567890',
    cageCode: '8X9J2',
    naics: ['541511', '541512', '541611', '518210'],
    sic: ['7371', '7379'],
    setAsides: ['Small Business', 'Service-Disabled Veteran-Owned'],
    capabilities: 'AI-driven software development, cloud infrastructure modernization, and automated data analytics.'
  });

  // Ephemeral State (Session only)
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const [previewItem, setPreviewItem] = useState<ChecklistItem | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Hardcoded Super Admin for this session
  const userRole = 'super_admin';

  // Apply dark mode class to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    if (activeProjectId === id) {
        setActiveProjectId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const clearAllData = () => {
      if (confirm('WARNING: This will wipe all local data, projects, and settings. This cannot be undone. Are you sure?')) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const startTour = () => {
    setTourStepIndex(0);
    setIsTourActive(true);
  };

  const endTour = () => {
    setIsTourActive(false);
  };

  return (
    <NexusContext.Provider value={{
      darkMode, toggleDarkMode,
      language, setLanguage,
      projects, setProjects, deleteProject,
      activeProjectId, setActiveProjectId,
      activeProject,
      contacts, setContacts,
      opportunities, setOpportunities,
      activeOpportunity, setActiveOpportunity,
      previewItem, setPreviewItem,
      isTourActive, startTour, endTour, tourStepIndex, setTourStepIndex,
      events, setEvents,
      providers, setProviders,
      federalProfile, setFederalProfile,
      agentMemory, setAgentMemory,
      clearAllData,
      userRole
    }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};