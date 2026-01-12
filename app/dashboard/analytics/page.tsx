'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  MousePointer,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  Zap,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';

// Types
interface AnalyticsData {
  visitors: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  leadsGenerated: number;
}

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  trend: number;
}

interface PagePerformance {
  path: string;
  views: number;
  avgTime: number;
  bounceRate: number;
  conversions: number;
}

interface DeviceBreakdown {
  device: string;
  sessions: number;
  percentage: number;
}

interface GeoData {
  country: string;
  visitors: number;
  percentage: number;
}

interface ActivityHour {
  hour: number;
  visitors: number;
  conversions: number;
}

// Mock data
const mockAnalytics: AnalyticsData = {
  visitors: 12847,
  pageViews: 45293,
  avgSessionDuration: 234,
  bounceRate: 42.3,
  conversions: 847,
  conversionRate: 6.59,
  revenue: 284500,
  leadsGenerated: 1247,
};

const mockTrafficSources: TrafficSource[] = [
  { source: 'Organic Search', visitors: 5432, percentage: 42.3, trend: 12.5 },
  { source: 'Direct', visitors: 3214, percentage: 25.0, trend: -3.2 },
  { source: 'Social Media', visitors: 2156, percentage: 16.8, trend: 28.4 },
  { source: 'Email Campaigns', visitors: 1289, percentage: 10.0, trend: 8.7 },
  { source: 'Referral', visitors: 756, percentage: 5.9, trend: 15.3 },
];

const mockPagePerformance: PagePerformance[] = [
  { path: '/pricing', views: 8432, avgTime: 187, bounceRate: 32.1, conversions: 234 },
  { path: '/features', views: 6721, avgTime: 245, bounceRate: 38.4, conversions: 156 },
  { path: '/demo', views: 4532, avgTime: 312, bounceRate: 22.8, conversions: 312 },
  { path: '/blog/lead-generation', views: 3876, avgTime: 198, bounceRate: 45.2, conversions: 89 },
  { path: '/contact', views: 2943, avgTime: 156, bounceRate: 28.9, conversions: 156 },
];

const mockDevices: DeviceBreakdown[] = [
  { device: 'Desktop', sessions: 7432, percentage: 57.8 },
  { device: 'Mobile', sessions: 4215, percentage: 32.8 },
  { device: 'Tablet', sessions: 1200, percentage: 9.4 },
];

const mockGeoData: GeoData[] = [
  { country: 'United States', visitors: 6842, percentage: 53.2 },
  { country: 'United Kingdom', visitors: 1543, percentage: 12.0 },
  { country: 'Canada', visitors: 1234, percentage: 9.6 },
  { country: 'Germany', visitors: 876, percentage: 6.8 },
  { country: 'Australia', visitors: 654, percentage: 5.1 },
];

const mockHourlyActivity: ActivityHour[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  visitors: Math.floor(Math.random() * 500 + (i >= 9 && i <= 17 ? 300 : 50)),
  conversions: Math.floor(Math.random() * 30 + (i >= 9 && i <= 17 ? 20 : 2)),
}));

// Heatmap Component
const Heatmap: React.FC<{ data: HeatmapPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap points
    data.forEach(point => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, 30 + point.value * 2
      );

      const intensity = Math.min(point.value / 100, 1);
      gradient.addColorStop(0, `rgba(249, 115, 22, ${intensity})`);
      gradient.addColorStop(0.5, `rgba(249, 115, 22, ${intensity * 0.5})`);
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 30 + point.value * 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full"
    />
  );
};

// Activity Chart Component
const ActivityChart: React.FC<{ data: ActivityHour[] }> = ({ data }) => {
  const maxVisitors = Math.max(...data.map(d => d.visitors));

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((hour, i) => (
        <div
          key={i}
          className="flex-1 group relative"
        >
          <div
            className="bg-orange-500 rounded-t transition-all hover:bg-orange-600"
            style={{ height: `${(hour.visitors / maxVisitors) * 100}%` }}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {hour.hour}:00 - {hour.visitors} visitors
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdvancedAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
  const [loading, setLoading] = useState(false);
  const [activeHeatmapPage, setActiveHeatmapPage] = useState('/pricing');

  // Generate heatmap data for demo
  const [heatmapData] = useState<HeatmapPoint[]>(() =>
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 400,
      value: Math.random() * 100,
    }))
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color?: string;
  }> = ({ title, value, change, icon: Icon, color = 'orange' }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{title}</span>
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-4 h-4 text-${color}-500`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}% vs last period
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              Advanced Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Deep insights into visitor behavior and conversions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
              <RefreshCw className="w-5 h-5 text-slate-500" />
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Visitors"
            value={formatNumber(analytics.visitors)}
            change={12.5}
            icon={Users}
          />
          <MetricCard
            title="Page Views"
            value={formatNumber(analytics.pageViews)}
            change={8.3}
            icon={Eye}
          />
          <MetricCard
            title="Avg. Session"
            value={formatDuration(analytics.avgSessionDuration)}
            change={-2.1}
            icon={Clock}
          />
          <MetricCard
            title="Bounce Rate"
            value={`${analytics.bounceRate}%`}
            change={-5.4}
            icon={Activity}
          />
          <MetricCard
            title="Conversions"
            value={formatNumber(analytics.conversions)}
            change={18.7}
            icon={Target}
            color="emerald"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analytics.conversionRate}%`}
            change={6.2}
            icon={TrendingUp}
            color="emerald"
          />
          <MetricCard
            title="Revenue"
            value={`$${formatNumber(analytics.revenue)}`}
            change={24.3}
            icon={DollarSign}
            color="emerald"
          />
          <MetricCard
            title="Leads Generated"
            value={formatNumber(analytics.leadsGenerated)}
            change={15.8}
            icon={Zap}
            color="blue"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Heatmap */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-orange-500" />
                  Click Heatmap
                </h2>
                <select
                  value={activeHeatmapPage}
                  onChange={(e) => setActiveHeatmapPage(e.target.value)}
                  className="text-sm px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg border-0"
                >
                  {mockPagePerformance.map(page => (
                    <option key={page.path} value={page.path}>{page.path}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5">
              <div className="relative bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden aspect-[3/2]">
                {/* Mock page preview */}
                <div className="absolute inset-0 p-4 opacity-30">
                  <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded mb-4" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded" />
                    <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="mt-4 h-48 bg-slate-300 dark:bg-slate-700 rounded" />
                </div>
                {/* Heatmap overlay */}
                <Heatmap data={heatmapData} />
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-4 h-4 rounded bg-orange-200" />
                  Low
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-4 h-4 rounded bg-orange-400" />
                  Medium
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-4 h-4 rounded bg-orange-600" />
                  High
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Traffic Sources
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {mockTrafficSources.map((source, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {source.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        {formatNumber(source.visitors)}
                      </span>
                      <span className={`text-xs ${source.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {source.trend >= 0 ? '+' : ''}{source.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity & Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-orange-500" />
              Hourly Activity
            </h2>
            <ActivityChart data={mockHourlyActivity} />
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>12AM</span>
              <span>6AM</span>
              <span>12PM</span>
              <span>6PM</span>
              <span>11PM</span>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Monitor className="w-5 h-5 text-orange-500" />
              Device Breakdown
            </h2>
            <div className="space-y-4">
              {mockDevices.map((device, i) => {
                const Icon = device.device === 'Desktop' ? Monitor : device.device === 'Mobile' ? Smartphone : Monitor;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {device.device}
                        </span>
                        <span className="text-sm text-slate-500">
                          {device.percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Performance & Geo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Top Pages
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Page</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Views</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Avg Time</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Conv.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {mockPagePerformance.map((page, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {page.path}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 text-right">
                        {formatNumber(page.views)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 text-right">
                        {formatDuration(page.avgTime)}
                      </td>
                      <td className="px-5 py-4 text-sm text-emerald-600 text-right font-medium">
                        {page.conversions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Geographic Distribution
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {mockGeoData.map((geo, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg">
                    {geo.country === 'United States' && '🇺🇸'}
                    {geo.country === 'United Kingdom' && '🇬🇧'}
                    {geo.country === 'Canada' && '🇨🇦'}
                    {geo.country === 'Germany' && '🇩🇪'}
                    {geo.country === 'Australia' && '🇦🇺'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {geo.country}
                      </span>
                      <span className="text-sm text-slate-500">
                        {formatNumber(geo.visitors)} ({geo.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${geo.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Attribution */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-orange-500" />
            Channel Attribution
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { channel: 'Email', icon: Mail, leads: 423, conversion: 8.2, color: 'blue' },
              { channel: 'Phone', icon: Phone, leads: 287, conversion: 12.5, color: 'emerald' },
              { channel: 'Chat', icon: MessageSquare, leads: 198, conversion: 5.8, color: 'purple' },
              { channel: 'Web Form', icon: Globe, leads: 339, conversion: 6.1, color: 'orange' },
            ].map((ch, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className={`w-10 h-10 rounded-lg bg-${ch.color}-100 dark:bg-${ch.color}-900/30 flex items-center justify-center mb-3`}>
                  <ch.icon className={`w-5 h-5 text-${ch.color}-500`} />
                </div>
                <div className="text-sm text-slate-500 mb-1">{ch.channel}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{ch.leads}</div>
                <div className="text-xs text-emerald-600">{ch.conversion}% conversion</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
