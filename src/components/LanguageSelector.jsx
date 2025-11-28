import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' }
    ];

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative pointer-events-auto" ref={dropdownRef}>
            {/* Botón principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
                <Globe size={18} />
                <span className="text-2xl">{currentLang.flag}</span>
                <span className="hidden sm:inline text-sm font-medium">{currentLang.code.toUpperCase()}</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${currentLang.code === lang.code
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'text-slate-300 hover:bg-slate-800/50'
                                }`}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <div className="flex-1 text-left">
                                <div className="font-medium">{lang.name}</div>
                                <div className="text-xs text-slate-500">{lang.code.toUpperCase()}</div>
                            </div>
                            {currentLang.code === lang.code && (
                                <span className="text-cyan-400">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
