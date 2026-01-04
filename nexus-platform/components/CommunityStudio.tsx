import React, { useState } from 'react';
import { MOCK_POSTS, MOCK_COURSES } from '../constants';
import { MessageSquare, BookOpen, Users, Trophy, Heart, MessageCircle, Play, Lock, CheckCircle2 } from 'lucide-react';
import { useNexus } from './NexusContext';

const CommunityStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'classroom' | 'leaderboard'>('community');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const renderCommunity = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Create Post */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">ME</div>
          <input 
            type="text" 
            placeholder="Write something to the community..." 
            className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-4 focus:ring-2 focus:ring-brand-accent outline-none"
          />
        </div>
      </div>

      {/* Feed */}
      {MOCK_POSTS.map(post => (
        <div key={post.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
              {post.avatar}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">{post.author}</div>
              <div className="text-xs text-slate-500">{post.category} • {post.timestamp}</div>
            </div>
          </div>
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{post.content}</p>
          <div className="flex items-center gap-6 text-slate-500 text-sm border-t border-slate-100 dark:border-slate-700 pt-4">
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Heart size={18} /> {post.likes} Likes
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <MessageCircle size={18} /> {post.comments} Comments
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClassroom = () => {
    if (selectedCourseId) {
      const course = MOCK_COURSES.find(c => c.id === selectedCourseId);
      if (!course) return null;

      return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <button onClick={() => setSelectedCourseId(null)} className="text-slate-500 hover:text-brand-primary">Back</button>
                <span className="font-bold truncate">{course.title}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                {course.modules.map((mod, idx) => (
                    <div key={mod.id} className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${idx === 0 ? 'bg-brand-accent/5 border-l-4 border-l-brand-accent' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-slate-500">Module {idx + 1}</span>
                            {mod.completed && <CheckCircle2 size={14} className="text-green-500" />}
                        </div>
                        <h4 className="font-medium text-sm">{mod.title}</h4>
                        <span className="text-xs text-slate-400">{mod.duration}</span>
                    </div>
                ))}
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex items-center justify-center group">
             <div className="text-white text-center">
                <Play size={64} className="mx-auto mb-4 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                <h2 className="text-2xl font-bold">Video Player Placeholder</h2>
                <p className="text-slate-400">Streamed from secure CDN</p>
             </div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map(course => (
          <div key={course.id} onClick={() => setSelectedCourseId(course.id)} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className="h-48 bg-slate-200 relative overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-brand-accent h-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>{course.progress}% Complete</span>
                <span>{course.modules.length} Modules</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Community & Courses</h1>
          <p className="text-slate-500">Build your tribe. Monetize your knowledge.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-1">
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'community' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <MessageSquare size={16} /> Community
          </button>
           <button 
            onClick={() => setActiveTab('classroom')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'classroom' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <BookOpen size={16} /> Classroom
          </button>
           <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'leaderboard' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Trophy size={16} /> Leaderboard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {activeTab === 'community' && renderCommunity()}
        {activeTab === 'classroom' && renderClassroom()}
        {activeTab === 'leaderboard' && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Trophy size={48} className="mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Leaderboard Coming Soon</h3>
                <p>Gamify engagement with points and levels.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CommunityStudio;