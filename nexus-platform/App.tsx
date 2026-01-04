import React from 'react';
import { 
  RouterProvider, 
  createRouter, 
  createRootRoute, 
  createRoute, 
  Navigate,
  createMemoryHistory,
  Outlet,
  useNavigate
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Layout from './components/Layout';
import PublicLanding from './components/PublicLanding'; 
import PrivacyPolicy from './components/PrivacyPolicy'; 
import TermsOfService from './components/TermsOfService'; 
import SystemStatus from './components/SystemStatus'; 
import BookingInterface from './components/BookingInterface'; 
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import CommunityStudio from './components/CommunityStudio';
import FederalDashboard from './components/FederalDashboard';
import ProposalWorkstation from './components/ProposalWorkstation';
import ProjectWizard from './components/ProjectWizard';
import Checklist from './components/Checklist';
import AgentWorkspace from './components/AgentWorkspace';
import CampaignStudio from './components/CampaignStudio';
import CalendarStudio from './components/CalendarStudio';
import BrandStudio from './components/BrandStudio'; 
import WebStudio from './components/WebStudio';
import FormStudio from './components/FormStudio'; 
import DataStudio from './components/DataStudio'; 
import AutomationStudio from './components/AutomationStudio'; 
import DeveloperPortal from './components/DeveloperPortal'; 
import VaultStudio from './components/VaultStudio'; 
import OpenSourceRegistry from './components/OpenSourceRegistry'; 
import MarketplaceStudio from './components/MarketplaceStudio'; 
import Settings from './components/Settings'; 
import Wiki from './components/Wiki';
import { Project, ChecklistItem, AgentType } from './types';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NexusProvider, useNexus } from './components/NexusContext';

// --- TanStack Query Client ---
const queryClient = new QueryClient();

// --- Wrapper Components to bridge Context with Router ---

const DashboardRoute = () => {
  const { projects } = useNexus();
  return <Dashboard projects={projects} />;
};

const CRMRoute = () => {
  return <CRM />;
};

const NewProjectRoute = () => {
  const { activeProject, setProjects, projects, setActiveProjectId } = useNexus();
  const navigate = useNavigate();
  
  if (activeProject) return <Navigate to="/dashboard" />;

  const handleProjectCreate = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
  };

  return <ProjectWizard onComplete={(p) => { handleProjectCreate(p); navigate({ to: '/brand-studio' }); }} />;
};

const FederalDashboardRoute = () => {
  const { opportunities, setOpportunities, setActiveOpportunity } = useNexus();
  return <FederalDashboard opportunities={opportunities} onSelectOpportunity={setActiveOpportunity} onUpdateOpportunities={setOpportunities} />;
};

const ProposalRoute = ({ tab }: { tab: 'rfp' | 'proposal' | 'compliance' }) => {
  const { activeOpportunity, setActiveOpportunity } = useNexus();
  if (!activeOpportunity) return <Navigate to="/opportunity-studio" />;
  return <ProposalWorkstation opportunity={activeOpportunity} onBack={() => setActiveOpportunity(null)} defaultTab={tab} />;
};

const GrantRoute = () => {
  const { opportunities, setOpportunities, setActiveOpportunity } = useNexus();
  return <FederalDashboard opportunities={opportunities.filter(o => o.type === 'Grant')} onSelectOpportunity={setActiveOpportunity} onUpdateOpportunities={setOpportunities} />;
};

const AgentRoute = ({ type, title, desc }: { type: AgentType, title: string, desc: string }) => {
  const { activeProject, setProjects, setPreviewItem } = useNexus();

  const handleRunStep = (item: ChecklistItem) => {
    console.log(`User wants to run ${item.title} with ${item.agentId}`);
    alert(`Navigating to ${item.agentId?.replace('_', ' ').toUpperCase()} to execute: ${item.title}`);
  };

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p>No active operation selected.</p>
        <p className="text-sm">Initialize a new project to engage Studios.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        <div className="xl:col-span-2 h-full">
             <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">{desc}</div>
             <AgentWorkspace project={activeProject} agentType={type} title={title} />
        </div>
        <div className="hidden xl:block overflow-y-auto">
            <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-300">Nexus Execution List</h3>
            <Checklist 
                items={activeProject.checklist.filter(i => i.agentId === type || !i.agentId)} 
                onRunStep={handleRunStep} 
                onToggle={() => {}} 
                onPreview={setPreviewItem}
            />
        </div>
    </div>
  );
};

// --- TanStack Router Setup ---

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <AssetPreviewModal />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});

// 1. Landing Page Routes
const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: PublicLanding });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/privacy', component: PrivacyPolicy });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: TermsOfService });
const statusRoute = createRoute({ getParentRoute: () => rootRoute, path: '/status', component: SystemStatus });
const bookingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/book', component: BookingInterface });

// 2. App Layout Route (Wraps functional routes with Sidebar)
const appLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'app-layout',
    component: Layout,
});

// 3. Child Routes (Inside App Layout)
const dashboardRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/dashboard', component: DashboardRoute });
const crmRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/crm', component: CRMRoute });
const communityRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/community-studio', component: CommunityStudio });
const calendarRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/calendar-studio', component: CalendarStudio });
const newProjectRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/new-project', component: NewProjectRoute });
const wikiRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/wiki', component: () => <Wiki mode="user" /> });
const adminKbRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/admin-kb', component: () => <Wiki mode="admin" /> });

// Federal
const oppStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/opportunity-studio', component: FederalDashboardRoute });
const rfpRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/rfp-studio', component: () => <ProposalRoute tab="rfp" /> });
const proposalRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/proposal-studio', component: () => <ProposalRoute tab="proposal" /> });
const complianceRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/compliance-studio', component: () => <ProposalRoute tab="compliance" /> });
const grantRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/grant-studio', component: GrantRoute });

// Agent Studios & Tools
const brandRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/brand-studio', component: BrandStudio });
const ugcRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/ugc-studio', component: () => <AgentRoute type="creator_manager" title="UGC Studio" desc="Synthesize creator archetypes." /> });
const webRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/web-studio', component: WebStudio });
const formRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/form-studio', component: FormStudio }); 
const automationRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/automation-studio', component: AutomationStudio }); 
const dataRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/data-studio', component: DataStudio }); 
const agentSettingsRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/agent-studio', component: () => <AgentRoute type="agent_supervisor" title="Agent Supervisor" desc="Manage workforce." /> });
const marketRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/marketplace-studio', component: MarketplaceStudio }); 
const campaignRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/campaign-studio', component: CampaignStudio });
const devPortalRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/developer-portal', component: DeveloperPortal }); 
const vaultRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/vault-studio', component: VaultStudio }); 
const fossRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/opensource-registry', component: OpenSourceRegistry }); 
const settingsRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/settings', component: Settings }); 

const routeTree = rootRoute.addChildren([
  landingRoute, privacyRoute, termsRoute, statusRoute, bookingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute, crmRoute, communityRoute, calendarRoute, newProjectRoute, wikiRoute, adminKbRoute,
    oppStudioRoute, rfpRoute, proposalRoute, complianceRoute, grantRoute,
    brandRoute, ugcRoute, webRoute, formRoute, campaignRoute, automationRoute, dataRoute, agentSettingsRoute, marketRoute, devPortalRoute, vaultRoute, fossRoute, settingsRoute
  ])
]);

// Use memory history to avoid pushState errors in blob environments
const memoryHistory = createMemoryHistory({
  initialEntries: ['/']
});
const router = createRouter({ routeTree, history: memoryHistory });

// --- Asset Preview Modal ---
const AssetPreviewModal = () => {
  const { previewItem, setPreviewItem } = useNexus();
  if (!previewItem) return null;

  const isImage = previewItem.output?.startsWith('data:image') || previewItem.output?.startsWith('http');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-lg">{previewItem.title}</h3>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{previewItem.category}</span>
          </div>
          <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900 flex justify-center">
            {isImage ? (
                <img src={previewItem.output} alt="Asset" className="max-w-full h-auto rounded shadow-sm" />
            ) : (
                <div className="prose dark:prose-invert prose-sm max-w-none w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <ReactMarkdown>{previewItem.output || '*No content available*'}</ReactMarkdown>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexusProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </NexusProvider>
    </QueryClientProvider>
  );
};

export default App;