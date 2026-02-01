
import React, { useState, useRef, useCallback } from 'react';
import { analyzePlate } from './services/geminiService';
import { DetectionResult, HistoryItem } from './types';
import PlateDisplay from './components/PlateDisplay';
import HistoryPanel from './components/HistoryPanel';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    try {
      const detection = await analyzePlate(selectedImage);
      setResult(detection);
      
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: selectedImage,
        result: detection,
        timestamp: Date.now(),
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 6));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSelectedImage(item.imageUrl);
    setResult(item.result);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <i className="fas fa-car-side text-slate-900 text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ALPD <span className="text-emerald-400 font-light">SYSTEM</span></h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition-colors">Overview</a>
            <a href="#" className="text-sm font-medium hover:text-emerald-400 transition-colors">Documentation</a>
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all border border-slate-700">
              Settings
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input/Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900">Vehicle Identification</h2>
              <p className="text-slate-500">Upload a clear photo of the vehicle rear or front to detect its license plate using advanced AI vision.</p>
            </div>

            <div className="relative group">
              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                    <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 group-hover:text-emerald-600"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Select Image to Scan</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Supports JPG, PNG and WebP. For best results, ensure the plate is clearly visible and well-lit.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-full h-auto object-contain max-h-[500px]" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={reset}
                      className="bg-white/90 backdrop-blur hover:bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all"
                      title="Clear image"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                      <div className="w-16 h-16 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
                      <p className="font-semibold animate-pulse">Scanning Image...</p>
                      <p className="text-xs text-slate-300 mt-2">Processing with Gemini Vision AI</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedImage && !isProcessing && !result && (
              <button 
                onClick={processImage}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <i className="fas fa-search"></i>
                Analyze Plate
              </button>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-1"></i>
                <div>
                  <h4 className="text-red-800 font-bold text-sm">Analysis Failed</h4>
                  <p className="text-red-700 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            {result ? (
              <PlateDisplay result={result} />
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center sticky top-28">
                <div className="text-slate-200 text-6xl mb-6">
                  <i className="fas fa-barcode"></i>
                </div>
                <h3 className="text-slate-400 font-medium">Detection results will appear here after analysis.</h3>
                <p className="text-slate-300 text-xs mt-2">ALPD uses computer vision to extract plates and identify vehicles.</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <HistoryPanel 
          history={history} 
          onSelectItem={loadFromHistory} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="bg-slate-900 p-1.5 rounded-md">
              <i className="fas fa-car-side text-white text-xs"></i>
            </div>
            <span className="font-bold text-slate-900">ALPD</span>
            <span className="text-slate-500 text-sm">© 2024 Intelligent Transport Systems</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">API Access</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
