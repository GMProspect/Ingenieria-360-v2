import React, { useState, useEffect } from 'react';
import { Database, Plus, Search, Trash2, Edit, Wrench } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import { useSync } from '../contexts/SyncContext';
import BackButton from '../components/BackButton';
import InventoryModal from '../components/inventory/InventoryModal';
import ItemDetailsModal from '../components/inventory/ItemDetailsModal';
import TagList from '../components/inventory/TagList';
import ConfirmationModal from '../components/ConfirmationModal';


const Inventory = () => {
    const { user } = useAuth();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentItem, setCurrentItem] = useState(null); // null for new, object for edit
    const [detailsItem, setDetailsItem] = useState(null); // Item to show details for

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

    const fetchItems = React.useCallback(async () => {
        if (!user) return;
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
    }, [user]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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

    const handleViewDetails = (item) => {
        setDetailsItem(item);
        setIsDetailsOpen(true);
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

    const { isOnline, addToQueue } = useSync();

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

            if (!isOnline) {
                // Offline Logic
                if (currentItem) {
                    addToQueue({
                        type: 'UPDATE',
                        table: 'equipos',
                        payload: { ...payload, id: currentItem.id }
                    });
                    alert('Sin conexión. Cambio guardado en cola para sincronizar cuando recuperes internet.');
                } else {
                    addToQueue({
                        type: 'INSERT',
                        table: 'equipos',
                        payload: payload
                    });
                    alert('Sin conexión. Equipo guardado en cola para sincronizar cuando recuperes internet.');
                }
                handleCloseModal();
                // Optimistic update could be added here, but for now we just close
                return;
            }

            // Online Logic
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

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (!isOnline) {
                addToQueue({
                    type: 'DELETE',
                    table: 'equipos',
                    payload: { id: itemToDelete.id }
                });
                alert('Sin conexión. Eliminación en cola para sincronizar cuando recuperes internet.');
                setItemToDelete(null);
                setIsDeleteModalOpen(false);
                return;
            }

            const { error } = await supabase
                .from('equipos')
                .delete()
                .eq('id', itemToDelete.id)
                .eq('user_id', user.id); // Ensure ownership
            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
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

            {/* Tribute to Mechanics */}
            <div className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                    <Wrench size={18} />
                </div>
                <p className="text-sm text-orange-200/80 italic">
                    "Para la fuerza de la planta: Un buen inventario es la base de un mantenimiento impecable."
                </p>
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

            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm min-h-[60vh]">
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
                                            <div className="font-bold text-white cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleViewDetails(item)}>
                                                {item.name}
                                            </div>
                                            <TagList specs={item.specs} onClick={() => handleViewDetails(item)} />
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
                                            {item.acquisition_date ? new Date(item.acquisition_date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
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
                                                    onClick={() => handleDeleteClick(item)}
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

            {/* Mobile Card View (hidden on desktop) */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-8 text-center text-slate-500 backdrop-blur-sm">
                        Cargando inventario...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-8 text-center text-slate-500 backdrop-blur-sm">
                        No se encontraron equipos
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
                            {/* Header: Name and Actions */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleViewDetails(item)}>
                                        {item.name}
                                    </h3>
                                    <TagList specs={item.specs} onClick={() => handleViewDetails(item)} />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors active:scale-95"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(item)}
                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors active:scale-95"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Marca / Modelo</div>
                                    <div className="text-white font-medium">{item.brand}</div>
                                    <div className="text-sm text-slate-400">{item.model}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cantidad</div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {item.quantity} Unidades
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Adquisición</div>
                                        <div className="text-slate-400 text-sm">
                                            {item.acquisition_date ? new Date(item.acquisition_date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
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

            <ItemDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                item={detailsItem}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Equipo"
                message={`¿Estás seguro de que deseas eliminar "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                type="danger"
            />

        </div>
    );
};

export default Inventory;
