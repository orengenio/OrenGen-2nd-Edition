'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  MoreHorizontal,
  DollarSign,
  Building2,
  User,
  Calendar,
  GripVertical,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date?: string;
  company_name?: string;
  contact_name?: string;
  created_at: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  probability: number;
  deals: Deal[];
}

const DEFAULT_STAGES: Stage[] = [
  { id: 'lead', name: 'Lead', color: '#6366f1', probability: 10, deals: [] },
  { id: 'qualified', name: 'Qualified', color: '#8b5cf6', probability: 25, deals: [] },
  { id: 'proposal', name: 'Proposal', color: '#f59e0b', probability: 50, deals: [] },
  { id: 'negotiation', name: 'Negotiation', color: '#f97316', probability: 75, deals: [] },
  { id: 'closed_won', name: 'Closed Won', color: '#22c55e', probability: 100, deals: [] },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ef4444', probability: 0, deals: [] },
];

// Sortable Deal Card
function DealCard({ deal, isDragging }: { deal: Deal; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-slate-900 dark:text-white truncate flex-1">
          {deal.title}
        </h4>
        <button className="text-slate-400 hover:text-slate-600 ml-2">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-3">
        <DollarSign size={20} className="text-green-500" />
        {deal.value.toLocaleString()}
      </div>

      <div className="space-y-1.5 text-sm">
        {deal.company_name && (
          <div className="flex items-center gap-2 text-slate-500">
            <Building2 size={14} />
            <span className="truncate">{deal.company_name}</span>
          </div>
        )}
        {deal.contact_name && (
          <div className="flex items-center gap-2 text-slate-500">
            <User size={14} />
            <span className="truncate">{deal.contact_name}</span>
          </div>
        )}
        {deal.expected_close_date && (
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} />
            <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {new Date(deal.created_at).toLocaleDateString()}
        </span>
        <span className={`px-2 py-0.5 rounded-full ${
          deal.probability >= 75 ? 'bg-green-100 text-green-700' :
          deal.probability >= 50 ? 'bg-yellow-100 text-yellow-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {deal.probability}%
        </span>
      </div>
    </div>
  );
}

// Stage Column
function StageColumn({ stage, onAddDeal }: { stage: Stage; onAddDeal: () => void }) {
  const totalValue = stage.deals.reduce((sum, d) => sum + d.value, 0);
  const weightedValue = stage.deals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {stage.name}
            </h3>
            <span className="text-slate-400 text-sm">
              ({stage.deals.length})
            </span>
          </div>
          <button
            onClick={onAddDeal}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
          >
            <Plus size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Value Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Total Value</span>
            <span className="font-semibold">${totalValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Weighted</span>
            <span className="font-semibold text-green-600">
              ${Math.round(weightedValue).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Deals */}
        <SortableContext
          items={stage.deals.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[200px]">
            {stage.deals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('lead');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getDeals({ limit: 100 });
      if (res.success && res.data) {
        // Group deals by stage
        const dealsByStage: Record<string, Deal[]> = {};
        DEFAULT_STAGES.forEach(s => dealsByStage[s.id] = []);

        res.data.deals.forEach((deal: Deal) => {
          if (dealsByStage[deal.stage]) {
            dealsByStage[deal.stage].push(deal);
          }
        });

        setStages(DEFAULT_STAGES.map(s => ({
          ...s,
          deals: dealsByStage[s.id] || [],
        })));
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const dealId = event.active.id as string;
    const deal = stages.flatMap(s => s.deals).find(d => d.id === dealId);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const targetStageId = over.id as string;

    // Find current deal and stage
    let currentStageId = '';
    let deal: Deal | undefined;

    for (const stage of stages) {
      const found = stage.deals.find(d => d.id === dealId);
      if (found) {
        deal = found;
        currentStageId = stage.id;
        break;
      }
    }

    if (!deal || currentStageId === targetStageId) return;

    // Optimistically update UI
    const newStages = stages.map(stage => {
      if (stage.id === currentStageId) {
        return { ...stage, deals: stage.deals.filter(d => d.id !== dealId) };
      }
      if (stage.id === targetStageId) {
        const targetStage = DEFAULT_STAGES.find(s => s.id === targetStageId);
        return {
          ...stage,
          deals: [...stage.deals, { ...deal!, stage: targetStageId, probability: targetStage?.probability || 0 }],
        };
      }
      return stage;
    });

    setStages(newStages);

    // Update in backend
    try {
      await apiClient.updateDeal(dealId, {
        stage: targetStageId,
        probability: DEFAULT_STAGES.find(s => s.id === targetStageId)?.probability || 0,
      });
    } catch (err) {
      console.error('Failed to update deal stage:', err);
      fetchDeals(); // Revert on failure
    }
  };

  // Calculate totals
  const totalDeals = stages.reduce((sum, s) => sum + s.deals.length, 0);
  const totalValue = stages.reduce((sum, s) => sum + s.deals.reduce((v, d) => v + d.value, 0), 0);
  const weightedValue = stages.reduce((sum, s) =>
    sum + s.deals.reduce((v, d) => v + d.value * (d.probability / 100), 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pipeline Board
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Drag and drop deals to move them through stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDeals}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Deal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 mb-1">Total Deals</div>
          <div className="text-2xl font-bold">{totalDeals}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 mb-1">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 mb-1">Weighted Pipeline</div>
          <div className="text-2xl font-bold text-green-600">
            ${Math.round(weightedValue).toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-500 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-blue-600">
            {totalDeals > 0
              ? Math.round((stages.find(s => s.id === 'closed_won')?.deals.length || 0) /
                (stages.filter(s => s.id.startsWith('closed_')).reduce((sum, s) => sum + s.deals.length, 0) || 1) * 100)
              : 0}%
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => (
              <StageColumn
                key={stage.id}
                stage={stage}
                onAddDeal={() => {
                  setSelectedStage(stage.id);
                  setShowAddModal(true);
                }}
              />
            ))}
          </div>

          <DragOverlay>
            {activeDeal && <DealCard deal={activeDeal} isDragging />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Add Deal Modal */}
      {showAddModal && (
        <AddDealModal
          stage={selectedStage}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDeals();
          }}
        />
      )}
    </div>
  );
}

// Add Deal Modal
function AddDealModal({
  stage,
  onClose,
  onSuccess,
}: {
  stage: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage,
    expected_close_date: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const stageInfo = DEFAULT_STAGES.find(s => s.id === formData.stage);
      await apiClient.createDeal({
        title: formData.title,
        value: parseFloat(formData.value),
        stage: formData.stage,
        probability: stageInfo?.probability || 0,
        expected_close_date: formData.expected_close_date || undefined,
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to create deal:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Deal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deal Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              placeholder="e.g., Enterprise License - Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value ($)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stage</label>
            <select
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              {DEFAULT_STAGES.filter(s => !s.id.startsWith('closed_')).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expected Close Date</label>
            <input
              type="date"
              value={formData.expected_close_date}
              onChange={e => setFormData({ ...formData, expected_close_date: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
