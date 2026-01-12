import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
} from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface ReportFilter {
  dateRange: 'today' | '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  groupBy: 'day' | 'week' | 'month';
}

const ReportingDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'leads' | 'engagement'>('overview');
  const [filter, setFilter] = useState<ReportFilter>({
    dateRange: '30d',
    groupBy: 'day',
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Mock metrics data
  const [metrics] = useState<MetricCard[]>([
    { id: '1', title: 'Total Revenue', value: '$127,450', change: 12.5, changeLabel: 'vs last period', icon: DollarSign, color: 'emerald' },
    { id: '2', title: 'New Leads', value: '1,284', change: 8.2, changeLabel: 'vs last period', icon: Target, color: 'blue' },
    { id: '3', title: 'Conversion Rate', value: '4.8%', change: -2.1, changeLabel: 'vs last period', icon: TrendingUp, color: 'purple' },
    { id: '4', title: 'Active Deals', value: '47', change: 15.3, changeLabel: 'vs last period', icon: Activity, color: 'orange' },
    { id: '5', title: 'Contacts Added', value: '892', change: 22.1, changeLabel: 'vs last period', icon: Users, color: 'pink' },
    { id: '6', title: 'Avg Deal Size', value: '$8,420', change: 5.8, changeLabel: 'vs last period', icon: BarChart3, color: 'cyan' },
  ]);

  // Mock chart data
  const [revenueData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Revenue', data: [42000, 38000, 55000, 48000, 62000, 58000], color: '#10b981' },
      { label: 'Target', data: [40000, 45000, 50000, 55000, 60000, 65000], color: '#6b7280' },
    ],
  });

  const [leadSourceData] = useState({
    labels: ['Organic', 'Paid Ads', 'Referral', 'Email', 'Social', 'Direct'],
    data: [320, 280, 190, 150, 120, 80],
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6b7280'],
  });

  const [conversionFunnel] = useState([
    { stage: 'Leads', count: 1284, percentage: 100 },
    { stage: 'Qualified', count: 642, percentage: 50 },
    { stage: 'Proposal', count: 256, percentage: 20 },
    { stage: 'Negotiation', count: 128, percentage: 10 },
    { stage: 'Won', count: 62, percentage: 4.8 },
  ]);

  const [topPerformers] = useState([
    { name: 'Sarah Chen', deals: 12, revenue: 45200, avatar: 'SC' },
    { name: 'Mike Johnson', deals: 10, revenue: 38500, avatar: 'MJ' },
    { name: 'Emily Davis', deals: 8, revenue: 32100, avatar: 'ED' },
    { name: 'Alex Thompson', deals: 7, revenue: 28400, avatar: 'AT' },
    { name: 'Jordan Lee', deals: 6, revenue: 24800, avatar: 'JL' },
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting as ${format}...`);
    // In production, this would generate and download the report
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const renderMetricCard = (metric: MetricCard) => {
    const Icon = metric.icon;
    const isPositive = metric.change >= 0;

    return (
      <div
        key={metric.id}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
            <Icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(metric.change)}%
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{metric.title}</div>
        <div className="text-xs text-slate-400 mt-1">{metric.changeLabel}</div>
      </div>
    );
  };

  const renderBarChart = (data: ChartData, height: number = 200) => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));

    return (
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-4 pb-6">
          {data.labels.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 justify-center" style={{ height: height - 40 }}>
                {data.datasets.map((dataset, di) => (
                  <div
                    key={di}
                    className="w-6 rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${(dataset.data[i] / maxValue) * 100}%`,
                      backgroundColor: dataset.color,
                    }}
                    title={`${dataset.label}: ${dataset.data[i].toLocaleString()}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: { labels: string[]; data: number[]; colors: string[] }) => {
    const total = data.data.reduce((a, b) => a + b, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex items-center gap-8">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.data.map((value, i) => {
              const percentage = (value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={i}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={data.colors[i]}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.labels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.colors[i] }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
              <span className="text-sm font-medium ml-auto">{data.data[i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFunnel = () => (
    <div className="space-y-3">
      {conversionFunnel.map((stage, i) => (
        <div key={stage.stage} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stage.stage}</span>
            <span className="text-sm text-slate-500">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
          </div>
          <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg transition-all duration-500"
              style={{
                width: `${stage.percentage}%`,
                backgroundColor: `hsl(${220 - i * 30}, 80%, ${55 + i * 5}%)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-slate-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-orange-500" />
              Reporting Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Comprehensive analytics and performance metrics</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {filter.dateRange === 'today' && 'Today'}
                  {filter.dateRange === '7d' && 'Last 7 Days'}
                  {filter.dateRange === '30d' && 'Last 30 Days'}
                  {filter.dateRange === '90d' && 'Last 90 Days'}
                  {filter.dateRange === 'custom' && 'Custom Range'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                  {(['today', '7d', '30d', '90d'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        setFilter({ ...filter, dateRange: range });
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                        filter.dateRange === range ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : ''
                      }`}
                    >
                      {range === 'today' && 'Today'}
                      {range === '7d' && 'Last 7 Days'}
                      {range === '30d' && 'Last 30 Days'}
                      {range === '90d' && 'Last 90 Days'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
          {(['overview', 'sales', 'leads', 'engagement'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {metrics.map(renderMetricCard)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm text-slate-500">Monthly revenue vs target</p>
              </div>
              <LineChart className="w-5 h-5 text-emerald-500" />
            </div>
            {renderBarChart(revenueData, 220)}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              {revenueData.datasets.map(dataset => (
                <div key={dataset.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataset.color }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lead Sources</h3>
                <p className="text-sm text-slate-500">Where your leads come from</p>
              </div>
              <PieChart className="w-5 h-5 text-blue-500" />
            </div>
            {renderPieChart(leadSourceData)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Conversion Funnel</h3>
                <p className="text-sm text-slate-500">Lead to customer journey</p>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            {renderFunnel()}
          </div>

          {/* Top Performers */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performers</h3>
                <p className="text-sm text-slate-500">Sales team leaderboard</p>
              </div>
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-4">
              {topPerformers.map((person, i) => (
                <div key={person.name} className="flex items-center gap-4">
                  <div className="text-sm font-bold text-slate-400 w-6">{i + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
                    {person.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{person.name}</div>
                    <div className="text-sm text-slate-500">{person.deals} deals closed</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600">${person.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Deal won', subject: 'Acme Corp - Enterprise License', value: '$45,000', time: '2 hours ago', type: 'success' },
              { action: 'New lead', subject: 'TechStart Inc submitted a demo request', value: null, time: '3 hours ago', type: 'info' },
              { action: 'Meeting scheduled', subject: 'Call with GlobalTech CEO', value: null, time: '5 hours ago', type: 'neutral' },
              { action: 'Proposal sent', subject: 'CloudNine Solutions - Premium Plan', value: '$28,000', time: '6 hours ago', type: 'pending' },
              { action: 'Lead qualified', subject: 'DataFlow Systems moved to qualified', value: null, time: '8 hours ago', type: 'success' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'pending' ? 'bg-yellow-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <span className="font-medium text-slate-900 dark:text-white">{activity.action}: </span>
                  <span className="text-slate-600 dark:text-slate-400">{activity.subject}</span>
                </div>
                {activity.value && (
                  <div className="font-semibold text-emerald-600">{activity.value}</div>
                )}
                <div className="text-sm text-slate-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;
