import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from './NexusContext';
import {
  Plus, ZoomIn, ZoomOut, Share2, Download, Settings,
  MapPin, Search, Trash2, Copy, Link as LinkIcon,
  Wand2, X, ChevronDown, MessageSquare, AlertCircle,
  Eye, Code, MoreVertical, Grid3x3, Type
} from 'lucide-react';

interface SitemapPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  x: number;
  y: number;
  children: string[];
  metadata?: {
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    robots?: string;
  };
  contentOutline?: string[];
  seoScore?: number;
  comments?: Array<{ user: string; text: string; timestamp: string }>;
}

interface SitemapProject {
  id: string;
  name: string;
  pages: SitemapPage[];
  zoomLevel: number;
  panX: number;
  panY: number;
  gridSize: number;
}

const WebsitePlannerStudio: React.FC = () => {
  const { activeProject } = useNexus();
  const [project, setProject] = useState<SitemapProject>({
    id: activeProject?.id || 'default',
    name: activeProject?.name || 'My Website',
    pages: [
      {
        id: 'home',
        title: 'Homepage',
        slug: '/',
        description: 'Main landing page',
        x: 300,
        y: 100,
        children: ['about', 'services'],
        metadata: { robots: 'index, follow' },
        contentOutline: ['Hero Section', 'Features', 'CTA'],
        seoScore: 85,
        comments: []
      }
    ],
    zoomLevel: 1,
    panX: 0,
    panY: 0,
    gridSize: 40
  });

  const [selectedPageId, setSelectedPageId] = useState<string | null>('home');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewOptions, setShowViewOptions] = useState(false);

  const selectedPage = selectedPageId ? project.pages.find(p => p.id === selectedPageId) : null;

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    setProject(prev => ({
      ...prev,
      zoomLevel: direction === 'in'
        ? Math.min(prev.zoomLevel + 0.1, 2)
        : Math.max(prev.zoomLevel - 0.1, 0.5)
    }));
  };

  // Pan canvas
  const handleCanvasDrag = (e: React.MouseEvent) => {
    if (e.button !== 2) return; // Right-click to pan
    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = project.panX;
    const startPanY = project.panY;

    const handleMove = (moveE: MouseEvent) => {
      setProject(prev => ({
        ...prev,
        panX: startPanX + (moveE.clientX - startX),
        panY: startPanY + (moveE.clientY - startY)
      }));
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // Add new page
  const handleAddPage = () => {
    const newPage: SitemapPage = {
      id: `page-${Date.now()}`,
      title: 'New Page',
      slug: '/new-page',
      description: '',
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      children: [],
      metadata: { robots: 'index, follow' },
      contentOutline: [],
      seoScore: 0,
      comments: []
    };
    setProject(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setSelectedPageId(newPage.id);
  };

  // Delete page
  const handleDeletePage = (pageId: string) => {
    setProject(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== pageId)
    }));
    if (selectedPageId === pageId) {
      setSelectedPageId(project.pages[0]?.id || null);
    }
  };

  // Duplicate page
  const handleDuplicatePage = (pageId: string) => {
    const pageToDuplicate = project.pages.find(p => p.id === pageId);
    if (!pageToDuplicate) return;

    const newPage: SitemapPage = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      title: `${pageToDuplicate.title} (Copy)`,
      x: pageToDuplicate.x + 50,
      y: pageToDuplicate.y + 50
    };

    setProject(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
  };

  // Update page position
  const updatePagePosition = (pageId: string, x: number, y: number) => {
    setProject(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === pageId ? { ...p, x, y } : p
      )
    }));
  };

  // Update selected page
  const updateSelectedPage = (updates: Partial<SitemapPage>) => {
    if (!selectedPageId) return;
    setProject(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === selectedPageId ? { ...p, ...updates } : p
      )
    }));
  };

  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // This would call Claude API in production
      const suggestedPages = [
        { title: 'Services', slug: '/services', description: 'Our services overview' },
        { title: 'Pricing', slug: '/pricing', description: 'Pricing plans' },
        { title: 'Blog', slug: '/blog', description: 'Blog posts' },
        { title: 'Contact', slug: '/contact', description: 'Contact us' },
        { title: 'FAQ', slug: '/faq', description: 'Frequently asked questions' }
      ];

      const newPages = suggestedPages.map((suggested, idx) => ({
        id: `page-${Date.now()}-${idx}`,
        ...suggested,
        x: 300 + (idx % 2) * 250,
        y: 300 + Math.floor(idx / 2) * 150,
        children: [] as string[],
        metadata: { robots: 'index, follow' },
        contentOutline: [],
        seoScore: 0,
        comments: []
      }));

      setProject(prev => ({
        ...prev,
        pages: [...prev.pages, ...newPages]
      }));

      setShowAIModal(false);
      setAiPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter pages by search
  const filteredPages = project.pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-brand-dark dark:bg-brand-dark text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-brand-dark/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <MapPin size={24} className="text-brand-orange" />
          <div>
            <h1 className="text-lg font-bold">{project.name}</h1>
            <p className="text-xs text-white/50">{project.pages.length} pages</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-4 py-2 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Wand2 size={18} /> Generate
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 rounded-full border border-brand-orange/50 hover:border-brand-orange text-brand-orange font-medium transition-all flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>

          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setShowViewOptions(!showViewOptions)}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar | Canvas | Properties */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-white/10 flex flex-col bg-white/5 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
              />
            </div>
          </div>

          {/* Page List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {filteredPages.map(page => (
                <div
                  key={page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                    selectedPageId === page.id
                      ? 'bg-brand-orange/20 border border-brand-orange/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{page.title}</p>
                      <p className="text-xs text-white/50 truncate">{page.slug}</p>
                      {page.seoScore !== undefined && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-orange transition-all"
                              style={{ width: `${page.seoScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50">{page.seoScore}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePage(page.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Page Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleAddPage}
              className="w-full py-2 rounded-lg bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/50 text-brand-orange font-medium transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> New Page
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onContextMenu={(e) => {
            e.preventDefault();
            handleCanvasDrag(e);
          }}
          className="flex-1 relative bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/95 overflow-hidden group cursor-grab active:cursor-grabbing"
        >
          {/* Grid Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='${project.gridSize}' height='${project.gridSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M${project.gridSize} 0 L0 0 0${project.gridSize}' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: `${project.gridSize * project.zoomLevel}px ${project.gridSize * project.zoomLevel}px`,
              transform: `translate(${project.panX}px, ${project.panY}px) scale(${project.zoomLevel})`
            }}
            pointerEvents="none"
          />

          {/* Page Cards Container */}
          <div
            style={{
              transform: `translate(${project.panX}px, ${project.panY}px) scale(${project.zoomLevel})`,
              transformOrigin: '0 0'
            }}
            className="absolute inset-0"
          >
            {project.pages.map(page => (
              <PageCard
                key={page.id}
                page={page}
                isSelected={selectedPageId === page.id}
                onSelect={() => setSelectedPageId(page.id)}
                onPositionChange={(x, y) => updatePagePosition(page.id, x, y)}
                onDelete={() => handleDeletePage(page.id)}
                seoScore={page.seoScore}
              />
            ))}
          </div>

          {/* Empty State */}
          {project.pages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <MapPin size={48} className="text-white/20 mb-4" />
              <p className="text-white/40 mb-4">No pages yet. Create one to get started!</p>
              <button
                onClick={handleAddPage}
                className="px-4 py-2 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-medium transition-all"
              >
                Create First Page
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-2">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <div className="text-xs text-white/50 text-center px-2">
              {Math.round(project.zoomLevel * 100)}%
            </div>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 border-l border-white/10 flex flex-col bg-white/5 overflow-hidden">
          {selectedPage ? (
            <>
              {/* Page Header */}
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-lg mb-2">{selectedPage.title}</h3>
                <p className="text-xs text-white/50 mb-4">{selectedPage.slug}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeletePage(selectedPage.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 text-sm font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => handleDuplicatePage(selectedPage.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/50 text-brand-orange text-sm font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Copy size={16} /> Copy
                  </button>
                </div>
              </div>

              {/* Properties Tabs */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase mb-2">Page Title</label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => updateSelectedPage({ title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase mb-2">URL Slug</label>
                    <input
                      type="text"
                      value={selectedPage.slug}
                      onChange={(e) => updateSelectedPage({ slug: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase mb-2">Description</label>
                    <textarea
                      value={selectedPage.description}
                      onChange={(e) => updateSelectedPage({ description: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all h-20 resize-none"
                    />
                  </div>

                  {/* SEO Score */}
                  {selectedPage.seoScore !== undefined && (
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase mb-2">
                        SEO Score: {selectedPage.seoScore}%
                      </label>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-orange transition-all"
                          style={{ width: `${selectedPage.seoScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-semibold text-white/70 uppercase mb-3">Metadata</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Meta Keywords"
                        value={selectedPage.metadata?.keywords || ''}
                        onChange={(e) =>
                          updateSelectedPage({
                            metadata: { ...selectedPage.metadata, keywords: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="OG Title"
                        value={selectedPage.metadata?.ogTitle || ''}
                        onChange={(e) =>
                          updateSelectedPage({
                            metadata: { ...selectedPage.metadata, ogTitle: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="OG Description"
                        value={selectedPage.metadata?.ogDescription || ''}
                        onChange={(e) =>
                          updateSelectedPage({
                            metadata: { ...selectedPage.metadata, ogDescription: e.target.value }
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Comments */}
                  {selectedPage.comments && selectedPage.comments.length > 0 && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-xs font-semibold text-white/70 uppercase mb-3 flex items-center gap-2">
                        <MessageSquare size={14} /> Comments ({selectedPage.comments.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedPage.comments.map((comment, idx) => (
                          <div key={idx} className="bg-white/5 p-2 rounded text-xs">
                            <p className="font-medium text-white/80">{comment.user}</p>
                            <p className="text-white/50">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4">
              <div>
                <AlertCircle size={32} className="text-white/20 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Select a page to edit properties</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Generation Modal */}
      {showAIModal && (
        <AIGenerationModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onGenerate={handleAIGenerate}
          prompt={aiPrompt}
          onPromptChange={setAiPrompt}
          isLoading={isGenerating}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          project={project}
        />
      )}
    </div>
  );
};

// Page Card Component
const PageCard: React.FC<{
  page: SitemapPage;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  onDelete: () => void;
  seoScore?: number;
}> = ({ page, isSelected, onSelect, onPositionChange, onDelete, seoScore }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - page.x,
      y: e.clientY - page.y
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onPositionChange(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);

  return (
    <div
      onClick={onSelect}
      onMouseDown={handleMouseDown}
      className={`absolute w-48 p-4 rounded-xl border-2 transition-all cursor-move select-none ${
        isSelected
          ? 'border-brand-orange bg-brand-orange/20 shadow-lg shadow-brand-orange/50'
          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-brand-orange/50'
      }`}
      style={{
        left: `${page.x}px`,
        top: `${page.y}px`,
        transform: 'translate(-50%, -50%)',
        userSelect: 'none'
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-sm flex-1">{page.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-xs text-white/50 mb-3">{page.slug}</p>

      {seoScore !== undefined && (
        <div className="mb-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-orange"
              style={{ width: `${seoScore}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-1">SEO: {seoScore}%</p>
        </div>
      )}

      {page.children.length > 0 && (
        <p className="text-xs text-brand-orange">↳ {page.children.length} child pages</p>
      )}
    </div>
  );
};

// AI Generation Modal
const AIGenerationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onGenerate, prompt, onPromptChange, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-dark border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Wand2 size={24} className="text-brand-orange" /> Generate with AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-4">
          Describe your website concept and let AI suggest the perfect page structure.
        </p>

        <textarea
          placeholder="E.g., 'E-commerce site for selling organic skincare products targeting millennials...'"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all h-24 resize-none mb-4"
        />

        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" defaultChecked className="rounded" />
            Include blog section
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" defaultChecked className="rounded" />
            Add contact/support pages
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" className="rounded" />
            Include e-commerce features
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-full border border-white/20 hover:border-white/40 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isLoading}
            className="flex-1 py-2 px-4 rounded-full bg-brand-orange hover:bg-brand-orange/90 disabled:bg-brand-orange/50 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={18} /> Generate Sitemap
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Modal
const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project: SitemapProject;
}> = ({ isOpen, onClose, project }) => {
  const [selectedFormat, setSelectedFormat] = useState<'xml' | 'json' | 'csv' | 'pdf'>('xml');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let content = '';
      let filename = `sitemap-${project.name}`;
      let mimeType = 'text/plain';

      if (selectedFormat === 'xml') {
        content = generateXMLSitemap(project);
        filename += '.xml';
        mimeType = 'application/xml';
      } else if (selectedFormat === 'json') {
        content = JSON.stringify(project, null, 2);
        filename += '.json';
        mimeType = 'application/json';
      } else if (selectedFormat === 'csv') {
        content = generateCSVSitemap(project);
        filename += '.csv';
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-brand-dark border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Download size={24} className="text-brand-orange" /> Export Sitemap
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-white/60 mb-4">Choose your export format:</p>

        <div className="space-y-2 mb-6">
          {[
            { id: 'xml', label: 'XML Sitemap', description: 'For Google Search Console' },
            { id: 'json', label: 'JSON', description: 'For developers' },
            { id: 'csv', label: 'CSV', description: 'For spreadsheets' },
            { id: 'pdf', label: 'PDF', description: 'Visual export (Coming soon)' }
          ].map(format => (
            <label
              key={format.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                selectedFormat === format.id
                  ? 'border-brand-orange bg-brand-orange/20'
                  : 'border-white/10 hover:border-white/20'
              } ${format.id === 'pdf' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="format"
                value={format.id}
                checked={selectedFormat === format.id as any}
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                disabled={format.id === 'pdf'}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium text-white">{format.label}</p>
                <p className="text-xs text-white/50">{format.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-full border border-white/20 hover:border-white/40 text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedFormat === 'pdf'}
            className="flex-1 py-2 px-4 rounded-full bg-brand-orange hover:bg-brand-orange/90 disabled:bg-brand-orange/50 text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} /> Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const generateXMLSitemap = (project: SitemapProject): string => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  project.pages.forEach(page => {
    lines.push('  <url>');
    lines.push(`    <loc>${page.slug}</loc>`);
    lines.push(`    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`);
    lines.push('    <priority>0.8</priority>');
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  return lines.join('\n');
};

const generateCSVSitemap = (project: SitemapProject): string => {
  const lines = ['Title,Slug,Description,SEO Score'];
  project.pages.forEach(page => {
    lines.push(`"${page.title}","${page.slug}","${page.description}",${page.seoScore || 0}`);
  });
  return lines.join('\n');
};

export default WebsitePlannerStudio;
