import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Trash2, Edit } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import BackButton from '../components/BackButton';
import InventoryModal from '../components/inventory/InventoryModal';

const Inventory = () => {
    const { user } = useAuth();
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
        acquisition_date: ''
    });

    // Tags State
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        if (user) fetchItems();
    }, [user]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('equipos')
                .select('*')
                .eq('user_id', user.id) // Filter by user
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
                acquisition_date: item.acquisition_date
            });

            // Parse specs into tags
            let loadedTags = [];
            if (item.specs) {
                if (Array.isArray(item.specs)) {
                    loadedTags = item.specs;
                } else if (typeof item.specs === 'object') {
                    // Convert old object format to array of strings
                    loadedTags = Object.entries(item.specs).map(([k, v]) => `${k}: ${v}`);
                }
            }
            setTags(loadedTags);
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                brand: '',
                model: '',
                quantity: 1,
                acquisition_date: new Date().toISOString().split('T')[0]
            });
            setTags([]);
        }
        setCurrentTag('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    // Tag Handlers
    const handleAddTag = (e) => {
        e.preventDefault(); // Prevent form submission if triggered by Enter
        if (!currentTag.trim()) return;
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
    };

    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const payload = {
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                quantity: parseInt(formData.quantity),
                acquisition_date: formData.acquisition_date,
                specs: tags, // Save as JSON array
                user_id: user.id // Assign to user
            };

            if (currentItem) {
                // Update
                const { error } = await supabase
                    .from('equipos')
                    .update(payload)
                    .eq('id', currentItem.id)
                    .eq('user_id', user.id); // Ensure ownership
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
                .eq('id', id)
                .eq('user_id', user.id); // Ensure ownership
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
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
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
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {(() => {
                                                    const tags = Array.isArray(item.specs)
                                                        ? item.specs
                                                        : Object.entries(item.specs || {}).map(([k, v]) => `${k}: ${v}`);

                                                    const visibleTags = tags.slice(0, 3);
                                                    const remainingCount = tags.length - 3;

                                                    return (
                                                        <>
                                                            {visibleTags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-full border border-slate-700"
                                                                    title={tag}
                                                                >
                                                                    {tag.length > 20 ? tag.substring(0, 20) + '...' : tag}
                                                                </span>
                                                            ))}
                                                            {remainingCount > 0 && (
                                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded-full border border-slate-700 font-bold">
                                                                    +{remainingCount}
                                                                </span>
                                                            )}
                                                        </>
                                                    );
                                                })()}
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
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors active:scale-95"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors active:scale-95"
                                                    title="Eliminar"
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

            <InventoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!currentItem}
                tags={tags}
                currentTag={currentTag}
                setCurrentTag={setCurrentTag}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default Inventory;
