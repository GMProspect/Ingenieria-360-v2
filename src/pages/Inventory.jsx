import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Trash2, Edit, X, Save } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null); // null for new, object for edit

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        quantity: 1,
        acquisition_date: '',
        specs: '' // JSON string
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('equipos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                name: item.name,
                brand: item.brand,
                model: item.model,
                quantity: item.quantity,
                acquisition_date: item.acquisition_date,
                specs: JSON.stringify(item.specs, null, 2)
            });
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                brand: '',
                model: '',
                quantity: 1,
                acquisition_date: new Date().toISOString().split('T')[0],
                specs: '{}'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let specsJson = {};
            try {
                specsJson = JSON.parse(formData.specs);
            } catch (e) {
                alert('El campo Specs debe ser un JSON válido');
                return;
            }

            const payload = {
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                quantity: parseInt(formData.quantity),
                acquisition_date: formData.acquisition_date,
                specs: specsJson
            };

            if (currentItem) {
                // Update
                const { error } = await supabase
                    .from('equipos')
                    .update(payload)
                    .eq('id', currentItem.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('equipos')
                    .insert([payload]);
                if (error) throw error;
            }

            handleCloseModal();
            fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este equipo?')) return;
        try {
            const { error } = await supabase
                .from('equipos')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <BackButton />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Database size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Inventario de Equipos</h1>
                        <p className="text-slate-400">Gestión de activos y especificaciones</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20"
                >
                    <Plus size={20} />
                    Nuevo Equipo
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, marca o modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Equipo</th>
                                <th className="p-4 font-medium">Marca / Modelo</th>
                                <th className="p-4 font-medium">Cantidad</th>
                                <th className="p-4 font-medium">Adquisición</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Cargando inventario...</td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No se encontraron equipos</td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{item.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1 max-w-[200px] truncate">
                                                {JSON.stringify(item.specs)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            <div className="text-white">{item.brand}</div>
                                            <div className="text-sm text-slate-500">{item.model}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {item.quantity} Unidades
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(item.acquisition_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                            <h2 className="text-xl font-bold text-white">
                                {currentItem ? 'Editar Equipo' : 'Nuevo Equipo'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Marca</label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Modelo</label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Adquisición</label>
                                    <input
                                        type="date"
                                        value={formData.acquisition_date}
                                        onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Especificaciones (JSON)</label>
                                <textarea
                                    rows="4"
                                    value={formData.specs}
                                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder='{"potencia": "100W", "voltaje": "220V"}'
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
