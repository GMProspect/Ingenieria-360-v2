import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Check if script already loaded
        if (window.google && window.google.translate) {
            initTranslate();
            return;
        }

        // Load script
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=initGoogleTranslate';
        script.async = true;
        document.head.appendChild(script);

        // Define global callback
        window.initGoogleTranslate = () => {
            initTranslate();
        };

        return () => {
            // Cleanup
            delete window.initGoogleTranslate;
        };
    }, []);

    const initTranslate = () => {
        if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'es',
                    includedLanguages: 'en,es,pt,fr,de,it,zh-CN,ja,ar,ru,ko',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                },
                'google_translate_element'
            );
        }
    };

    return (
        <div
            id="google_translate_element"
            className="pointer-events-auto"
        ></div>
    );
};

export default GoogleTranslate;
