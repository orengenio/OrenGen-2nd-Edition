import React, { useState } from 'react';
import { Video, Users, Mic, Wand2, Play, Clock, Download, Plus, Settings, Globe, Sparkles, MonitorPlay, Upload, Palette } from 'lucide-react';

interface Avatar {
  id: string;
  name: string;
  preview: string;
  style: string;
  languages: string[];
  premium: boolean;
}

interface VideoProject {
  id: string;
  name: string;
  avatar: string;
  duration: string;
  status: 'draft' | 'generating' | 'ready';
  thumbnail: string;
}

const AvatarStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'avatars' | 'projects' | 'webinars'>('create');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>('sarah');
  const [script, setScript] = useState('');

  const avatars: Avatar[] = [
    { id: 'sarah', name: 'Sarah', preview: '👩‍💼', style: 'Professional', languages: ['English', 'Spanish'], premium: false },
    { id: 'marcus', name: 'Marcus', preview: '👨‍💼', style: 'Authoritative', languages: ['English'], premium: false },
    { id: 'mei', name: 'Mei', preview: '👩‍🔬', style: 'Friendly', languages: ['English', 'Mandarin', 'Japanese'], premium: false },
    { id: 'james', name: 'James', preview: '🧑‍💻', style: 'Professional', languages: ['English', 'German'], premium: true },
    { id: 'priya', name: 'Priya', preview: '👩‍🏫', style: 'Warm', languages: ['English', 'Hindi'], premium: false },
    { id: 'carlos', name: 'Carlos', preview: '👨‍🎨', style: 'Casual', languages: ['English', 'Spanish', 'Portuguese'], premium: false },
  ];

  const projects: VideoProject[] = [
    { id: '1', name: 'Product Demo v2', avatar: 'Sarah', duration: '2:34', status: 'ready', thumbnail: '🎬' },
    { id: '2', name: 'Onboarding Welcome', avatar: 'Marcus', duration: '1:45', status: 'ready', thumbnail: '🎬' },
    { id: '3', name: 'Feature Announcement', avatar: 'Mei', duration: '0:58', status: 'generating', thumbnail: '⏳' },
  ];

  const templates = [
    { name: 'Sales Pitch', duration: '1-3 min', icon: '💼' },
    { name: 'Product Demo', duration: '2-5 min', icon: '🖥️' },
    { name: 'Training Module', duration: '5-15 min', icon: '📚' },
    { name: 'Social Short', duration: '15-60 sec', icon: '📱' },
    { name: 'Webinar', duration: '30-60 min', icon: '🎤' },
    { name: 'Testimonial', duration: '30-90 sec', icon: '⭐' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Video className="text-orange-500" /> Avatar Studio
          </h1>
          <p className="text-gray-400 mt-1">Create hyper-realistic AI videos and webinars</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium flex items-center gap-2">
            <Upload size={18} /> Clone Voice
          </button>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> New Video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Videos Created', value: '47', icon: Video, color: 'text-blue-400' },
          { label: 'Total Duration', value: '4.2hrs', icon: Clock, color: 'text-green-400' },
          { label: 'Avatars', value: '6', icon: Users, color: 'text-purple-400' },
          { label: 'Voices', value: '12', icon: Mic, color: 'text-orange-400' },
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
        {['create', 'avatars', 'projects', 'webinars'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Avatar Selection */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Select Avatar</h3>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${selectedAvatar === avatar.id ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}
                >
                  <div className="text-3xl mb-1">{avatar.preview}</div>
                  <div className="text-sm text-white">{avatar.name}</div>
                  <div className="text-xs text-gray-500">{avatar.style}</div>
                  {avatar.premium && <span className="text-xs text-orange-400">PRO</span>}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-white font-medium mb-3">Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((tmpl, i) => (
                  <button key={i} className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-left hover:border-gray-700">
                    <span className="text-xl">{tmpl.icon}</span>
                    <div className="text-sm text-white mt-1">{tmpl.name}</div>
                    <div className="text-xs text-gray-500">{tmpl.duration}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Preview */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Preview</h3>
            <div className="aspect-video bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30" />
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">{avatars.find(a => a.id === selectedAvatar)?.preview || '👤'}</div>
                <div className="text-white font-medium">{avatars.find(a => a.id === selectedAvatar)?.name || 'Select Avatar'}</div>
              </div>
              <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur rounded-full flex items-center gap-2">
                <Play size={16} className="text-white" /> Preview
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-center hover:border-gray-700">
                <Palette size={18} className="mx-auto text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Background</span>
              </button>
              <button className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-center hover:border-gray-700">
                <Mic size={18} className="mx-auto text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Voice</span>
              </button>
              <button className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-center hover:border-gray-700">
                <Settings size={18} className="mx-auto text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Settings</span>
              </button>
            </div>
          </div>

          {/* Right - Script */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Script</h3>
              <button className="text-sm text-orange-400 flex items-center gap-1">
                <Wand2 size={14} /> AI Generate
              </button>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter your script here... The AI will generate a hyper-realistic video with lip-synced avatar."
              className="w-full h-64 bg-gray-900 border border-gray-800 rounded-xl p-4 text-white resize-none focus:border-orange-500 focus:outline-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{script.split(/\s+/).filter(Boolean).length} words</span>
              <span>~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} min</span>
            </div>
            <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center justify-center gap-2">
              <Sparkles size={18} /> Generate Video
            </button>
          </div>
        </div>
      )}

      {/* Avatars Tab */}
      {activeTab === 'avatars' && (
        <div className="grid grid-cols-4 gap-6">
          {avatars.map(avatar => (
            <div key={avatar.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">{avatar.preview}</div>
              <h3 className="text-white font-semibold">{avatar.name}</h3>
              <p className="text-gray-500 text-sm">{avatar.style}</p>
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {avatar.languages.map(lang => (
                  <span key={lang} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">{lang}</span>
                ))}
              </div>
              {avatar.premium && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-orange-500/20 rounded-full text-orange-400">Premium</span>
              )}
              <button className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                Use Avatar
              </button>
            </div>
          ))}
          <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-500 cursor-pointer">
            <Upload size={32} className="text-gray-600 mb-3" />
            <h3 className="text-white font-semibold">Create Custom</h3>
            <p className="text-gray-500 text-sm mt-1">Upload video to clone</p>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-800 flex items-center justify-center text-4xl">
                {project.thumbnail}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{project.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{project.avatar}</span>
                  <span>{project.duration}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-1">
                    <Play size={14} /> Play
                  </button>
                  <button className="flex-1 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-lg text-sm flex items-center justify-center gap-1">
                    <Download size={14} /> Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Webinars Tab */}
      {activeTab === 'webinars' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <MonitorPlay size={48} className="text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">AI Webinar Creator</h3>
                <p className="text-gray-300">Generate complete webinars with AI avatars, slides, and interactive elements</p>
              </div>
              <button className="ml-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium">
                Create Webinar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'How to Scale Your Agency', duration: '45 min', registrations: 234, avatar: 'James', status: 'scheduled' },
              { title: 'AI Marketing Masterclass', duration: '60 min', registrations: 156, avatar: 'Sarah', status: 'replay' },
            ].map((webinar, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{webinar.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">Hosted by {webinar.avatar} • {webinar.duration}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${webinar.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {webinar.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400">{webinar.registrations} registrations</span>
                  <button className="text-orange-400 text-sm">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarStudio;
