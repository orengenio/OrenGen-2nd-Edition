import React, { useState } from 'react';
import { 
  Wand2, 
  Image as ImageIcon, 
  Sparkles,
  Zap,
  Loader2,
  Trash2,
  Layers,
  Palette,
  Check,
  CheckSquare,
  X
} from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { ProKeyCheck } from './components/ProKeyCheck';
import { AppMode, IconStyle, ImageSize, GeneratedImage } from './types';
import { STYLE_PRESETS } from './constants';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TRANSFORM);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>(IconStyle.EMOJI_3D);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [proPrompt, setProPrompt] = useState<string>('');
  const [proSize, setProSize] = useState<ImageSize>('1K');
  const [isProKeyReady, setIsProKeyReady] = useState(false);
  const [forceTransparency, setForceTransparency] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // Selection / Bulk Delete State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // State for image edit specific toggle (Preset vs Free Edit)
  const [isFreeEdit, setIsFreeEdit] = useState(false);

  const handleTransform = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      let finalPrompt = '';
      if (selectedStyle === IconStyle.CUSTOM || isFreeEdit) {
        finalPrompt = customPrompt;
      } else {
        const stylePreset = STYLE_PRESETS.find(s => s.id === selectedStyle);
        finalPrompt = stylePreset ? stylePreset.promptSuffix : customPrompt;
        if (customPrompt) {
            finalPrompt += ` ${customPrompt}`;
        }
      }

      finalPrompt += " Ensure high quality output.";
      
      if (forceTransparency) {
        finalPrompt += " STRICT REQUIREMENT: Output a PNG image with a transparent background (RGBA). The subject must be strictly isolated. Do not include any background pixels.";
      }

      const resultBase64 = await geminiService.editImage(selectedImage, finalPrompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: resultBase64,
        prompt: finalPrompt,
        mode: AppMode.TRANSFORM,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newImage, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!proPrompt) return;
    setLoading(true);

    try {
      const resultBase64 = await geminiService.generateProImage(proPrompt, proSize);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: resultBase64,
        prompt: proPrompt,
        mode: AppMode.GENERATE,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newImage, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Ensure your API key is valid for Gemini 3 Pro.");
    } finally {
      setLoading(false);
    }
  };

  // --- Deletion & Selection Logic ---

  const handleDeleteSingle = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
    // Also remove from selection if present
    if (selectedIds.has(id)) {
        const newSet = new Set(selectedIds);
        newSet.delete(id);
        setSelectedIds(newSet);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} images?`)) {
        setHistory(prev => prev.filter(img => !selectedIds.has(img.id)));
        setSelectedIds(new Set());
        setIsSelectionMode(false);
    }
  };

  const handleClearAll = () => {
      if (confirm("Clear all history? This cannot be undone.")) {
          setHistory([]);
          setSelectedIds(new Set());
          setIsSelectionMode(false);
      }
  };

  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedIds(newSet);
  };

  const toggleSelectionMode = () => {
      if (isSelectionMode) {
          // Exiting selection mode
          setIsSelectionMode(false);
          setSelectedIds(new Set());
      } else {
          // Entering selection mode
          setIsSelectionMode(true);
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg">
              <Wand2 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              IconifyAI
            </h1>
          </div>
          <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setMode(AppMode.TRANSFORM)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === AppMode.TRANSFORM 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span>Transform & Edit</span>
              </div>
            </button>
            <button
              onClick={() => setMode(AppMode.GENERATE)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === AppMode.GENERATE 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>Pro Generator</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {mode === AppMode.TRANSFORM ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="text-primary-400" size={20} />
                    Input Image
                  </h2>
                  {selectedImage && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                      Ready
                    </span>
                  )}
                </div>
                <ImageUploader 
                  onImageSelected={setSelectedImage} 
                  selectedImage={selectedImage}
                  onClear={() => setSelectedImage(null)}
                />
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="text-primary-400" size={20} />
                    Style & Edit
                  </h2>
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    <button 
                      onClick={() => setIsFreeEdit(false)}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${!isFreeEdit ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
                    >
                      Presets
                    </button>
                    <button 
                      onClick={() => setIsFreeEdit(true)}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${isFreeEdit ? 'bg-primary-600 text-white' : 'text-slate-400'}`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {!isFreeEdit ? (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {STYLE_PRESETS.filter(s => s.id !== IconStyle.CUSTOM).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id as IconStyle)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          selectedStyle === style.id
                            ? 'bg-primary-500/10 border-primary-500 text-primary-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{style.icon}</span>
                        <span className="text-xs font-medium text-center">{style.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-3 mb-6">
                  <label className="text-sm font-medium text-slate-300">
                    {isFreeEdit ? "Describe your edit" : "Additional Instructions (Optional)"}
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={isFreeEdit ? "e.g. Add a retro filter, remove background..." : "e.g. Make it blue, add a smile..."}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-28"
                  />
                </div>

                <div 
                    onClick={() => setForceTransparency(!forceTransparency)}
                    className="flex items-center gap-3 mb-6 cursor-pointer group"
                >
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${forceTransparency ? 'bg-primary-500 border-primary-500 text-white' : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'}`}>
                        {forceTransparency && <Check size={16} />}
                    </div>
                    <span className="text-sm text-slate-200 group-hover:text-white select-none">Transparent Background</span>
                </div>

                <button
                  onClick={handleTransform}
                  disabled={!selectedImage || loading || (isFreeEdit && !customPrompt)}
                  className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      {isFreeEdit ? "Apply Edit" : "Transform Image"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                 <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-amber-500" size={24} />
                    <div>
                        <h2 className="text-lg font-semibold text-white">Pro Generator</h2>
                        <p className="text-xs text-amber-500">Powered by Gemini 3 Pro</p>
                    </div>
                 </div>

                 {/* API Key Gate for Pro Mode */}
                 {!isProKeyReady ? (
                    <ProKeyCheck onKeySelected={() => setIsProKeyReady(true)} />
                 ) : (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">Image Description</label>
                            <textarea
                                value={proPrompt}
                                onChange={(e) => setProPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate in detail..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none h-32"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">Resolution</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setProSize(size)}
                                        className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                                            proSize === size
                                            ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!proPrompt || loading}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                <Loader2 className="animate-spin" size={20} />
                                Generating...
                                </>
                            ) : (
                                <>
                                <Sparkles size={20} />
                                Generate High-Res Image
                                </>
                            )}
                        </button>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between h-10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-slate-400" size={24} />
                    Gallery
                </h2>
                
                {history.length > 0 && (
                    <div className="flex items-center gap-2">
                        {isSelectionMode ? (
                            <>
                                <span className="text-sm text-slate-400 mr-2">
                                    {selectedIds.size} selected
                                </span>
                                <button 
                                    onClick={toggleSelectionMode}
                                    className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
                                >
                                    <X size={14} /> Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteSelected}
                                    disabled={selectedIds.size === 0}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                                        ${selectedIds.size > 0 
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    <Trash2 size={14} /> Delete ({selectedIds.size})
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={toggleSelectionMode}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2"
                                >
                                    <CheckSquare size={14} /> Select
                                </button>
                                <button 
                                    onClick={handleClearAll}
                                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-red-400 text-sm hover:bg-red-900/20 hover:border-red-900/50 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Clear All
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {history.length === 0 ? (
                    <div className="col-span-full h-96 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                        <div className="p-4 bg-slate-900 rounded-full mb-4">
                            <ImageIcon size={32} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium">No images generated yet</p>
                        <p className="text-sm">Upload an image or start typing to begin</p>
                    </div>
                ) : (
                    history.map((img) => (
                        <ResultCard 
                            key={img.id} 
                            image={img} 
                            onDelete={handleDeleteSingle}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedIds.has(img.id)}
                            onToggleSelect={toggleSelection}
                        />
                    ))
                )}
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;