import React from 'react';

const TagList = ({ specs, onClick }) => {
    const tags = Array.isArray(specs)
        ? specs
        : Object.entries(specs || {}).map(([k, v]) => `${k}: ${v}`);

    const visibleTags = tags.slice(0, 3);
    const remainingCount = tags.length - 3;

    return (
        <div className="flex flex-wrap gap-1 mt-2 cursor-pointer" onClick={onClick}>
            {visibleTags.map((tag, idx) => (
                <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-full border border-slate-700 hover:bg-slate-700 transition-colors"
                    title={tag}
                >
                    {tag.length > 10 ? tag.substring(0, 10) + '...' : tag}
                </span>
            ))}
            {remainingCount > 0 && (
                <span className="px-2 py-0.5 bg-slate-800 text-cyan-400 text-[10px] rounded-full border border-slate-700 font-bold hover:bg-slate-700 transition-colors">
                    +{remainingCount}
                </span>
            )}
        </div>
    );
};

export default TagList;
