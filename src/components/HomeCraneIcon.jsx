import React from 'react';

const HomeCraneIcon = ({ size = 100, className = "" }) => (
    <div
        className={`flex justify-center items-center select-none ${className}`}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
        🏗️
    </div>
);

export default HomeCraneIcon;
