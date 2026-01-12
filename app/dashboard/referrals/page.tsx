'use client';

import { useState, useEffect } from 'react';
import {
  Users, Gift, DollarSign, TrendingUp, Link2, Copy, Check,
  Share2, Trophy, Target, Zap, Mail, QrCode, RefreshCw,
  ChevronDown, Filter, Download, Plus, Settings, ExternalLink
} from 'lucide-react';

// Types
interface ReferralStats {
  total_referrals: number;
  pending: number;
  signed_up: number;
  qualified: number;
  converted: number;
  rewarded: number;
  total_rewards_paid: number;
  conversion_rate: number;
  avg_deal_value: number;
}

interface Referral {
  id: string;
  referee_email: string;
  referee_name?: string;
  status: string;
  reward_amount?: number;
  reward_status: string;
  deal_value?: number;
  created_at: string;
  converted_at?: string;
}

interface LeaderboardEntry {
  rank: number;
  referrer_id: string;
  referrer_name: string;
  total_referrals: number;
  conversions: number;
  total_rewards: number;
}

// Mock Data
const MOCK_STATS: ReferralStats = {
  total_referrals: 156,
  pending: 23,
  signed_up: 45,
  qualified: 38,
  converted: 42,
  rewarded: 8,
  total_rewards_paid: 4200,
  conversion_rate: 26.9,
  avg_deal_value: 2850,
};

const MOCK_REFERRALS: Referral[] = [
  {
    id: '1',
    referee_email: 'john@example.com',
    referee_name: 'John Smith',
    status: 'converted',
    reward_amount: 100,
    reward_status: 'paid',
    deal_value: 5000,
    created_at: '2024-01-05',
    converted_at: '2024-01-10',
  },
  {
    id: '2',
    referee_email: 'sarah@company.co',
    referee_name: 'Sarah Johnson',
    status: 'qualified',
    reward_status: 'pending',
    created_at: '2024-01-08',
  },
  {
    id: '3',
    referee_email: 'mike@startup.io',
    status: 'signed_up',
    reward_status: 'pending',
    created_at: '2024-01-11',
  },
  {
    id: '4',
    referee_email: 'lisa@tech.com',
    referee_name: 'Lisa Chen',
    status: 'pending',
    reward_status: 'pending',
    created_at: '2024-01-12',
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, referrer_id: '1', referrer_name: 'Alex Thompson', total_referrals: 24, conversions: 8, total_rewards: 800 },
  { rank: 2, referrer_id: '2', referrer_name: 'Maria Garcia', total_referrals: 18, conversions: 6, total_rewards: 600 },
  { rank: 3, referrer_id: '3', referrer_name: 'James Wilson', total_referrals: 15, conversions: 5, total_rewards: 500 },
  { rank: 4, referrer_id: '4', referrer_name: 'Emily Brown', total_referrals: 12, conversions: 4, total_rewards: 400 },
  { rank: 5, referrer_id: '5', referrer_name: 'David Lee', total_referrals: 10, conversions: 3, total_rewards: 300 },
];

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats>(MOCK_STATS);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'leaderboard' | 'settings'>('overview');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const referralLink = 'https://app.orengen.com/signup?ref=ABC123XY';
  const referralCode = 'ABC123XY';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
      case 'rewarded':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'qualified':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'signed_up':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Referral Program</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Earn rewards by referring new customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Share2 size={18} />
            Share Link
          </button>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Your Referral Link</h2>
            <p className="text-white/80 text-sm">Share this link to earn $100 for each successful referral</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg px-4 py-2 font-mono text-sm backdrop-blur">
              {referralLink}
            </div>
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">{stats.total_referrals}</div>
            <div className="text-sm text-white/80">Total Referrals</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">{stats.converted}</div>
            <div className="text-sm text-white/80">Conversions</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
            <div className="text-sm text-white/80">Conversion Rate</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
            <div className="text-2xl font-bold">${stats.total_rewards_paid}</div>
            <div className="text-sm text-white/80">Rewards Earned</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        {['overview', 'referrals', 'leaderboard', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-4">Referral Funnel</h3>
            <div className="space-y-4">
              {[
                { label: 'Sent', value: stats.total_referrals, color: 'bg-slate-500' },
                { label: 'Signed Up', value: stats.signed_up, color: 'bg-purple-500' },
                { label: 'Qualified', value: stats.qualified, color: 'bg-blue-500' },
                { label: 'Converted', value: stats.converted, color: 'bg-green-500' },
                { label: 'Rewarded', value: stats.rewarded, color: 'bg-yellow-500' },
              ].map((step, i) => (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{step.label}</span>
                    <span className="font-medium">{step.value}</span>
                  </div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-lg transition-all duration-500`}
                      style={{ width: `${(step.value / stats.total_referrals) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { icon: Link2, title: 'Share Your Link', desc: 'Send your unique referral link to friends' },
                { icon: Users, title: 'They Sign Up', desc: 'Your referral creates an account' },
                { icon: Target, title: 'They Convert', desc: 'They become a paying customer' },
                { icon: Gift, title: 'Earn Rewards', desc: 'Get $100 for each conversion!' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <step.icon size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-slate-500">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Current Reward</div>
              <div className="text-2xl font-bold">$100 per referral</div>
              <div className="text-xs text-slate-500 mt-1">When your referral becomes a paying customer</div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">Your Referrals</h3>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-left text-sm text-slate-500">
                  <th className="px-4 py-3 font-medium">Referral</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Deal Value</th>
                  <th className="px-4 py-3 font-medium">Reward</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {referrals.map(referral => (
                  <tr key={referral.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{referral.referee_name || 'Unnamed'}</div>
                      <div className="text-sm text-slate-500">{referral.referee_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(referral.status)}`}>
                        {referral.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {referral.deal_value ? `$${referral.deal_value.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {referral.reward_amount ? (
                        <div>
                          <div className="font-medium text-green-600">${referral.reward_amount}</div>
                          <div className={`text-xs ${
                            referral.reward_status === 'paid' ? 'text-green-500' : 'text-yellow-500'
                          }`}>
                            {referral.reward_status}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold">Top Referrers</h3>
            <p className="text-sm text-slate-500">This month's top performers</p>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {leaderboard.map(entry => (
              <div key={entry.referrer_id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                    entry.rank === 2 ? 'bg-slate-100 text-slate-600' :
                    entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {entry.rank <= 3 ? <Trophy size={20} /> : entry.rank}
                  </div>
                  <div>
                    <div className="font-medium">{entry.referrer_name}</div>
                    <div className="text-sm text-slate-500">
                      {entry.total_referrals} referrals • {entry.conversions} conversions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${entry.total_rewards}</div>
                  <div className="text-xs text-slate-500">earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-4">Referral Code</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
              />
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Email me when someone signs up', checked: true },
                { label: 'Email me when a referral converts', checked: true },
                { label: 'Email me when I earn a reward', checked: true },
                { label: 'Weekly referral summary', checked: false },
              ].map((setting, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">{setting.label}</span>
                  <input type="checkbox" defaultChecked={setting.checked} className="rounded" />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Share Your Referral Link</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Share via</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Email', icon: Mail, color: 'bg-blue-500' },
                    { name: 'Twitter', icon: ExternalLink, color: 'bg-sky-500' },
                    { name: 'LinkedIn', icon: ExternalLink, color: 'bg-blue-700' },
                    { name: 'WhatsApp', icon: ExternalLink, color: 'bg-green-500' },
                  ].map(platform => (
                    <button
                      key={platform.name}
                      className="flex flex-col items-center gap-1 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <div className={`p-2 rounded-full ${platform.color}`}>
                        <platform.icon size={16} className="text-white" />
                      </div>
                      <span className="text-xs">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center py-4">
                <div className="p-4 bg-white rounded-xl shadow-inner">
                  <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                    <QrCode size={80} className="text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
