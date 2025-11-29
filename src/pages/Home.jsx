import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    className="text-cyan-600 hover:text-cyan-400 transition-colors ml-1"
                    >
    Felipe Ruiz
                    </a >
                </p >
    <div className="flex justify-center items-center space-x-4">
        <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
            Política de Privacidad
        </Link>
        <span className="text-slate-700">•</span>
        <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
            Términos de Servicio
        </Link>
        <span className="text-slate-700">•</span>
        <span>v2.1.0 (Super App Beta)</span>
    </div >
            </div >
        </div >
    );
};

export default Home;
