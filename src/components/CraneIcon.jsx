import React from 'react';

const CraneIcon = ({ size = 80, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Base */}
        <path d="M10 90 L90 90" strokeWidth="4" />
        <path d="M30 90 L30 80 L70 80 L70 90" />

        {/* Tower Structure */}
        <path d="M40 80 L40 20" strokeWidth="3" />
        <path d="M60 80 L60 20" strokeWidth="3" />
        {/* Cross bracing for tower */}
        <path d="M40 70 L60 60" />
        <path d="M60 70 L40 60" />
        <path d="M40 50 L60 40" />
        <path d="M60 50 L40 40" />
        <path d="M40 30 L60 20" />

        {/* Cab */}
        <rect x="35" y="15" width="30" height="15" rx="2" fill="currentColor" fillOpacity="0.1" />

        {/* Jib (Arm) */}
        <path d="M50 20 L95 20" strokeWidth="3" />
        <path d="M50 20 L50 10 L95 20" /> {/* Support cable */}

        {/* Counter Jib */}
        <path d="M50 20 L15 20" strokeWidth="3" />
        <rect x="15" y="15" width="10" height="10" fill="currentColor" /> {/* Counterweight */}

        {/* Hook Cable */}
        <path d="M85 20 L85 50" />

        {/* Hook */}
        <path d="M85 50 L82 55 L88 55 L85 50" /> {/* Block */}
        <path d="M85 55 L85 60 C85 63 82 63 82 60" /> {/* Hook curve */}
    </svg>
);

export default CraneIcon;
