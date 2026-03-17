import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisView } from './components/AnalysisView';
import { AppState, AnalysisResult } from './types';
import { analyzeImage } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

console.log('[App] App module loaded');

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('[App] Rendered with state:', appState);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to process image data"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = (file: File) => {
    console.log('[App] Image selected:', file.name, file.type, file.size, 'bytes');
    setSelectedImage(file);
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    console.log('[App] Clearing selection');
    setSelectedImage(null);
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;

    console.log('[App] Starting analysis for:', selectedImage.name);
    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const base64Data = await convertFileToBase64(selectedImage);
      console.log('[App] Image converted to base64, calling analyzeImage...');
      const analysisData = await analyzeImage(base64Data, selectedImage.type);
      console.log('[App] Analysis complete:', analysisData);
      setResult(analysisData);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error('[App] Analysis failed with error:', err);
      setAppState(AppState.ERROR);
      setError(err.message || "An unexpected error occurred during analysis.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-white/20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Section - only show if no result yet */}
        {!result && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Precision Visual Analytics</h2>
            <p className="text-neutral-400 text-lg font-light">
              Upload any image to extract deep aesthetic metrics, composition scores, and color harmony data powered by advanced computer vision.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto">
          <ImageUploader 
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
            isAnalyzing={appState === AppState.ANALYZING}
          />

          {/* Action Button */}
          {appState === AppState.IDLE && selectedImage && (
            <div className="mt-6 flex justify-center animate-fade-in-up">
              <button
                onClick={runAnalysis}
                className="bg-white hover:bg-neutral-200 text-black text-lg font-semibold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center tracking-wide"
              >
                Start Analysis Sequence
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="max-w-3xl mx-auto bg-red-900/20 border border-red-500/40 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {appState === AppState.SUCCESS && result && selectedImage && (
          <div className="pt-8 border-t border-neutral-800">
             <AnalysisView result={result} imageFile={selectedImage} />
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-900 bg-black py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-600 text-sm font-mono">
          <p>TM LOSERWORKS, if you enjoyed this, check out my musical endeavors by searching LoserDub on google!</p>
        </div>
      </footer>
    </div>
  );
};

export default App;