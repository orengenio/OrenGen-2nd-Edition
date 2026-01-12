/**
 * System Health Dashboard
 * Comprehensive monitoring dashboard for system status, performance, and alerts
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Bot,
  Shield,
  Eye,
  Settings,
  Bell,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Cloud,
  Lock,
  Users,
  Calendar,
  FileText
} from 'lucide-react';

// Types
type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';
type AlertSeverity = 'critical' | 'warning' | 'info';

interface SystemService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number; // percentage
  latency: number; // ms
  lastChecked: Date;
  icon: React.ComponentType<any>;
  category: 'core' | 'communication' | 'integrations' | 'ai' | 'infrastructure';
}

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number; // percentage change
  status: 'good' | 'warning' | 'critical';
  threshold?: { warning: number; critical: number };
}

interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  service?: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface SystemEvent {
  id: string;
  type: 'deploy' | 'restart' | 'scale' | 'alert' | 'resolved' | 'maintenance';
  message: string;
  timestamp: Date;
  user?: string;
}

// Mock data generator
const generateMockData = () => {
  const services: SystemService[] = [
    { id: 'api', name: 'API Gateway', description: 'Main REST API', status: 'operational', uptime: 99.98, latency: 45, lastChecked: new Date(), icon: Server, category: 'core' },
    { id: 'database', name: 'Database', description: 'PostgreSQL (Supabase)', status: 'operational', uptime: 99.99, latency: 12, lastChecked: new Date(), icon: Database, category: 'infrastructure' },
    { id: 'cache', name: 'Cache Layer', description: 'Redis caching', status: 'operational', uptime: 99.95, latency: 2, lastChecked: new Date(), icon: Zap, category: 'infrastructure' },
    { id: 'cdn', name: 'CDN', description: 'Asset delivery', status: 'operational', uptime: 99.99, latency: 15, lastChecked: new Date(), icon: Globe, category: 'infrastructure' },
    { id: 'auth', name: 'Authentication', description: 'User auth service', status: 'operational', uptime: 99.97, latency: 85, lastChecked: new Date(), icon: Lock, category: 'core' },
    { id: 'email', name: 'Email Service', description: 'SendGrid/Resend', status: 'operational', uptime: 99.90, latency: 250, lastChecked: new Date(), icon: Mail, category: 'communication' },
    { id: 'sms', name: 'SMS Gateway', description: 'Twilio', status: 'degraded', uptime: 98.50, latency: 450, lastChecked: new Date(), icon: MessageSquare, category: 'communication' },
    { id: 'voip', name: 'VoIP/SIM', description: 'Phone routing', status: 'operational', uptime: 99.80, latency: 120, lastChecked: new Date(), icon: Phone, category: 'communication' },
    { id: 'ai', name: 'AI Services', description: 'OpenAI/Anthropic', status: 'operational', uptime: 99.85, latency: 800, lastChecked: new Date(), icon: Bot, category: 'ai' },
    { id: 'n8n', name: 'Automations', description: 'n8n workflows', status: 'operational', uptime: 99.70, latency: 150, lastChecked: new Date(), icon: Activity, category: 'integrations' },
    { id: 'webhooks', name: 'Webhooks', description: 'Event delivery', status: 'operational', uptime: 99.95, latency: 35, lastChecked: new Date(), icon: Wifi, category: 'integrations' },
    { id: 'storage', name: 'File Storage', description: 'Cloudflare R2', status: 'operational', uptime: 99.99, latency: 25, lastChecked: new Date(), icon: HardDrive, category: 'infrastructure' }
  ];

  const metrics: SystemMetric[] = [
    { id: 'cpu', name: 'CPU Usage', value: 42, unit: '%', trend: -5, status: 'good', threshold: { warning: 70, critical: 90 } },
    { id: 'memory', name: 'Memory Usage', value: 68, unit: '%', trend: 3, status: 'good', threshold: { warning: 80, critical: 95 } },
    { id: 'disk', name: 'Disk Usage', value: 54, unit: '%', trend: 2, status: 'good', threshold: { warning: 80, critical: 95 } },
    { id: 'requests', name: 'Requests/min', value: 12500, unit: 'req', trend: 15, status: 'good' },
    { id: 'errors', name: 'Error Rate', value: 0.12, unit: '%', trend: -20, status: 'good', threshold: { warning: 1, critical: 5 } },
    { id: 'p95_latency', name: 'P95 Latency', value: 180, unit: 'ms', trend: -8, status: 'good', threshold: { warning: 500, critical: 1000 } },
    { id: 'active_users', name: 'Active Users', value: 2847, unit: 'users', trend: 12, status: 'good' },
    { id: 'db_connections', name: 'DB Connections', value: 45, unit: 'conn', trend: 5, status: 'good', threshold: { warning: 80, critical: 100 } }
  ];

  const alerts: SystemAlert[] = [
    { id: 'alert-1', severity: 'warning', title: 'SMS Gateway Latency', message: 'Twilio response times are elevated (450ms avg)', service: 'sms', timestamp: new Date(Date.now() - 15 * 60000), acknowledged: false },
    { id: 'alert-2', severity: 'info', title: 'Scheduled Maintenance', message: 'Database maintenance scheduled for Jan 15, 2:00 AM UTC', timestamp: new Date(Date.now() - 2 * 3600000), acknowledged: true },
    { id: 'alert-3', severity: 'critical', title: 'Previous Outage Resolved', message: 'Email service outage on Jan 10 has been fully resolved', timestamp: new Date(Date.now() - 48 * 3600000), acknowledged: true }
  ];

  const events: SystemEvent[] = [
    { id: 'event-1', type: 'deploy', message: 'Deployed v2.4.1 - New freelance hub features', timestamp: new Date(Date.now() - 2 * 3600000), user: 'CI/CD Pipeline' },
    { id: 'event-2', type: 'scale', message: 'Auto-scaled API servers from 3 to 5 instances', timestamp: new Date(Date.now() - 6 * 3600000) },
    { id: 'event-3', type: 'resolved', message: 'SMS gateway latency resolved', timestamp: new Date(Date.now() - 12 * 3600000) },
    { id: 'event-4', type: 'alert', message: 'High memory usage detected on worker-3', timestamp: new Date(Date.now() - 18 * 3600000) },
    { id: 'event-5', type: 'restart', message: 'Cache service restarted', timestamp: new Date(Date.now() - 24 * 3600000), user: 'System' },
    { id: 'event-6', type: 'deploy', message: 'Deployed v2.4.0 - SIM integration features', timestamp: new Date(Date.now() - 48 * 3600000), user: 'CI/CD Pipeline' }
  ];

  return { services, metrics, alerts, events };
};

// Status badge
const StatusBadge: React.FC<{ status: ServiceStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const config: Record<ServiceStatus, { bg: string; text: string; label: string; dot: string }> = {
    operational: { bg: 'bg-green-100', text: 'text-green-700', label: 'Operational', dot: 'bg-green-500' },
    degraded: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Degraded', dot: 'bg-yellow-500' },
    outage: { bg: 'bg-red-100', text: 'text-red-700', label: 'Outage', dot: 'bg-red-500' },
    maintenance: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Maintenance', dot: 'bg-blue-500' }
  };
  const { bg, text, label, dot } = config[status];

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
};

// Alert severity badge
const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const config: Record<AlertSeverity, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle },
    info: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertCircle }
  };
  const { bg, text, icon: Icon } = config[severity];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

// Main Component
const SystemHealth: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'metrics' | 'alerts' | 'logs'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    setData(generateMockData());

    // Auto refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        setData(generateMockData());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setRefreshing(false);
    }, 1000);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { services, metrics, alerts, events } = data;

  // Calculate overall status
  const operationalCount = services.filter(s => s.status === 'operational').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const outageCount = services.filter(s => s.status === 'outage').length;
  const overallStatus: ServiceStatus =
    outageCount > 0 ? 'outage' :
    degradedCount > 0 ? 'degraded' : 'operational';
  const overallUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Health</h1>
          <p className="text-slate-600">Monitor system status, performance, and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 rounded ${autoRefresh ? 'text-green-600' : 'text-slate-400'}`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <span className="text-xs text-slate-500">Auto-refresh</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Bell className="w-4 h-4" />
            Configure Alerts
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div className={`rounded-xl p-6 ${
        overallStatus === 'operational' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
        overallStatus === 'degraded' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200' :
        'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              overallStatus === 'operational' ? 'bg-green-100' :
              overallStatus === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {overallStatus === 'operational' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : overallStatus === 'degraded' ? (
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                overallStatus === 'operational' ? 'text-green-700' :
                overallStatus === 'degraded' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {overallStatus === 'operational' ? 'All Systems Operational' :
                 overallStatus === 'degraded' ? 'Partial System Degradation' : 'System Outage'}
              </h2>
              <p className={`text-sm ${
                overallStatus === 'operational' ? 'text-green-600' :
                overallStatus === 'degraded' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {operationalCount} of {services.length} services operational • {overallUptime.toFixed(2)}% uptime
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Last updated</div>
            <div className="text-sm font-medium text-slate-700">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {metrics.slice(0, 8).map(metric => (
          <div key={metric.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500 mb-1">{metric.name}</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold ${
                metric.status === 'good' ? 'text-slate-900' :
                metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {typeof metric.value === 'number' && metric.value >= 1000
                  ? `${(metric.value / 1000).toFixed(1)}K`
                  : metric.value}
              </span>
              <span className="text-xs text-slate-500">{metric.unit}</span>
            </div>
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              metric.trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(metric.trend)}%
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'services', label: 'Services', icon: Server },
            { id: 'metrics', label: 'Metrics', icon: BarChart3 },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'logs', label: 'Event Log', icon: FileText }
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
              {tab.id === 'alerts' && alerts.filter(a => !a.acknowledged).length > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {alerts.filter(a => !a.acknowledged).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-slate-900">Service Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl border p-4 ${
                    service.status === 'operational' ? 'border-slate-200' :
                    service.status === 'degraded' ? 'border-yellow-300' : 'border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <service.icon className={`w-5 h-5 ${
                      service.status === 'operational' ? 'text-slate-600' :
                      service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <StatusBadge status={service.status} size="sm" />
                  </div>
                  <h4 className="font-medium text-slate-900 text-sm">{service.name}</h4>
                  <p className="text-xs text-slate-500">{service.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>{service.uptime}% uptime</span>
                    <span>{service.latency}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts & Events */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Active Alerts</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {alerts.filter(a => !a.acknowledged).length > 0 ? (
                  alerts.filter(a => !a.acknowledged).map(alert => (
                    <div key={alert.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <SeverityBadge severity={alert.severity} />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 text-sm">{alert.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{alert.message}</p>
                          <div className="text-xs text-slate-400 mt-2">
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <button className="text-xs text-orange-600 hover:text-orange-700">
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm">No active alerts</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-auto">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        event.type === 'deploy' ? 'bg-blue-500' :
                        event.type === 'alert' ? 'bg-yellow-500' :
                        event.type === 'resolved' ? 'bg-green-500' :
                        'bg-slate-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{event.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                          {event.user && (
                            <span className="text-xs text-slate-500">by {event.user}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Uptime</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Latency</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-slate-500" />
                      <div>
                        <div className="font-medium text-slate-900">{service.name}</div>
                        <div className="text-xs text-slate-500">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={service.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${service.uptime >= 99.9 ? 'text-green-600' : service.uptime >= 99 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {service.uptime}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${service.latency < 100 ? 'text-green-600' : service.latency < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {service.latency}ms
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs capitalize">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="View Details">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Restart Service">
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <div key={metric.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 text-sm">{metric.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  metric.status === 'good' ? 'bg-green-100 text-green-700' :
                  metric.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {metric.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-slate-900">
                  {typeof metric.value === 'number' && metric.value >= 1000
                    ? `${(metric.value / 1000).toFixed(1)}K`
                    : metric.value}
                </span>
                <span className="text-sm text-slate-500">{metric.unit}</span>
              </div>

              {metric.threshold && (
                <div className="mb-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        metric.value < metric.threshold.warning ? 'bg-green-500' :
                        metric.value < metric.threshold.critical ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.threshold.critical) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0</span>
                    <span className="text-yellow-600">{metric.threshold.warning}</span>
                    <span className="text-red-600">{metric.threshold.critical}</span>
                  </div>
                </div>
              )}

              <div className={`flex items-center gap-1 text-sm ${
                metric.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(metric.trend)}% from last period
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-6 ${
                alert.severity === 'critical' ? 'border-red-200' :
                alert.severity === 'warning' ? 'border-yellow-200' :
                'border-slate-200'
              } ${alert.acknowledged ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <SeverityBadge severity={alert.severity} />
                  <div>
                    <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                    <p className="text-slate-600 mt-1">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                      {alert.service && (
                        <span className="flex items-center gap-1">
                          <Server className="w-4 h-4" />
                          {alert.service}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Event Log</h3>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option>All Events</option>
                <option>Deployments</option>
                <option>Alerts</option>
                <option>Restarts</option>
                <option>Scaling</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition text-sm">
                <ExternalLink className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {events.map(event => (
              <div key={event.id} className="p-4 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  event.type === 'deploy' ? 'bg-blue-100' :
                  event.type === 'restart' ? 'bg-purple-100' :
                  event.type === 'scale' ? 'bg-green-100' :
                  event.type === 'alert' ? 'bg-yellow-100' :
                  event.type === 'resolved' ? 'bg-green-100' :
                  'bg-slate-100'
                }`}>
                  {event.type === 'deploy' ? <Cloud className="w-4 h-4 text-blue-600" /> :
                   event.type === 'restart' ? <RotateCcw className="w-4 h-4 text-purple-600" /> :
                   event.type === 'scale' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                   event.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                   event.type === 'resolved' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   <Settings className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-slate-700">{event.message}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span>{new Date(event.timestamp).toLocaleString()}</span>
                    {event.user && <span>by {event.user}</span>}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  event.type === 'deploy' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'restart' ? 'bg-purple-100 text-purple-700' :
                  event.type === 'scale' ? 'bg-green-100 text-green-700' :
                  event.type === 'alert' ? 'bg-yellow-100 text-yellow-700' :
                  event.type === 'resolved' ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
