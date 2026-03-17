import React from 'react';
import { Camera, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="https://www.jray.me" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-white p-2 rounded-lg">
              <Camera className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                AestheticLens
              </h1>
              <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-semibold">Computational Visual Analysis</p>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <a href="https://www.jray.me" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-sm text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="font-mono text-xs">SYSTEM ONLINE</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};