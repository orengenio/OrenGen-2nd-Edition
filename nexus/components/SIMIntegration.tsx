/**
 * SIM/Number Integration Dashboard
 * Route personal phone numbers through CRM - unique differentiator
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  MessageSquare,
  Voicemail,
  Settings,
  Plus,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Smartphone,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  Calendar,
  Users,
  Bot,
  Building,
  Globe,
  Shield,
  Zap,
  ChevronRight,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  MoreVertical,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  TrendingUp
} from 'lucide-react';

// Types
type NumberType = 'personal_sim' | 'voip' | 'toll_free' | 'local';
type RoutingMode = 'crm_only' | 'crm_primary' | 'device_primary' | 'smart_routing' | 'schedule_based';
type Carrier = 'verizon' | 'att' | 'tmobile' | 'sprint' | 'other';
type CallStatus = 'completed' | 'missed' | 'voicemail' | 'in_progress';
type ForwardingStatus = 'active' | 'pending' | 'failed' | 'disabled';

interface ConnectedNumber {
  id: string;
  number: string;
  type: NumberType;
  label: string;
  carrier?: Carrier;
  routingMode: RoutingMode;
  forwardingStatus: ForwardingStatus;
  voicemailEnabled: boolean;
  recordCalls: boolean;
  aiAgentEnabled: boolean;
  stats: {
    totalCalls: number;
    missedCalls: number;
    totalSms: number;
    avgResponseTime: string;
  };
  schedule?: {
    businessHours: { start: string; end: string };
    afterHoursAction: 'voicemail' | 'ai_agent' | 'forward';
  };
}

interface CallRecord {
  id: string;
  numberId: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  contactName?: string;
  status: CallStatus;
  duration: number;
  timestamp: string;
  recording?: string;
  transcription?: string;
  notes?: string;
}

interface SmsRecord {
  id: string;
  numberId: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  contactName?: string;
  body: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed' | 'received';
}

// Carrier configurations
const CARRIER_CONFIG: Record<Carrier, { name: string; color: string; forwardingCode: string }> = {
  verizon: { name: 'Verizon', color: '#CD040B', forwardingCode: '*72' },
  att: { name: 'AT&T', color: '#00A8E0', forwardingCode: '*72' },
  tmobile: { name: 'T-Mobile', color: '#E20074', forwardingCode: '**21*' },
  sprint: { name: 'Sprint', color: '#FFE100', forwardingCode: '*72' },
  other: { name: 'Other', color: '#6B7280', forwardingCode: '*72' }
};

const ROUTING_CONFIG: Record<RoutingMode, { label: string; description: string; icon: React.ComponentType<any> }> = {
  crm_only: { label: 'CRM Only', description: 'All calls go directly to CRM', icon: Building },
  crm_primary: { label: 'CRM Primary', description: 'CRM first, device as backup', icon: ArrowRight },
  device_primary: { label: 'Device Primary', description: 'Device first, CRM as backup', icon: Smartphone },
  smart_routing: { label: 'Smart Routing', description: 'AI decides based on context', icon: Bot },
  schedule_based: { label: 'Schedule Based', description: 'Routes based on time/day', icon: Calendar }
};

// Mock data
const generateMockData = () => {
  const numbers: ConnectedNumber[] = [
    {
      id: 'n1',
      number: '+1 (555) 123-4567',
      type: 'personal_sim',
      label: 'Personal Mobile',
      carrier: 'verizon',
      routingMode: 'smart_routing',
      forwardingStatus: 'active',
      voicemailEnabled: true,
      recordCalls: true,
      aiAgentEnabled: true,
      stats: { totalCalls: 156, missedCalls: 8, totalSms: 423, avgResponseTime: '2.3 min' },
      schedule: { businessHours: { start: '09:00', end: '18:00' }, afterHoursAction: 'ai_agent' }
    },
    {
      id: 'n2',
      number: '+1 (555) 987-6543',
      type: 'voip',
      label: 'Business Line',
      routingMode: 'crm_only',
      forwardingStatus: 'active',
      voicemailEnabled: true,
      recordCalls: true,
      aiAgentEnabled: false,
      stats: { totalCalls: 89, missedCalls: 3, totalSms: 156, avgResponseTime: '1.8 min' }
    },
    {
      id: 'n3',
      number: '+1 (800) 555-0199',
      type: 'toll_free',
      label: 'Support Hotline',
      routingMode: 'schedule_based',
      forwardingStatus: 'active',
      voicemailEnabled: true,
      recordCalls: true,
      aiAgentEnabled: true,
      stats: { totalCalls: 234, missedCalls: 12, totalSms: 0, avgResponseTime: '3.1 min' },
      schedule: { businessHours: { start: '08:00', end: '20:00' }, afterHoursAction: 'voicemail' }
    },
    {
      id: 'n4',
      number: '+1 (555) 444-3322',
      type: 'personal_sim',
      label: 'Second Line',
      carrier: 'tmobile',
      routingMode: 'device_primary',
      forwardingStatus: 'pending',
      voicemailEnabled: false,
      recordCalls: false,
      aiAgentEnabled: false,
      stats: { totalCalls: 23, missedCalls: 5, totalSms: 67, avgResponseTime: '5.2 min' }
    }
  ];

  const calls: CallRecord[] = [
    { id: 'c1', numberId: 'n1', direction: 'inbound', from: '+1 (555) 111-2222', to: '+1 (555) 123-4567', contactName: 'John Smith', status: 'completed', duration: 245, timestamp: '2024-01-10T14:30:00Z' },
    { id: 'c2', numberId: 'n1', direction: 'outbound', from: '+1 (555) 123-4567', to: '+1 (555) 333-4444', contactName: 'Sarah Johnson', status: 'completed', duration: 180, timestamp: '2024-01-10T13:15:00Z' },
    { id: 'c3', numberId: 'n2', direction: 'inbound', from: '+1 (555) 555-6666', to: '+1 (555) 987-6543', status: 'missed', duration: 0, timestamp: '2024-01-10T12:00:00Z' },
    { id: 'c4', numberId: 'n1', direction: 'inbound', from: '+1 (555) 777-8888', to: '+1 (555) 123-4567', contactName: 'Mike Williams', status: 'voicemail', duration: 45, timestamp: '2024-01-10T11:30:00Z', transcription: 'Hi, this is Mike calling about the property on Oak Street...' },
    { id: 'c5', numberId: 'n3', direction: 'inbound', from: '+1 (555) 999-0000', to: '+1 (800) 555-0199', status: 'completed', duration: 320, timestamp: '2024-01-10T10:45:00Z', notes: 'Support inquiry about billing' }
  ];

  const messages: SmsRecord[] = [
    { id: 's1', numberId: 'n1', direction: 'inbound', from: '+1 (555) 111-2222', to: '+1 (555) 123-4567', contactName: 'John Smith', body: 'Hey, are you available for a showing tomorrow?', timestamp: '2024-01-10T14:45:00Z', status: 'received' },
    { id: 's2', numberId: 'n1', direction: 'outbound', from: '+1 (555) 123-4567', to: '+1 (555) 111-2222', contactName: 'John Smith', body: 'Yes! I have availability at 2pm or 4pm. Which works better?', timestamp: '2024-01-10T14:47:00Z', status: 'delivered' },
    { id: 's3', numberId: 'n2', direction: 'inbound', from: '+1 (555) 333-4444', to: '+1 (555) 987-6543', contactName: 'Sarah Johnson', body: 'Thanks for the quick response on the quote!', timestamp: '2024-01-10T13:30:00Z', status: 'received' },
    { id: 's4', numberId: 'n1', direction: 'outbound', from: '+1 (555) 123-4567', to: '+1 (555) 555-6666', body: 'Following up on our conversation earlier. Let me know if you have any questions!', timestamp: '2024-01-10T12:15:00Z', status: 'delivered' }
  ];

  return { numbers, calls, messages };
};

// Components
const NumberTypeBadge: React.FC<{ type: NumberType }> = ({ type }) => {
  const config: Record<NumberType, { label: string; bg: string; text: string }> = {
    personal_sim: { label: 'Personal SIM', bg: 'bg-purple-100', text: 'text-purple-700' },
    voip: { label: 'VoIP', bg: 'bg-blue-100', text: 'text-blue-700' },
    toll_free: { label: 'Toll-Free', bg: 'bg-green-100', text: 'text-green-700' },
    local: { label: 'Local', bg: 'bg-orange-100', text: 'text-orange-700' }
  };
  const { label, bg, text } = config[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

const ForwardingStatusBadge: React.FC<{ status: ForwardingStatus }> = ({ status }) => {
  const config: Record<ForwardingStatus, { label: string; bg: string; text: string; icon: React.ComponentType<any> }> = {
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
    disabled: { label: 'Disabled', bg: 'bg-slate-100', text: 'text-slate-700', icon: WifiOff }
  };
  const { label, bg, text, icon: Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const CallStatusIcon: React.FC<{ status: CallStatus; direction: 'inbound' | 'outbound' }> = ({ status, direction }) => {
  if (status === 'missed') return <PhoneMissed className="w-4 h-4 text-red-500" />;
  if (status === 'voicemail') return <Voicemail className="w-4 h-4 text-purple-500" />;
  if (status === 'in_progress') return <PhoneCall className="w-4 h-4 text-green-500 animate-pulse" />;
  if (direction === 'inbound') return <PhoneIncoming className="w-4 h-4 text-blue-500" />;
  return <PhoneOutgoing className="w-4 h-4 text-green-500" />;
};

// Format duration
const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

// Main Component
const SIMIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'numbers' | 'calls' | 'messages' | 'settings'>('numbers');
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [addNumberModalOpen, setAddNumberModalOpen] = useState(false);
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<ConnectedNumber | null>(null);
  const [newNumberType, setNewNumberType] = useState<NumberType>('personal_sim');
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('verizon');

  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { numbers, calls, messages } = data;

  // Stats
  const totalCalls = numbers.reduce((sum, n) => sum + n.stats.totalCalls, 0);
  const totalSms = numbers.reduce((sum, n) => sum + n.stats.totalSms, 0);
  const activeNumbers = numbers.filter(n => n.forwardingStatus === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SIM & Number Integration</h1>
          <p className="text-slate-600">Route your personal numbers through CRM without showing on your device</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAddNumberModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Add Number
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Connected Numbers</span>
            <Phone className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{numbers.length}</span>
            <span className="text-sm text-green-600">{activeNumbers} active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Calls</span>
            <PhoneCall className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{totalCalls}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total SMS</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{totalSms}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Avg Response Time</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-green-600">2.1 min</span>
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Unique Feature: Personal SIM Routing</span>
            </div>
            <p className="text-orange-100 text-sm max-w-2xl">
              Connect your personal cell phone SIM and route all calls/texts through your CRM.
              Leads call your personal number but everything is tracked in OrenGen - without showing on your personal device.
              No competitors offer this level of integration.
            </p>
          </div>
          <Zap className="w-12 h-12 text-orange-200" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'numbers', label: 'Numbers', icon: Phone },
            { id: 'calls', label: 'Call History', icon: PhoneCall },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'numbers' && (
        <div className="space-y-4">
          {numbers.map(number => (
            <div key={number.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    number.type === 'personal_sim' ? 'bg-purple-100' :
                    number.type === 'voip' ? 'bg-blue-100' :
                    number.type === 'toll_free' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {number.type === 'personal_sim' ? (
                      <Smartphone className="w-7 h-7 text-purple-600" />
                    ) : (
                      <Phone className="w-7 h-7 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-slate-900">{number.number}</span>
                      <NumberTypeBadge type={number.type} />
                      <ForwardingStatusBadge status={number.forwardingStatus} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span>{number.label}</span>
                      {number.carrier && (
                        <>
                          <span>•</span>
                          <span style={{ color: CARRIER_CONFIG[number.carrier].color }}>
                            {CARRIER_CONFIG[number.carrier].name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedNumber(number);
                      setConfigureModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Configure
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Routing Mode */}
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(ROUTING_CONFIG[number.routingMode].icon, { className: 'w-5 h-5 text-orange-600' })}
                  <span className="font-medium text-slate-900">{ROUTING_CONFIG[number.routingMode].label}</span>
                </div>
                <p className="text-sm text-slate-600">{ROUTING_CONFIG[number.routingMode].description}</p>
                {number.schedule && (
                  <div className="mt-2 text-sm text-slate-500">
                    Business hours: {number.schedule.businessHours.start} - {number.schedule.businessHours.end}
                    {' • '}
                    After hours: {number.schedule.afterHoursAction === 'ai_agent' ? 'AI Agent' :
                                  number.schedule.afterHoursAction === 'voicemail' ? 'Voicemail' : 'Forward'}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  number.voicemailEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Voicemail className="w-4 h-4" />
                  Voicemail {number.voicemailEnabled ? 'On' : 'Off'}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  number.recordCalls ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Volume2 className="w-4 h-4" />
                  Recording {number.recordCalls ? 'On' : 'Off'}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  number.aiAgentEnabled ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Bot className="w-4 h-4" />
                  AI Agent {number.aiAgentEnabled ? 'On' : 'Off'}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{number.stats.totalCalls}</div>
                  <div className="text-xs text-slate-500">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{number.stats.missedCalls}</div>
                  <div className="text-xs text-slate-500">Missed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{number.stats.totalSms}</div>
                  <div className="text-xs text-slate-500">SMS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{number.stats.avgResponseTime}</div>
                  <div className="text-xs text-slate-500">Avg Response</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calls' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Calls</h2>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="all">All Numbers</option>
                {numbers.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {calls.map(call => {
              const number = numbers.find(n => n.id === call.numberId);
              return (
                <div key={call.id} className="p-4 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CallStatusIcon status={call.status} direction={call.direction} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {call.contactName || (call.direction === 'inbound' ? call.from : call.to)}
                          </span>
                          <span className={`text-xs ${call.direction === 'inbound' ? 'text-blue-600' : 'text-green-600'}`}>
                            {call.direction === 'inbound' ? 'Incoming' : 'Outgoing'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {call.direction === 'inbound' ? call.from : call.to}
                          {' → '}
                          {number?.label}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{formatDuration(call.duration)}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(call.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {call.transcription && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1 text-xs text-purple-600">
                        <Voicemail className="w-3 h-3" />
                        Voicemail Transcription
                      </div>
                      <p className="text-sm text-slate-600">{call.transcription}</p>
                    </div>
                  )}
                  {call.notes && (
                    <div className="mt-2 text-sm text-slate-500">
                      <strong>Notes:</strong> {call.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Messages</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">
              <MessageSquare className="w-4 h-4" />
              New Message
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {messages.map(msg => {
              const number = numbers.find(n => n.id === msg.numberId);
              return (
                <div key={msg.id} className="p-4 hover:bg-slate-50 transition">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.direction === 'inbound' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {msg.direction === 'inbound' ? (
                        <ArrowLeft className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {msg.contactName || (msg.direction === 'inbound' ? msg.from : msg.to)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            msg.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            msg.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                            msg.status === 'received' ? 'bg-slate-100 text-slate-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {msg.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{msg.body}</p>
                      <div className="mt-1 text-xs text-slate-400">
                        via {number?.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Global Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">Auto-record all calls</div>
                  <div className="text-sm text-slate-500">Record incoming and outgoing calls for all numbers</div>
                </div>
                <button className="w-12 h-6 bg-orange-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">Voicemail transcription</div>
                  <div className="text-sm text-slate-500">Automatically transcribe voicemail messages</div>
                </div>
                <button className="w-12 h-6 bg-orange-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">SMS notifications</div>
                  <div className="text-sm text-slate-500">Get notified in CRM for incoming SMS</div>
                </div>
                <button className="w-12 h-6 bg-orange-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-slate-900">AI Agent default</div>
                  <div className="text-sm text-slate-500">Enable AI agent by default for new numbers</div>
                </div>
                <button className="w-12 h-6 bg-slate-200 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Twilio Integration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account SID</label>
                <input
                  type="text"
                  placeholder="AC..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Auth Token</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Number Modal */}
      {addNumberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add Phone Number</h2>
                <button
                  onClick={() => setAddNumberModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Number Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Number Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'personal_sim' as NumberType, icon: Smartphone, label: 'Personal SIM', desc: 'Connect your cell phone' },
                    { type: 'voip' as NumberType, icon: Phone, label: 'VoIP Number', desc: 'Get a new number' },
                    { type: 'toll_free' as NumberType, icon: Globe, label: 'Toll-Free', desc: '800/888 number' },
                    { type: 'local' as NumberType, icon: Building, label: 'Local Number', desc: 'Area-specific' }
                  ].map(item => (
                    <button
                      key={item.type}
                      onClick={() => setNewNumberType(item.type)}
                      className={`p-4 rounded-lg border text-left transition ${
                        newNumberType === item.type
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mb-2 ${newNumberType === item.type ? 'text-orange-600' : 'text-slate-500'}`} />
                      <div className={`font-medium ${newNumberType === item.type ? 'text-orange-600' : 'text-slate-900'}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {newNumberType === 'personal_sim' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Select Carrier</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(CARRIER_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedCarrier(key as Carrier)}
                          className={`p-3 rounded-lg border text-left transition ${
                            selectedCarrier === key
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <span
                            className="font-medium"
                            style={{ color: selectedCarrier === key ? config.color : '#1e293b' }}
                          >
                            {config.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <strong>Setup Instructions:</strong>
                        <p className="mt-1">
                          After adding your number, you'll need to set up call forwarding on your phone using:
                        </p>
                        <code className="block mt-2 p-2 bg-blue-100 rounded font-mono text-xs">
                          {CARRIER_CONFIG[selectedCarrier].forwardingCode}[forwarding number]
                        </code>
                        <p className="mt-2">
                          We'll provide the specific forwarding number after setup.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {newNumberType !== 'personal_sim' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {newNumberType === 'toll_free' ? 'Select Toll-Free Prefix' : 'Select Area Code'}
                  </label>
                  {newNumberType === 'toll_free' ? (
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="800">800</option>
                      <option value="888">888</option>
                      <option value="877">877</option>
                      <option value="866">866</option>
                      <option value="855">855</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g., 212, 310, 415"
                      maxLength={3}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Personal Mobile, Business Line"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setAddNumberModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                {newNumberType === 'personal_sim' ? 'Connect Number' : 'Get Number'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Number Modal */}
      {configureModalOpen && selectedNumber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Configure {selectedNumber.label}</h2>
                <button
                  onClick={() => {
                    setConfigureModalOpen(false);
                    setSelectedNumber(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-xl font-semibold text-slate-900">{selectedNumber.number}</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <NumberTypeBadge type={selectedNumber.type} />
                  <ForwardingStatusBadge status={selectedNumber.forwardingStatus} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Routing Mode</label>
                <div className="space-y-2">
                  {Object.entries(ROUTING_CONFIG).map(([mode, config]) => (
                    <label
                      key={mode}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        selectedNumber.routingMode === mode
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="routingMode"
                        checked={selectedNumber.routingMode === mode}
                        onChange={() => {}}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <config.icon className={`w-5 h-5 ${selectedNumber.routingMode === mode ? 'text-orange-600' : 'text-slate-500'}`} />
                      <div>
                        <div className={`font-medium ${selectedNumber.routingMode === mode ? 'text-orange-600' : 'text-slate-900'}`}>
                          {config.label}
                        </div>
                        <div className="text-xs text-slate-500">{config.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Voicemail className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Voicemail</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full relative ${selectedNumber.voicemailEnabled ? 'bg-orange-500' : 'bg-slate-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${selectedNumber.voicemailEnabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Call Recording</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full relative ${selectedNumber.recordCalls ? 'bg-orange-500' : 'bg-slate-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${selectedNumber.recordCalls ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">AI Agent</span>
                  </div>
                  <button className={`w-12 h-6 rounded-full relative ${selectedNumber.aiAgentEnabled ? 'bg-orange-500' : 'bg-slate-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${selectedNumber.aiAgentEnabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </label>
              </div>

              {selectedNumber.type === 'personal_sim' && selectedNumber.forwardingStatus === 'pending' && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Complete Setup:</strong>
                      <p className="mt-1">
                        Dial this code on your phone to activate call forwarding:
                      </p>
                      <code className="block mt-2 p-2 bg-yellow-100 rounded font-mono text-xs">
                        {CARRIER_CONFIG[selectedNumber.carrier || 'other'].forwardingCode}+15551234567#
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-between">
              <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                Remove Number
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setConfigureModalOpen(false);
                    setSelectedNumber(null);
                  }}
                  className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIMIntegration;
