import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, description, icon: Icon, color, links = [] }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Map color names to Tailwind classes
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300',
        orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-300',
        purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-300',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:border-yellow-300',
        gray: 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300',
        cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:border-cyan-300',
    };

    const baseClass = colorClasses[color] || colorClasses.gray;

    return (
        <div className={`rounded-xl border-2 transition-all duration-300 ${baseClass} ${isOpen ? 'ring-2 ring-offset-1' : ''}`}>
            <div
                className="p-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                        <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-60">
                        {links.length} Herramientas
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Expandable Links Section */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 pt-2 space-y-2 border-t border-gray-100/50">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            to={link.to}
                            className="block p-3 rounded-lg bg-white/50 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                {link.label}
                            </span>
                            {link.isNew && (
                                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                    NUEVO
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
