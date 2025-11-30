import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import useLocalStorage from '../hooks/useLocalStorage';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queue, setQueue] = useLocalStorage('offline_queue', []);
    const [isSyncing, setIsSyncing] = useState(false);

    // Monitor Network Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Process Queue when Online
    const processQueue = useCallback(async () => {
        if (!isOnline || queue.length === 0 || isSyncing) return;

        setIsSyncing(true);
        const newQueue = [...queue];
        const failedItems = [];
        let successCount = 0;

        console.log(`Starting sync of ${queue.length} items...`);

        for (const item of newQueue) {
            try {
                const { type, payload, table } = item;
                let error = null;

                // Artificial delay to prevent rate limiting
                await new Promise(r => setTimeout(r, 100));

                if (type === 'INSERT') {
                    const { error: insertError } = await supabase
                        .from(table)
                        .insert([payload]);
                    error = insertError;
                } else if (type === 'UPDATE') {
                    const { id, ...updateData } = payload;
                    const { error: updateError } = await supabase
                        .from(table)
                        .update(updateData)
                        .eq('id', id);
                    error = updateError;
                } else if (type === 'DELETE') {
                    const { id } = payload;
                    const { error: deleteError } = await supabase
                        .from(table)
                        .delete()
                        .eq('id', id);
                    error = deleteError;
                }

                if (error) throw error;
                successCount++;

            } catch (err) {
                console.error('Sync failed for item:', item, err);
                // If it's a network error, keep it in queue. If it's a logic error (e.g. RLS), maybe discard or flag?
                // For now, we'll keep it to be safe, but we need to avoid infinite loops.
                // Simple strategy: If online and failed, maybe it's a permanent error?
                // Let's assume transient for now, but maybe add a retry count later.
                failedItems.push(item);
            }
        }

        setQueue(failedItems);
        setIsSyncing(false);

        if (successCount > 0) {
            // Optional: Trigger a global refresh or toast
            console.log(`Synced ${successCount} items successfully.`);
            // We could dispatch a custom event here if needed
            window.dispatchEvent(new Event('db-synced'));
        }

    }, [isOnline, queue, isSyncing, setQueue]);

    // Auto-trigger sync when coming online
    useEffect(() => {
        if (isOnline && queue.length > 0) {
            processQueue();
        }
    }, [isOnline, queue.length, processQueue]);

    // Add item to queue
    const addToQueue = (action) => {
        // action: { type: 'INSERT' | 'UPDATE' | 'DELETE', table: 'string', payload: object, id: string (optional) }
        const newItem = {
            ...action,
            timestamp: Date.now(),
            id: action.id || crypto.randomUUID() // Internal ID for queue management
        };
        setQueue(prev => [...prev, newItem]);
    };

    const value = {
        isOnline,
        queue,
        addToQueue,
        processQueue,
        isSyncing
    };

    return (
        <SyncContext.Provider value={value}>
            {children}
            {/* Offline Indicator / Sync Status UI */}
            <div className={`fixed bottom-0 left-0 right-0 p-2 text-xs font-bold text-center transition-transform duration-300 z-50 ${!isOnline ? 'bg-red-600 text-white translate-y-0' :
                    (queue.length > 0 && isOnline) ? 'bg-blue-600 text-white translate-y-0' :
                        'translate-y-full'
                }`}>
                {!isOnline ? (
                    <div className="flex items-center justify-center gap-2">
                        <WifiOff size={14} />
                        <span>Sin conexión - {queue.length} cambios pendientes</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                        <span>Sincronizando {queue.length} cambios...</span>
                    </div>
                )}
            </div>
        </SyncContext.Provider>
    );
};

export default SyncContext;
