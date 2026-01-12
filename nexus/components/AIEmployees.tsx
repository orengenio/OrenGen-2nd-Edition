import React, { useState } from 'react';
import { Users, Bot, Plus, MessageSquare, CheckCircle, Clock, TrendingUp, Zap, Settings, Play, Pause, BarChart3, Briefcase, PenTool, Megaphone, LineChart, Calendar, Search, Mail, Target } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  status: 'active' | 'paused' | 'training';
  tasksCompleted: number;
  tasksInProgress: number;
  qualityScore: number;
  hoursSaved: number;
  skills: string[];
}

interface Task {
  id: string;
  employee: string;
  type: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  time: string;
}

const AIEmployees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'tasks' | 'hire' | 'analytics'>('team');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const employees: Employee[] = [
    { id: '1', name: 'Sofia', avatar: '👩‍💼', role: 'SDR', department: 'Sales', status: 'active', tasksCompleted: 156, tasksInProgress: 3, qualityScore: 94, hoursSaved: 42, skills: ['Cold Email', 'LinkedIn', 'Lead Qualification'] },
    { id: '2', name: 'Alex', avatar: '✍️', role: 'Content Writer', department: 'Marketing', status: 'active', tasksCompleted: 89, tasksInProgress: 2, qualityScore: 96, hoursSaved: 68, skills: ['Blog Posts', 'SEO', 'Research'] },
    { id: '3', name: 'Maya', avatar: '📱', role: 'Social Manager', department: 'Marketing', status: 'active', tasksCompleted: 234, tasksInProgress: 5, qualityScore: 91, hoursSaved: 35, skills: ['Content Creation', 'Engagement', 'Analytics'] },
    { id: '4', name: 'Sam', avatar: '📊', role: 'Data Analyst', department: 'Operations', status: 'active', tasksCompleted: 67, tasksInProgress: 1, qualityScore: 98, hoursSaved: 52, skills: ['Analysis', 'Reporting', 'Forecasting'] },
    { id: '5', name: 'Emma', avatar: '📅', role: 'Executive Assistant', department: 'Operations', status: 'active', tasksCompleted: 312, tasksInProgress: 4, qualityScore: 95, hoursSaved: 89, skills: ['Scheduling', 'Email Mgmt', 'Research'] },
    { id: '6', name: 'Lisa', avatar: '💚', role: 'Customer Success', department: 'Support', status: 'paused', tasksCompleted: 178, tasksInProgress: 0, qualityScore: 97, hoursSaved: 45, skills: ['Onboarding', 'Churn Prevention', 'NPS'] },
  ];

  const tasks: Task[] = [
    { id: '1', employee: 'Sofia', type: 'email_outreach', title: 'Send cold emails to Tech leads', status: 'in_progress', priority: 'high', time: '5m ago' },
    { id: '2', employee: 'Alex', type: 'content_creation', title: 'Write blog post on AI trends', status: 'in_progress', priority: 'medium', time: '12m ago' },
    { id: '3', employee: 'Maya', type: 'social_post', title: 'Schedule Twitter thread', status: 'completed', priority: 'medium', time: '25m ago' },
    { id: '4', employee: 'Sam', type: 'data_analysis', title: 'Weekly revenue report', status: 'completed', priority: 'high', time: '1h ago' },
    { id: '5', employee: 'Emma', type: 'scheduling', title: 'Book investor meetings', status: 'in_progress', priority: 'high', time: '2h ago' },
  ];

  const hireOptions = [
    { id: 'sdr', name: 'Sofia', role: 'SDR', avatar: '👩‍💼', desc: 'Cold outreach & meeting booking', skills: ['Cold Email', 'LinkedIn', 'Qualification'], category: 'Sales' },
    { id: 'writer', name: 'Alex', role: 'Content Writer', avatar: '✍️', desc: 'Blog posts & SEO content', skills: ['Blogs', 'SEO', 'Research'], category: 'Marketing' },
    { id: 'social', name: 'Maya', role: 'Social Manager', avatar: '📱', desc: 'Social media management', skills: ['Content', 'Engagement', 'Analytics'], category: 'Marketing' },
    { id: 'analyst', name: 'Sam', role: 'Data Analyst', avatar: '📊', desc: 'Reports & insights', skills: ['Analysis', 'SQL', 'Visualization'], category: 'Operations' },
    { id: 'ea', name: 'Emma', role: 'Executive Assistant', avatar: '📅', desc: 'Calendar & email management', skills: ['Scheduling', 'Email', 'Research'], category: 'Operations' },
    { id: 'recruiter', name: 'Ryan', role: 'Recruiter', avatar: '🎯', desc: 'Sourcing & screening', skills: ['Sourcing', 'Screening', 'Outreach'], category: 'HR' },
    { id: 'cs', name: 'Lisa', role: 'Customer Success', avatar: '💚', desc: 'Onboarding & retention', skills: ['Onboarding', 'Health Score', 'NPS'], category: 'Support' },
    { id: 'copy', name: 'Jordan', role: 'Copywriter', avatar: '🎨', desc: 'Sales & ad copy', skills: ['Headlines', 'Ads', 'Landing Pages'], category: 'Marketing' },
  ];

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-gray-500/20 text-gray-400',
    training: 'bg-blue-500/20 text-blue-400'
  };

  const priorityColors = {
    low: 'text-gray-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="text-orange-500" /> AI Employees
          </h1>
          <p className="text-gray-400 mt-1">Your autonomous AI workforce - working 24/7</p>
        </div>
        <button onClick={() => setActiveTab('hire')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Hire Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Active Employees', value: '5', icon: Users, color: 'text-green-400' },
          { label: 'Tasks Today', value: '47', icon: CheckCircle, color: 'text-blue-400' },
          { label: 'In Progress', value: '15', icon: Clock, color: 'text-yellow-400' },
          { label: 'Hours Saved', value: '331', icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Avg Quality', value: '95%', icon: Zap, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <stat.icon className={stat.color} size={20} />
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {['team', 'tasks', 'hire', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-3 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                    {emp.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{emp.name}</h3>
                    <p className="text-gray-500 text-sm">{emp.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[emp.status]}`}>
                  {emp.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{emp.tasksCompleted}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{emp.tasksInProgress}</div>
                  <div className="text-xs text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{emp.qualityScore}%</div>
                  <div className="text-xs text-gray-500">Quality</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {emp.skills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">{skill}</span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-1">
                  <MessageSquare size={14} /> Chat
                </button>
                <button className="flex-1 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-lg text-sm flex items-center justify-center gap-1">
                  <Plus size={14} /> Assign
                </button>
                <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                  <Settings size={14} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search tasks..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white" />
            </div>
            <select className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-gray-400">
              <option>All Employees</option>
              {employees.map(e => <option key={e.id}>{e.name}</option>)}
            </select>
            <select className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-gray-400">
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      {employees.find(e => e.name === task.employee)?.avatar || '🤖'}
                    </div>
                    <div>
                      <div className="text-white font-medium">{task.title}</div>
                      <div className="text-gray-500 text-sm">{task.employee} • {task.type.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${priorityColors[task.priority]}`}>{task.priority}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500 text-sm">{task.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hire Tab */}
      {activeTab === 'hire' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-900/30 to-purple-900/30 border border-orange-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Hire Your AI Team</h2>
            <p className="text-gray-300">Each AI employee works autonomously, 24/7, with their own personality and expertise.</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {hireOptions.map(emp => (
              <div key={emp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500 transition-all cursor-pointer group">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 group-hover:bg-orange-500/20 transition-all">
                    {emp.avatar}
                  </div>
                  <h3 className="text-white font-semibold">{emp.name}</h3>
                  <p className="text-orange-400 text-sm">{emp.role}</p>
                </div>
                <p className="text-gray-400 text-sm text-center mb-4">{emp.desc}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {emp.skills.map(skill => (
                    <span key={skill} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-500">{skill}</span>
                  ))}
                </div>
                <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                  Hire {emp.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Tasks by Employee</h3>
            <div className="space-y-4">
              {employees.slice(0, 5).map(emp => (
                <div key={emp.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 flex items-center gap-2">
                      <span>{emp.avatar}</span> {emp.name}
                    </span>
                    <span className="text-white">{emp.tasksCompleted}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${emp.tasksCompleted / 3.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Time Saved by Department</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { dept: 'Sales', hours: 42, icon: Target },
                { dept: 'Marketing', hours: 103, icon: Megaphone },
                { dept: 'Operations', hours: 141, icon: BarChart3 },
                { dept: 'Support', hours: 45, icon: Users },
              ].map((d, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-lg">
                  <d.icon className="text-orange-400 mb-2" size={20} />
                  <div className="text-2xl font-bold text-white">{d.hours}h</div>
                  <div className="text-gray-500 text-sm">{d.dept}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Quality Scores Over Time</h3>
            <div className="h-48 flex items-end justify-around">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const height = 70 + Math.random() * 25;
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div className="w-12 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style={{ height: `${height}%` }} />
                    <span className="text-gray-500 text-sm">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEmployees;
