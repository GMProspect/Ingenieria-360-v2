import React, { useEffect, useState, useRef } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslateCustom = () => {
    const [isReady, setIsReady] = useState(false);
    const [currentLang, setCurrentLang] = useState('es');
    const [isOpen, setIsOpen] = useState(false);
    const checkInterval = useRef(null);

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ];

    useEffect(() => {
        // Load script
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        // Initialize
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'es',
                includedLanguages: 'en,es,pt,fr,de,it,zh-CN,ja,ar,ru,ko',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');

            // Wait for the select to appear
            checkInterval.current = setInterval(() => {
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                    setIsReady(true);
                    clearInterval(checkInterval.current);
                }
            }, 100);
        };

        return () => {
            if (checkInterval.current) clearInterval(checkInterval.current);
        };
    }, []);

    const changeLanguage = (langCode) => {
        if (!isReady) {
            alert('El traductor aún se está cargando. Intenta de nuevo en un momento.');
            return;
        }

        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
            setCurrentLang(langCode);
            setIsOpen(false);
        }
    };

    const currentLangData = languages.find(l => l.code === currentLang) || languages[0];

    return (
        <div className="relative pointer-events-auto">
            {/* Hidden Google Translate */}
            <div id="google_translate_element" className="hidden"></div>

            {/* Custom button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                title="Cambiar idioma / Change language"
            >
                <Globe size={18} />
                <span className="text-2xl">{currentLangData.flag}</span>
                <span className="hidden sm:inline text-sm font-medium">{currentLangData.code.toUpperCase()}</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/98 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                disabled={!isReady}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${currentLang === lang.code
                                        ? 'bg-cyan-500/20 text-cyan-300'
                                        : 'text-slate-300 hover:bg-slate-800/50'
                                    } ${!isReady ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                            >
                                <span className="text-2xl">{lang.flag}</span>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm">{lang.name}</div>
                                </div>
                                {currentLang === lang.code && (
                                    <span className="text-cyan-400">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GoogleTranslateCustom;
