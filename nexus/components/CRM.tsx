import React, { useMemo, useState } from 'react';
import { Contact } from '../types';
import { useNexus } from './NexusContext';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import { Search, Plus, MoreHorizontal, Filter, Mail, DollarSign, ArrowUpDown } from 'lucide-react';

const CRM: React.FC = () => {
  const { contacts } = useNexus();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Contact>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Contact Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
              {info.getValue().split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</div>
            <div className="text-xs text-slate-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: info => (
        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{info.getValue()}</div>
          <div className="text-xs text-slate-500">{info.row.original.role}</div>
        </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let color = 'bg-slate-100 text-slate-700';
        if (status === 'Lead') color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        if (status === 'Qualified') color = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
        if (status === 'Customer') color = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        if (status === 'Partner') color = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      }
    }),
    columnHelper.accessor('value', {
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Value
          <ArrowUpDown size={14} />
        </button>
      ),
      cell: info => <span className="font-mono text-slate-600 dark:text-slate-400">{info.getValue()}</span>
    }),
    columnHelper.accessor('lastContact', {
      header: 'Last Contact',
      cell: info => <span className="text-slate-500 text-sm">{info.getValue()}</span>
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <div className="text-right">
             <button className="text-slate-400 hover:text-brand-accent p-1">
                <MoreHorizontal size={20} />
            </button>
        </div>
      )
    })
  ], []);

  const table = useReactTable({
    data: contacts,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nexus CRM</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage relationships and deal flow (Powered by TanStack Table).</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus size={18} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-brand-accent transition-colors"
          />
        </div>
      </div>

      {/* TanStack Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Manual Render using Table Data) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows.map(row => (
            <div key={row.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                             {row.original.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{row.original.name}</div>
                            <div className="text-xs text-slate-500">{row.original.role} at {row.original.company}</div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                        <Mail size={14} />
                        <span className="truncate">{row.original.email}</span>
                    </div>
                     <div className="flex items-center gap-2 text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                        <DollarSign size={14} />
                        <span>{row.original.value}</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CRM;