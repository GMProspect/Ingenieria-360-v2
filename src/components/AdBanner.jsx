import React, { useEffect } from 'react';

const AdBanner = ({ dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = 'true' }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="my-8 flex justify-center overflow-hidden">
            <ins className="adsbygoogle"
                style={{ display: 'block', minWidth: '300px', minHeight: '100px' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Placeholder, user needs to replace
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive}>
            </ins>
        </div>
    );
};

export default AdBanner;
