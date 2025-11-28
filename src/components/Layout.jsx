import React from 'react';
import Sidebar from './Sidebar';
import FeedbackForm from './FeedbackForm';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <main className="ml-64 p-8 min-h-screen relative overflow-hidden">
                {/* Background effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-1 w-full pr-8 mx-auto min-h-[calc(100vh-100px)]">
                    {children}
                </div>

                {/* Dedication Footer */}
                <div className="relative z-1 mt-20 pt-10 border-t border-white/10 text-center pb-8">
                    <p className="text-slate-500 text-sm italic">
                        "Dedicado a todos los ingenieros y técnicos que día a día arriesgan su seguridad y esfuerzo para mantener el mundo en movimiento."
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Layout;
