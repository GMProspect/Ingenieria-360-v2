import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const EducationalSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-8 mb-8 border border-slate-700/50 rounded-2xl overflow-hidden bg-slate-900/30 backdrop-blur-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-200 text-lg">{title}</span>
                </div>
                <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 pt-0 text-slate-300 leading-relaxed border-t border-slate-800/50">
                    <div className="prose prose-invert prose-blue max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationalSection;
