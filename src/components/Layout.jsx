import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="w-full min-h-screen relative overflow-hidden transition-all duration-300">

                {/* Top Bar / Header for Mobile Toggle */}
                <div className="fixed top-0 left-0 right-0 z-30 p-4 flex items-center pointer-events-none">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="pointer-events-auto p-2 bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Background effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 min-h-[calc(100vh-100px)]">
                    {children}
                </div>

                {/* Dedication Footer */}
                <div className="relative z-1 mt-10 pt-10 border-t border-white/10 text-center pb-8">
                    <p className="text-slate-500 text-sm italic">
                        "Dedicado a todos los ingenieros y técnicos que día a día arriesgan su seguridad y esfuerzo para mantener el mundo en movimiento."
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Layout;
