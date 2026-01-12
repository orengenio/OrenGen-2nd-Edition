'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    companies: 0,
    contacts: 0,
    deals: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [companies, contacts, deals, leads] = await Promise.all([
        apiClient.getCompanies({ limit: 1 }),
        apiClient.getContacts({ limit: 1 }),
        apiClient.getDeals({ limit: 1 }),
        apiClient.getLeads({ limit: 1 }),
      ]);

      setStats({
        companies: companies.data?.pagination?.total || 0,
        contacts: contacts.data?.pagination?.total || 0,
        deals: deals.data?.pagination?.total || 0,
        leads: leads.data?.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Companies',
      value: stats.companies,
      icon: '🏢',
      href: '/dashboard/companies',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Contacts',
      value: stats.contacts,
      icon: '👥',
      href: '/dashboard/contacts',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Deals',
      value: stats.deals,
      icon: '💰',
      href: '/dashboard/deals',
      color: 'from-orange-500 to-orange-600',
    },
    {
      name: 'Leads',
      value: stats.leads,
      icon: '⚡',
      href: '/dashboard/leads',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome to your CRM overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`text-4xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/companies?action=new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Add Company</p>
              <p className="text-gray-400 text-sm">Create new company record</p>
            </div>
          </Link>

          <Link
            href="/dashboard/contacts?action=new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Add Contact</p>
              <p className="text-gray-400 text-sm">Create new contact</p>
            </div>
          </Link>

          <Link
            href="/dashboard/websites?action=new"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Build Website</p>
              <p className="text-gray-400 text-sm">Create with AI</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to OrenGen CRM!</h2>
        <p className="text-white/90 mb-4">
          Start by adding your first company, or explore the lead generation tools to find new prospects automatically.
        </p>
        <div className="flex gap-3">
          <Link
            href="/dashboard/companies"
            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard/leads"
            className="px-4 py-2 bg-orange-700 text-white rounded-lg font-medium hover:bg-orange-800 transition-colors"
          >
            Explore Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
