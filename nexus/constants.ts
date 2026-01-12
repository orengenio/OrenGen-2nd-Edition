import { ChecklistItem, ToolConnection, Contact, Opportunity, Post, Course, WikiArticle, TourStep, CalendarProvider, CalendarEvent, Workflow, SimulatedEmail } from './types';
import {
  LayoutDashboard, PlusCircle, PenTool, Video, LayoutTemplate,
  Megaphone, Workflow as WorkflowIcon, BarChart3, Bot, ShoppingBag, Settings, Users,
  Radar, FileSearch, ScrollText, ShieldCheck, Landmark, MessageSquare, Book, Database, Calendar as CalendarIcon, FormInput,
  Terminal, Lock, Server, Box, Sheet, Phone, Mic, MessageCircle, Target, Star, AtSign, Smartphone, Briefcase
} from 'lucide-react';

export const INITIAL_TOOLS: ToolConnection[] = [
  { id: 'gdrive', name: 'Google Drive', icon: 'FileText', connected: false, category: 'content' },
  { id: 'gsheets', name: 'Google Sheets', icon: 'Sheet', connected: false, category: 'analytics' },
  { id: 'mailwizz', name: 'MailWizz', icon: 'Mail', connected: false, category: 'outreach' },
  { id: 'twilio', name: 'Twilio', icon: 'Phone', connected: false, category: 'outreach' },
  { id: 'elevenlabs', name: 'ElevenLabs', icon: 'Mic', connected: false, category: 'content' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: 'MessageCircle', connected: false, category: 'outreach' },
  { id: 'telegram', name: 'Telegram Bot', icon: 'Send', connected: false, category: 'outreach' },
  { id: 'n8n', name: 'n8n Automations', icon: 'Workflow', connected: false, category: 'infrastructure' },
  { id: 'supabase', name: 'Supabase DB', icon: 'Database', connected: false, category: 'infrastructure' },
  { id: 'mailpit', name: 'Mailpit (Test)', icon: 'Mail', connected: false, category: 'infrastructure' },
  { id: 'sam_gov', name: 'SAM.gov Feed', icon: 'Database', connected: false, category: 'analytics' },
];

export const NAV_ITEMS = [
  { id: '/dashboard', label: 'Control Room', icon: LayoutDashboard, section: 'core' },
  { id: '/crm', label: 'CRM Database', icon: Users, section: 'core' },
  { id: '/leadgen-studio', label: 'Lead Generation', icon: Target, section: 'core' },
  { id: '/calendar-studio', label: 'Universal Calendar', icon: CalendarIcon, section: 'core' },
  { id: '/wiki', label: 'Knowledge Wiki', icon: Book, section: 'core' },
  
  // Growth Studios
  { id: '/new-project', label: 'New Project', icon: PlusCircle, section: 'growth' },
  { id: '/brand-studio', label: 'Brand & Press', icon: PenTool, section: 'growth' },
  { id: '/ugc-studio', label: 'UGC / Creator', icon: Video, section: 'growth' },
  { id: '/web-studio', label: 'Web & Funnel', icon: LayoutTemplate, section: 'growth' },
  { id: '/form-studio', label: 'Form Generator', icon: FormInput, section: 'growth' }, 
  { id: '/campaign-studio', label: 'Omni-Channel Ops', icon: Megaphone, section: 'growth' },
  { id: '/community-studio', label: 'Community & Courses', icon: MessageSquare, section: 'growth' },
  { id: '/reputation', label: 'Reputation Manager', icon: Star, section: 'growth' },
  { id: '/social-commenting', label: 'Smart Commenting', icon: AtSign, section: 'growth' },
  { id: '/sim-integration', label: 'SIM & Numbers', icon: Smartphone, section: 'growth' },
  { id: '/freelance-hub', label: 'Freelance Hub', icon: Briefcase, section: 'growth' },

  // Federal Studios
  { id: '/opportunity-studio', label: 'Opportunity Studio', icon: Radar, section: 'federal' },
  { id: '/rfp-studio', label: 'RFP Intelligence', icon: FileSearch, section: 'federal' },
  { id: '/proposal-studio', label: 'Proposal Studio', icon: ScrollText, section: 'federal' },
  { id: '/grant-studio', label: 'Grant Studio', icon: Landmark, section: 'federal' },
  { id: '/compliance-studio', label: 'Compliance & Risk', icon: ShieldCheck, section: 'federal' },

  // System
  { id: '/marketplace-studio', label: 'Integrations Hub', icon: ShoppingBag, section: 'infrastructure' },
  { id: '/opensource-registry', label: 'FOSS Registry', icon: Box, section: 'infrastructure' },
  { id: '/vault-studio', label: 'Vault (Secrets)', icon: Lock, section: 'infrastructure' },
  { id: '/automation-studio', label: 'Automation (n8n)', icon: WorkflowIcon, section: 'infrastructure' },
  { id: '/data-studio', label: 'Data & Sheets', icon: BarChart3, section: 'infrastructure' },
  { id: '/reporting', label: 'Reports & Analytics', icon: BarChart3, section: 'infrastructure' },

  { id: '/agent-studio', label: 'Agent Studio', icon: Bot, section: 'system' },
  { id: '/developer-portal', label: 'API & Developers', icon: Terminal, section: 'system' },
  { id: '/settings', label: 'Settings', icon: Settings, section: 'system' },
];

export const MOCK_WORKFLOWS: Workflow[] = [];

export const MOCK_EMAILS: SimulatedEmail[] = [];

export const DEFAULT_CHECKLIST_TEMPLATE: ChecklistItem[] = [
  // Brand Truth (Brand Studio)
  { id: '1-1', category: 'Brand Studio', title: 'Define Brand Schema (Voice, Personas, Rules)', status: 'done', owner: 'User' },
  { id: '1-2', category: 'Brand Studio', title: 'Generate Visual Constraints & Prompt Context', status: 'pending', owner: 'AI', agentId: 'brand_guardian' },
  
  // Creator Factory (UGC Studio)
  { id: '2-1', category: 'UGC Studio', title: 'Design Creator Archetypes', status: 'pending', owner: 'AI', agentId: 'creator_manager' },
  { id: '2-2', category: 'UGC Studio', title: 'Generate Script Series (Hooks/CTAs)', status: 'pending', owner: 'AI', agentId: 'creator_manager' },
  
  // Web & Funnel (Web Studio)
  { id: '3-1', category: 'Web Studio', title: 'Architect Funnel Logic & UX', status: 'pending', owner: 'AI', agentId: 'web_architect' },
  { id: '3-2', category: 'Web Studio', title: 'Draft Landing Page Copy', status: 'pending', owner: 'AI', agentId: 'web_architect' },

  // Campaign Ops (Campaign Studio)
  { id: '4-1', category: 'Campaign Studio', title: 'Draft Email/SMS Sequence', status: 'pending', owner: 'AI', agentId: 'campaign_orchestrator' },
  { id: '4-2', category: 'Campaign Studio', title: 'Configure Deployment Settings', status: 'pending', owner: 'User' },

  // Automations
  { id: '5-1', category: 'Automation Studio', title: 'Map Event Triggers (n8n)', status: 'pending', owner: 'AI', agentId: 'automation_engineer' },
];

export const INITIAL_CONTACTS: Contact[] = [];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [];

export const MOCK_POSTS: Post[] = [
  { id: '1', author: 'System Admin', avatar: 'SA', title: 'Welcome to Nexus', content: 'Your operating system is live. Start by creating a project.', category: 'Announcement', likes: 1, comments: 0, timestamp: 'Now' },
];

export const MOCK_COURSES: Course[] = [
  { 
    id: '1', title: 'Nexus Operating System Certification', description: 'Master the art of AI orchestration and automated scaling.', thumbnail: 'https://placehold.co/600x400/f97316/ffffff?text=Nexus+OS', progress: 0, 
    modules: [
        { id: 'm1', title: 'System Architecture', duration: '12m', completed: false },
        { id: 'm2', title: 'Configuring Agents', duration: '24m', completed: false },
        { id: 'm3', title: 'Advanced n8n Workflows', duration: '45m', completed: false },
    ]
  },
  { 
    id: '2', title: 'Federal Contracting Accelerator', description: 'From registration to your first win in 90 days.', thumbnail: 'https://placehold.co/600x400/0f172a/ffffff?text=GovCon+Wins', progress: 0,
    modules: [
        { id: 'f1', title: 'Decoding RFPs', duration: '30m', completed: false },
        { id: 'f2', title: 'Compliance Matrix 101', duration: '25m', completed: false },
    ]
  },
  { 
    id: '3', title: 'Creator Economy Masterclass', description: 'Scale your UGC output without burnout.', thumbnail: 'https://placehold.co/600x400/475569/ffffff?text=Creator+Scale', progress: 0,
    modules: [
        { id: 'c1', title: 'Archetype Design', duration: '15m', completed: false },
        { id: 'c2', title: 'Scripting Patterns', duration: '20m', completed: false },
    ]
  }
];

export const WIKI_ARTICLES: WikiArticle[] = [
    { id: '1', category: 'Guide', title: 'Getting Started with Nexus', content: 'Welcome to **OrenGen Nexus**. This operating system is designed to orchestrate complex growth and federal contracting workflows using AI Agents.\n\n### Key Concepts\n* **Studios**: Specialized environments for different tasks (e.g., Brand, Web, Proposal).\n* **Agents**: The AI workers that perform tasks within Studios.\n* **Checklists**: The execution plans that drive projects forward.' },
    { id: '2', category: 'System', title: 'Agent Architecture', content: 'Each agent is powered by Google Gemini Pro 1.5. They share a unified context via the Project state. When you switch studios, the new agent inherits the Brand Schema defined in the Brand Studio.' },
    { id: '3', category: 'FAQ', title: 'How do I export assets?', content: 'Go to the **Campaign Studio** (Launch Bay). You will see a "Deployable Assets" grid. Click the export button on any asset card to download it as a file.' },
    { id: '4', category: 'System', title: 'Role-Based Access Control', content: 'Admins have access to the `/admin-kb` route. Users are restricted to standard Studios. Currently, you are logged in as **Super Admin**.', isAdminOnly: true },
];

export const TOUR_STEPS: TourStep[] = [
    { targetId: 'nav-dashboard', title: 'Control Room', content: 'This is your mission control. Monitor system health, active agents, and project velocity here.', position: 'right' },
    { targetId: 'nav-new-project', title: 'Start Here', content: 'Launch new initiatives using the Project Wizard. This initializes the AI context.', position: 'right' },
    { targetId: 'nav-opportunity-studio', title: 'Federal Intelligence', content: 'For government contracting, start here to scout for grants and contracts.', position: 'right' },
    { targetId: 'nav-marketplace-studio', title: 'Integrations Hub', content: 'Connect Google Sheets, Twilio, WhatsApp, and ElevenLabs here.', position: 'right' },
    { targetId: 'nav-vault-studio', title: 'Secure Vault', content: 'Manage API keys and secrets securely. All encrypted locally.', position: 'right' },
    { targetId: 'nav-campaign-studio', title: 'Launch Bay', content: 'Review and export your final assets (images, copy, code) before deployment.', position: 'right' },
];

export const INITIAL_CALENDAR_PROVIDERS: CalendarProvider[] = [
  { id: 'local', name: 'Nexus Local', type: 'caldav', connected: true, color: '#f97316' }, // Brand accent
  { id: 'google_main', name: 'Google Calendar (Primary)', type: 'google', connected: false, color: '#4285F4' },
  { id: 'outlook_work', name: 'Outlook (Work)', type: 'outlook', connected: false, color: '#0078D4' },
  { id: 'icloud_personal', name: 'iCloud', type: 'icloud', connected: false, color: '#A132F6' },
];

export const MOCK_EVENTS: CalendarEvent[] = [];