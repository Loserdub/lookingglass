import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Sparkles, Eye, Zap, Layers, Activity, Heart, Brain, Crosshair, Grid } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  imageFile: File;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, imageFile }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [overlayMode, setOverlayMode] = useState<'none' | 'phi' | 'spiral'>('phi');

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const radarData = result.metrics.map(m => ({
    subject: m.name,
    A: m.score,
    fullMark: 10,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBarColor = (score: number) => {
    if (score >= 8) return '#34d399'; // emerald-400
    if (score >= 5) return '#facc15'; // yellow-400
    return '#f87171'; // red-400
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-white" />
          </div>
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Global Aesthetic Score</h3>
          <div className="flex items-end">
            <span className={`text-6xl font-bold tracking-tighter ${getScoreColor(result.globalScore)}`}>
              {result.globalScore.toFixed(1)}
            </span>
            <span className="text-xl text-neutral-500 mb-2 ml-2 font-light">/ 10.0</span>
          </div>
          <div className="mt-4 w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white" 
              style={{ width: `${(result.globalScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-neutral-600 mt-2 text-right font-mono">REF: SCUT-FBP5500</p>
        </div>

        <div className="md:col-span-2 bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Metric Breakdown</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData} layout="vertical" margin={{ left: 100, right: 20 }}>
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis type="category" dataKey="subject" width={140} tick={{ fill: '#a3a3a3', fontSize: 12, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000', borderColor: '#404040', color: '#f5f5f5' }} 
                  cursor={{ fill: '#262626', opacity: 0.4 }}
                />
                <Bar dataKey="A" radius={[0, 4, 4, 0]} barSize={20}>
                  {radarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.A)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Composition Geometry */}
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2">
                  <Grid className="h-5 w-5 text-neutral-300" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Compositional Geometry</h3>
               </div>
               <div className="flex bg-black rounded-lg p-1 border border-neutral-800">
                  <button 
                    onClick={() => setOverlayMode('none')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${overlayMode === 'none' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Clean
                  </button>
                  <button 
                    onClick={() => setOverlayMode('phi')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${overlayMode === 'phi' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Phi Grid
                  </button>
                  <button 
                    onClick={() => setOverlayMode('spiral')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${overlayMode === 'spiral' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                  >
                    Spiral
                  </button>
               </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden bg-black border border-neutral-800 flex justify-center items-center min-h-[300px]">
               {imageUrl && (
                 <div className="relative inline-block max-h-[500px]">
                    <img src={imageUrl} alt="Analysis Source" className="max-w-full max-h-[500px] object-contain opacity-90" />
                    
                    {/* Phi Grid Overlay */}
                    {overlayMode === 'phi' && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 bottom-0 left-[38.2%] w-px bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                        <div className="absolute top-0 bottom-0 left-[61.8%] w-px bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                        <div className="absolute left-0 right-0 top-[38.2%] h-px bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                        <div className="absolute left-0 right-0 top-[61.8%] h-px bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                        
                        <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/80 px-2 py-1 rounded border border-neutral-700 font-mono">
                          PHI GRID (1:1.618)
                        </div>
                      </div>
                    )}

                    {/* Golden Spiral Overlay */}
                    {overlayMode === 'spiral' && (
                      <div className="absolute inset-0 pointer-events-none opacity-80">
                         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path 
                             d="M 100 0 L 0 0 L 0 100 L 100 100 L 100 38.2 L 38.2 38.2 L 38.2 82 L 82 82 L 82 52 L 52 52" 
                             fill="none" 
                             stroke="rgba(255, 255, 255, 0.4)" 
                             strokeWidth="0.5"
                             vectorEffect="non-scaling-stroke"
                             strokeDasharray="2,2"
                           />
                           <path
                             d="M 100 0 Q 0 0 0 100 Q 0 100 100 100 Q 100 38.2 38.2 38.2 Q 38.2 82 82 82 Q 82 52 52 52"
                             fill="none"
                             stroke="#ffffff"
                             strokeWidth="1"
                             vectorEffect="non-scaling-stroke"
                             className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                           />
                         </svg>
                         <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/80 px-2 py-1 rounded border border-neutral-700 font-mono">
                           GOLDEN SPIRAL
                         </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
            <p className="text-neutral-500 text-sm mt-4 font-light">
              <span className="text-white font-medium">Why this matters:</span> Aligning the subject's eyes or key focal points with the grid intersections (Golden Points) naturally draws the human eye and creates a sense of organic balance.
            </p>
          </div>

          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
             <div className="flex items-center space-x-2 mb-4">
                <Layers className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Technical Critique</h3>
             </div>
             <p className="text-neutral-300 leading-relaxed text-sm md:text-base font-light">
               {result.critique}
             </p>
          </div>

          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
             <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Visual Hotspots</h3>
             </div>
             <div className="flex flex-wrap gap-2">
               {result.visualHotspots.map((spot, idx) => (
                 <span key={idx} className="px-3 py-1 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-full text-xs font-mono uppercase tracking-wide">
                   {spot}
                 </span>
               ))}
             </div>
          </div>

          {/* Emotional Impact */}
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
             <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Emotional Impact</h3>
             </div>
             <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex-1 w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-500 text-sm font-mono uppercase">Intensity</span>
                    <span className="text-white font-bold">{result.emotionalImpact.score.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white" 
                      style={{ width: `${(result.emotionalImpact.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                   {result.emotionalImpact.keywords.map((mood, idx) => (
                      <span key={idx} className="px-3 py-1 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full text-xs font-medium uppercase tracking-wide">
                        {mood}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Metadata, Radar, Complexity */}
        <div className="space-y-6">
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 flex flex-col items-center justify-center">
             <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 self-start">Aesthetic Fingerprint</h3>
             <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#404040" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10, fontFamily: 'monospace' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#ffffff"
                    strokeWidth={2}
                    fill="#ffffff"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
             </div>
          </div>

          {/* Intent Analysis / Thirst-Trap Detection */}
          {result.intentMetrics && (
            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 relative overflow-hidden">
              {/* Optional background glow for high intent */}
              {result.intentMetrics.detected && result.intentMetrics.effortScore > 7 && (
                 <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
              )}
              
              <div className="flex items-center space-x-2 mb-4 relative z-10">
                <Crosshair className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Behavioral Intent</h3>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm">Category</span>
                  <span className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-200 border border-neutral-700 font-mono">
                    {result.intentMetrics.category}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500 uppercase font-mono">Staging Effort</span>
                      <span className="text-neutral-300 font-mono">{result.intentMetrics.effortScore}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full">
                      <div 
                        className="h-full bg-white/60 rounded-full" 
                        style={{ width: `${(result.intentMetrics.effortScore / 10) * 100}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-500 uppercase font-mono">Aesthetic Yield</span>
                      <span className="text-neutral-300 font-mono">{result.intentMetrics.outcomeScore}/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full">
                      <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: `${(result.intentMetrics.outcomeScore / 10) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 italic pt-2 border-t border-neutral-800">
                  "{result.intentMetrics.description}"
                </p>
              </div>
            </div>
          )}

          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
             <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Technical Metadata</h3>
             </div>
             <div className="space-y-4">
               <div>
                 <span className="text-xs text-neutral-500 uppercase font-mono">Sharpness</span>
                 <p className="text-neutral-200 font-light">{result.technicalMetadata.sharpness}</p>
               </div>
               <div>
                 <span className="text-xs text-neutral-500 uppercase font-mono">Lighting Profile</span>
                 <p className="text-neutral-200 font-light">{result.technicalMetadata.lighting}</p>
               </div>
               <div>
                 <span className="text-xs text-neutral-500 uppercase font-mono">Palette</span>
                 <div className="flex gap-2 mt-2">
                   {result.technicalMetadata.colorPalette.map((color, i) => (
                     <div 
                      key={i} 
                      className="w-8 h-8 rounded-full border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                     />
                   ))}
                 </div>
               </div>
             </div>
          </div>

          {/* Visual Complexity */}
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
             <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-5 w-5 text-neutral-300" />
                <h3 className="text-lg font-bold text-white tracking-tight">Visual Complexity</h3>
             </div>
             <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-neutral-200 text-sm font-medium">{result.visualComplexity.description}</span>
                  <span className="text-white font-bold">{result.visualComplexity.score.toFixed(1)}</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-1">
                   <div 
                      className="h-full bg-gradient-to-r from-neutral-600 to-white" 
                      style={{ width: `${(result.visualComplexity.score / 10) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                  <span>Minimalist</span>
                  <span>Intricate</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};