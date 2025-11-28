import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import GoogleTranslate from './GoogleTranslate';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="w-full min-h-screen relative overflow-hidden transition-all duration-300">

                {/* Top Bar / Header for Mobile Toggle */}
                </div>

                <div className="relative z-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 min-h-[calc(100vh-100px)]">
                    {children}
                </div>

                {/* Dedication Footer */ }
    <div className="relative z-1 mt-10 pt-10 border-t border-white/10 text-center pb-8">
        <p className="text-slate-500 text-sm italic">
            "Dedicado a todos los ingenieros y técnicos que día a día arriesgan su seguridad y esfuerzo para mantener el mundo en movimiento."
        </p>
    </div>
            </main >
        </div >
    );
};

export default Layout;
