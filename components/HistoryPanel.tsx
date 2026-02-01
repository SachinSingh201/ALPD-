
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <i className="fas fa-history text-slate-400"></i>
        Recent Scans
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-3 relative">
              <img src={item.imageUrl} alt="Scan result" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">View Details</span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-mono font-bold text-slate-800 uppercase leading-none">
                  {item.result.plateNumber}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.result.confidence === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {item.result.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
