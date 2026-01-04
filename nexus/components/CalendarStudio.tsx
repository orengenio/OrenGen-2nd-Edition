import React, { useState } from 'react';
import { useNexus } from './NexusContext';
import { CalendarEvent, CalendarProvider } from '../types';
import { ChevronLeft, ChevronRight, Plus, Settings, RefreshCw, Code, CheckCircle2, X, Copy, Globe, Layout, Shield, ExternalLink, Mail, Calendar as CalendarIcon, Link as LinkIcon, Clock, Type } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const CalendarStudio: React.FC = () => {
  const { events, setEvents, providers, setProviders } = useNexus();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'integrations' | 'booking'>('integrations');
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<Partial<CalendarEvent>>({
      title: '',
      type: 'meeting',
      start: new Date(),
      end: new Date()
  });

  // Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Pad start
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
    }
    // Days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const openNewEventModal = (date?: Date) => {
      const start = date || new Date();
      const end = new Date(start);
      end.setHours(start.getHours() + 1);
      setNewEventData({
          title: '',
          type: 'meeting',
          start,
          end,
          providerId: 'local'
      });
      setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
      if (!newEventData.title) return;
      
      const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: newEventData.title,
          start: newEventData.start || new Date(),
          end: newEventData.end || new Date(),
          type: newEventData.type || 'meeting',
          providerId: newEventData.providerId || 'local',
          description: newEventData.description
      };

      setEvents(prev => [...prev, newEvent]);
      setIsEventModalOpen(false);
  };

  const handleConnect = (providerId: string) => {
    setConnectingProvider(providerId);
    // Simulation delay
    setTimeout(() => {
        setProviders(prev => prev.map(p => {
            if (p.id === providerId) {
                return { ...p, connected: !p.connected, email: !p.connected ? 'user@example.com' : undefined };
            }
            return p;
        }));
        setConnectingProvider(null);
        
        // Add fake events if connecting for visual feedback
        const provider = providers.find(p => p.id === providerId);
        if (provider && !provider.connected) {
             const newEvents: CalendarEvent[] = [
                 { id: `new_${Date.now()}_1`, title: `${provider.name} Sync Test`, start: new Date(), end: new Date(), providerId: provider.id, type: 'meeting' },
                 { id: `new_${Date.now()}_2`, title: `Recurring Team Sync`, start: new Date(new Date().setDate(new Date().getDate() + 3)), end: new Date(), providerId: provider.id, type: 'meeting' }
             ];
             setEvents(prev => [...prev, ...newEvents]);
        }

    }, 1200);
  };

  const renderMonthView = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">{d}</div>
            ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {days.map((day, idx) => {
                const dayEvents = day ? events.filter(e => {
                    // Safe parsing because LocalStorage might return strings for dates
                    const eDate = new Date(e.start);
                    return eDate.getDate() === day.getDate() && eDate.getMonth() === day.getMonth() && eDate.getFullYear() === day.getFullYear();
                }) : [];
                
                return (
                    <div 
                        key={idx} 
                        onClick={() => day && openNewEventModal(day)}
                        className={`border-b border-r border-slate-100 dark:border-slate-700/50 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex flex-col gap-1 overflow-hidden ${!day ? 'bg-slate-50/50 dark:bg-slate-900/50 pointer-events-none' : ''}`}
                    >
                        {day && (
                            <>
                                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                                    day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() 
                                    ? 'bg-brand-primary text-white' 
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {day.getDate()}
                                </span>
                                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                                    {dayEvents.map(ev => {
                                        const provider = providers.find(p => p.id === ev.providerId);
                                        return (
                                            <div 
                                                key={ev.id} 
                                                className="text-[10px] px-1.5 py-1 rounded truncate font-medium text-white shadow-sm hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: provider?.color || '#cbd5e1' }}
                                                title={`${ev.title} (${new Date(ev.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`}
                                            >
                                                {ev.title}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-1 bg-brand-primary/10 text-brand-primary rounded-full">
                                        <Plus size={14} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="max-w-4xl mx-auto animate-fadeIn">
        <h3 className="text-xl font-bold mb-2">Connected Accounts</h3>
        <p className="text-slate-500 mb-6">Sync schedules from your email providers. We support OAuth2 and CalDAV.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map(p => (
                <div key={p.id} className="flex flex-col p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: p.color }}>
                            {p.type[0].toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${p.connected ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                            {p.connected ? 'Active' : 'Offline'}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <div className="font-bold text-lg">{p.name}</div>
                        <div className="text-sm text-slate-500 truncate">
                            {p.connected ? `Synced as ${p.email}` : 'Connect your account to sync.'}
                        </div>
                    </div>

                    <button 
                        onClick={() => handleConnect(p.id)}
                        disabled={connectingProvider === p.id}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors border flex items-center justify-center gap-2 ${
                            p.connected 
                            ? 'bg-white hover:bg-red-50 text-red-600 border-slate-200 hover:border-red-200' 
                            : 'bg-brand-primary text-white hover:bg-slate-700 border-transparent'
                        }`}
                    >
                        {connectingProvider === p.id 
                            ? <RefreshCw size={16} className="animate-spin" /> 
                            : (p.connected ? 'Disconnect Account' : 'Connect Account')
                        }
                    </button>
                </div>
            ))}
        </div>
        
         <button className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm flex items-center justify-center gap-2 font-medium transition-colors">
            <Plus size={20} /> Add Custom SMTP / CalDAV Provider
         </button>
    </div>
  );

  const renderBookingTab = () => {
    const bookingLink = `${window.location.origin}/#/book`;

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-brand-accent"/> Your Booking Page</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        This is your public-facing calendar link. Send this to leads or clients to book meetings directly into your Nexus Calendar.
                    </p>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
                        <Globe size={16} className="text-slate-400" />
                        <span className="flex-1 font-mono text-sm truncate text-slate-600 dark:text-slate-300">{bookingLink}</span>
                        <button 
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                            onClick={() => navigator.clipboard.writeText(bookingLink)}
                            title="Copy Link"
                        >
                            <Copy size={16} />
                        </button>
                        <a 
                            href="/#/book" 
                            target="_blank"
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-brand-primary"
                            title="Open Link"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                     <h3 className="font-bold mb-4">Preview</h3>
                     <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                         <div className="text-center">
                            <ExternalLink size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Opens in new tab</p>
                            <Link to="/book" className="mt-2 text-brand-primary font-medium hover:underline block">
                                Open Booking Interface
                            </Link>
                         </div>
                     </div>
                 </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Code size={20} className="text-green-400"/> Embed Code</h3>
                    <p className="text-xs text-slate-400 mb-4">Place this on your website to render the booking widget inline.</p>
                    
                    <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-slate-300 break-all">
                        {`<iframe src="${bookingLink}" width="100%" height="800" frameborder="0"></iframe>`}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Universal Calendar</h1>
          <p className="text-slate-500">Unified schedule backend with multi-provider sync.</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
             <button 
                onClick={() => { setShowSettings(false); }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${!showSettings ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
                <CalendarIcon size={16} />
                Calendar
             </button>
             <button 
                onClick={() => { setShowSettings(true); }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${showSettings ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
             >
                <Settings size={14} /> Sync & Settings
             </button>
        </div>
      </div>

      {!showSettings ? (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrev} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><ChevronLeft size={20}/></button>
                    <h2 className="text-xl font-bold w-40 text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button onClick={handleNext} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><ChevronRight size={20}/></button>
                </div>
                <button onClick={() => openNewEventModal()} className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                    <Plus size={16} /> New Event
                </button>
            </div>
            {renderMonthView()}
          </div>
      ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full animate-fadeIn">
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setSettingsTab('integrations')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        settingsTab === 'integrations'
                        ? 'border-brand-primary text-brand-primary dark:text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Mail size={16} />
                    Integrations
                </button>
                 <button 
                    onClick={() => setSettingsTab('booking')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        settingsTab === 'booking'
                        ? 'border-brand-primary text-brand-primary dark:text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <LinkIcon size={16} />
                    Booking Page
                </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
                {settingsTab === 'integrations' && renderIntegrations()}
                {settingsTab === 'booking' && renderBookingTab()}
            </div>
          </div>
      )}

      {/* Event Creation Modal */}
      {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-in zoom-in-95">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Create New Event</h3>
                      <button onClick={() => setIsEventModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <Type size={14}/> Event Title
                          </label>
                          <input 
                              value={newEventData.title}
                              onChange={e => setNewEventData({...newEventData, title: e.target.value})}
                              placeholder="e.g. Quarterly Review"
                              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-primary"
                              autoFocus
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Clock size={14}/> Type
                              </label>
                              <select 
                                  value={newEventData.type}
                                  onChange={e => setNewEventData({...newEventData, type: e.target.value as any})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                              >
                                  <option value="meeting">Meeting</option>
                                  <option value="task">Task</option>
                                  <option value="deadline">Deadline</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <Layout size={14}/> Calendar
                              </label>
                              <select 
                                  value={newEventData.providerId}
                                  onChange={e => setNewEventData({...newEventData, providerId: e.target.value})}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                              >
                                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                          <textarea 
                              value={newEventData.description}
                              onChange={e => setNewEventData({...newEventData, description: e.target.value})}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none resize-none h-24"
                              placeholder="Notes..."
                          />
                      </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
                      <button onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg font-medium text-sm">Cancel</button>
                      <button onClick={handleSaveEvent} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold text-sm shadow-lg hover:bg-slate-700">Save Event</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CalendarStudio;