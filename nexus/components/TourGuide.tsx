import React, { useEffect, useState } from 'react';
import { useNexus } from './NexusContext';
import { TOUR_STEPS } from '../constants';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const TourGuide: React.FC = () => {
  const { isTourActive, endTour, tourStepIndex, setTourStepIndex } = useNexus();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = TOUR_STEPS[tourStepIndex];

  useEffect(() => {
    if (!isTourActive) return;

    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // If element not found (e.g. mobile menu closed), maybe skip or end
        console.warn(`Tour target ${currentStep.targetId} not found`);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isTourActive, currentStep, tourStepIndex]);

  if (!isTourActive || !targetRect) return null;

  // Calculate Popover Position
  let top = 0;
  let left = 0;
  const padding = 12;
  const popoverWidth = 320;

  if (currentStep.position === 'right') {
    top = targetRect.top;
    left = targetRect.right + padding;
  } else if (currentStep.position === 'left') {
    top = targetRect.top;
    left = targetRect.left - popoverWidth - padding;
  } else if (currentStep.position === 'bottom') {
    top = targetRect.bottom + padding;
    left = targetRect.left;
  } else {
    top = targetRect.top - 200; // rough estimate height
    left = targetRect.left;
  }

  // Ensure it stays on screen (basic boundary check)
  if (left + popoverWidth > window.innerWidth) left = window.innerWidth - popoverWidth - 20;
  if (top < 0) top = 20;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with hole punch effect using SVG mask or just separate divs. 
          For simplicity, we use semi-transparent overlay everywhere EXCEPT target. 
          But here, just a simple overlay that allows clicks through to the target is complex.
          We will just use a visual spotlight box.
      */}
      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto" />
      
      {/* Spotlight Box */}
      <div 
        className="absolute border-2 border-brand-accent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out box-content"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      {/* Popover Card */}
      <div 
        className="absolute pointer-events-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-80 border border-slate-200 dark:border-slate-700 transition-all duration-300"
        style={{ top, left }}
      >
        <button 
          onClick={endTour}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X size={16} />
        </button>

        <div className="mb-2 text-xs font-bold text-brand-accent uppercase tracking-wider">
          Step {tourStepIndex + 1} of {TOUR_STEPS.length}
        </div>
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{currentStep.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{currentStep.content}</p>

        <div className="flex justify-between items-center">
            <button 
                onClick={() => setTourStepIndex(Math.max(0, tourStepIndex - 1))}
                disabled={tourStepIndex === 0}
                className="p-2 text-slate-500 hover:text-brand-primary disabled:opacity-30"
            >
                <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1">
                {TOUR_STEPS.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === tourStepIndex ? 'bg-brand-accent' : 'bg-slate-300 dark:bg-slate-600'}`} />
                ))}
            </div>

            <button 
                onClick={() => {
                    if (tourStepIndex < TOUR_STEPS.length - 1) {
                        setTourStepIndex(tourStepIndex + 1);
                    } else {
                        endTour();
                    }
                }}
                className="flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-slate-700"
            >
                {tourStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                {tourStepIndex < TOUR_STEPS.length - 1 && <ChevronRight size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;