import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search, Info } from 'lucide-react';
import TrendChart from '../components/TrendChart';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import BackButton from '../components/BackButton';

import { useSearchParams } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // Initial state from URL params or defaults
    const initialTool = searchParams.get('tool') || 'Megóhmetro';
    const initialTag = searchParams.get('tag') || '';
    const initialView = initialTag ? 'trend' : 'list';
                                    <h4 className="text-blue-400 font-bold mb-2 text-sm flex items-center">
                                        <Info size={16} className="mr-2" />
                                        Análisis de Tendencia
                                    </h4>
                                    <p className="text-slate-300 text-sm">
                                        Se muestran <strong>{trendData.length}</strong> mediciones para el equipo <strong>{selectedTag}</strong>.
                                        {trendData.length < 3 && " Se recomiendan al menos 3 puntos para un análisis confiable."}
                                    </p>
                                </div >
                            </>
                        ) : (
    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
        <Search size={48} className="mx-auto mb-4 opacity-20" />
        <p>Selecciona un Tag para ver su gráfica de tendencia.</p>
    </div>
)}
                    </div >
                )}
            </div >
        </div >
    );
};

export default History;
