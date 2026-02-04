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
import LeadGenStudio from './components/LeadGenStudio';
import UGCStudio from './components/UGCStudio';
import ReportingDashboard from './components/ReportingDashboard';
import AgentStudio from './components/AgentStudio';
import ReputationDashboard from './components/ReputationDashboard';
import SocialCommenting from './components/SocialCommenting';
import SIMIntegration from './components/SIMIntegration';
import FreelanceHub from './components/FreelanceHub';
import PlansBilling from './components/PlansBilling';
import FeatureManagement from './components/FeatureManagement';
import ClientManagement from './components/ClientManagement';
import SystemHealth from './components/SystemHealth';
import OnboardingWizard from './components/OnboardingWizard';
import RFPIntelligence from './components/RFPIntelligence';
import MCPHub from './components/MCPHub';
import AISDRStudio from './components/AISDRStudio';
import AvatarStudio from './components/AvatarStudio';
import InboxStudio from './components/InboxStudio';
import AIEmployees from './components/AIEmployees';
import FunnelStudio from './components/FunnelStudio';
import AdStudio from './components/AdStudio';
import SignStudio from './components/SignStudio';
import WebsitePlannerStudio from './components/WebsitePlannerStudio';
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
const ugcRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/ugc-studio', component: UGCStudio });
const webRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/web-studio', component: WebStudio });
const formRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/form-studio', component: FormStudio }); 
const automationRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/automation-studio', component: AutomationStudio }); 
const dataRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/data-studio', component: DataStudio }); 
const agentSettingsRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/agent-studio', component: AgentStudio });
const marketRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/marketplace-studio', component: MarketplaceStudio }); 
const campaignRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/campaign-studio', component: CampaignStudio });
const devPortalRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/developer-portal', component: DeveloperPortal }); 
const vaultRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/vault-studio', component: VaultStudio });
const fossRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/opensource-registry', component: OpenSourceRegistry });
const leadGenRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/leadgen-studio', component: LeadGenStudio });
const reportingRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/reporting', component: ReportingDashboard });
const reputationRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/reputation', component: ReputationDashboard });
const socialCommentingRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/social-commenting', component: SocialCommenting });
const simIntegrationRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/sim-integration', component: SIMIntegration });
const freelanceHubRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/freelance-hub', component: FreelanceHub });
const plansBillingRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/plans-billing', component: PlansBilling });
const featureManagementRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/feature-management', component: FeatureManagement });
const clientManagementRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/client-management', component: ClientManagement });
const systemHealthRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/system-health', component: SystemHealth });
const onboardingRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/onboarding', component: OnboardingWizard });
const rfpIntelligenceRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/rfp-intelligence', component: RFPIntelligence });
const mcpHubRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/mcp-hub', component: MCPHub });
const aiSdrRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/ai-sdr', component: AISDRStudio });
const avatarStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/avatar-studio', component: AvatarStudio });
const inboxStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/inbox-studio', component: InboxStudio });
const aiEmployeesRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/ai-employees', component: AIEmployees });
const funnelStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/funnel-studio', component: FunnelStudio });
const adStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/ad-studio', component: AdStudio });
const signStudioRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/sign-studio', component: SignStudio });
const websitePlannerRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/website-planner', component: WebsitePlannerStudio });
const settingsRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/settings', component: Settings }); 

const routeTree = rootRoute.addChildren([
  landingRoute, privacyRoute, termsRoute, statusRoute, bookingRoute,
  appLayoutRoute.addChildren([
    dashboardRoute, crmRoute, communityRoute, calendarRoute, newProjectRoute, wikiRoute, adminKbRoute,
    oppStudioRoute, rfpRoute, proposalRoute, complianceRoute, grantRoute,
    brandRoute, ugcRoute, websitePlannerRoute, webRoute, formRoute, campaignRoute, automationRoute, dataRoute, agentSettingsRoute, marketRoute, devPortalRoute, vaultRoute, fossRoute, leadGenRoute, reportingRoute, reputationRoute, socialCommentingRoute, simIntegrationRoute, freelanceHubRoute, plansBillingRoute, featureManagementRoute, clientManagementRoute, systemHealthRoute, onboardingRoute, rfpIntelligenceRoute, mcpHubRoute, aiSdrRoute, avatarStudioRoute, inboxStudioRoute, aiEmployeesRoute, funnelStudioRoute, adStudioRoute, signStudioRoute, settingsRoute
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