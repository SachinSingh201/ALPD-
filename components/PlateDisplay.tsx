
import React from 'react';
import { DetectionResult } from '../types';

interface PlateDisplayProps {
  result: DetectionResult;
}

const PlateDisplay: React.FC<PlateDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <i className="fas fa-microchip text-emerald-400"></i>
          AI Analysis Results
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          result.confidence === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }`}>
          {result.confidence} Confidence
        </span>
      </div>
      
      <div className="p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-12 py-6 bg-slate-50 border-4 border-slate-800 rounded-lg shadow-inner flex flex-col items-center">
              <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-[0.4em] mb-1">License Plate</span>
              <div className="text-5xl md:text-6xl font-mono font-bold text-slate-900 tracking-widest uppercase">
                {result.plateNumber}
              </div>
              {result.region && (
                <span className="text-[0.65rem] text-slate-500 font-bold mt-2 uppercase tracking-widest">{result.region}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Vehicle Description</span>
              <p className="text-slate-700 font-medium">{result.vehicleDescription}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Detection Origin</span>
              <p className="text-slate-700 font-medium">Gemini 3 Visual OCR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateDisplay;
