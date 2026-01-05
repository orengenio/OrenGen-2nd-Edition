import React from 'react';
import { COMPARISON_DATA } from '../constants';

export const ComparisonTable: React.FC = () => {
  return (
    <section id="comparison" className="py-24 bg-white dark:bg-brand-darker scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-black tracking-widest text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-2xl text-gray-900 dark:text-white">
            BIMI Forge <span className="text-brand-orange">VS</span> Everybody
          </h2>
          <div className="h-1 w-32 bg-brand-orange mx-auto rounded-full opacity-80"></div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                {['Tool', 'Primary Function', 'Input Formats', 'Output', 'Price Point (USD)', 'Stand-Alone or Paired', 'Core Limitations', 'Verdict vs BIMI Forge'].map((head) => (
                  <th key={head} className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${row.isWinner ? 'bg-brand-blue/5 dark:bg-brand-blue/10' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {row.tool === 'BIMI Forge' ? (
                      <span className="font-black tracking-wide">
                        BIMI <span className="text-[#CC5500]">FORGE</span>
                      </span>
                    ) : (
                      row.tool
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.function}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.input}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.output}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono">{row.price}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{row.type}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={row.limit}>{row.limit}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-bold ${row.isWinner ? 'text-brand-orange' : 'text-gray-400 dark:text-gray-500'}`}>
                    {row.verdict}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};