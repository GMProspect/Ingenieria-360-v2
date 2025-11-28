import React from 'react';

const HomeCraneIcon = ({ size = 100, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Base (Red) */}
        <rect x="10" y="85" width="80" height="10" rx="2" fill="#ef4444" />

        {/* Tower (Yellow) */}
        <rect x="40" y="20" width="10" height="65" fill="#eab308" />
        <path d="M40 20 L50 20 L50 85 L40 85 Z" fill="#eab308" />
        {/* Cross bracing */}
        <path d="M40 80 L50 70 M50 80 L40 70 M40 60 L50 50 M50 60 L40 50 M40 40 L50 30 M50 40 L40 30" stroke="#ca8a04" strokeWidth="1" />

        {/* Cab (Blue) */}
        <rect x="35" y="15" width="20" height="15" rx="2" fill="#3b82f6" />

        {/* Jib/Arm (Yellow) */}
        <rect x="10" y="20" width="80" height="8" fill="#eab308" />

        {/* Counterweight (Darker) */}
        <rect x="10" y="20" width="20" height="12" fill="#a16207" />

        {/* Cable (Grey) */}
        <line x1="80" y1="28" x2="80" y2="60" stroke="#94a3b8" strokeWidth="2" />

        {/* Hook/Load (Red) */}
        <rect x="70" y="60" width="20" height="10" fill="#ef4444" />
        <path d="M70 60 L80 55 L90 60" fill="#ef4444" />
    </svg>
);

export default HomeCraneIcon;
