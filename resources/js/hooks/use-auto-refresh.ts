import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

interface UseAutoRefreshOptions {
    endpoint: string;
    onlyProps?: string[];
    checkInterval?: number;
    enabled?: boolean;
}

/**
 * Hook that checks for updates and only refreshes when data actually changes
 * Much more efficient than refreshing at fixed intervals
 */
export function useAutoRefresh({ 
    endpoint, 
    onlyProps = [], 
    checkInterval = 3000,
    enabled = true
}: UseAutoRefreshOptions) {
    const lastKnownUpdate = useRef<string | null>(null);
    const isCheckingRef = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const checkForUpdates = async () => {
            // Prevent overlapping checks
            if (isCheckingRef.current) return;
            
            isCheckingRef.current = true;
            
            try {
                const params = lastKnownUpdate.current 
                    ? { last_known: lastKnownUpdate.current }
                    : {};
                    
                const response = await axios.get(endpoint, { params });
                
                if (response.data.last_update) {
                    if (lastKnownUpdate.current === null) {
                        // First check, just store the timestamp
                        lastKnownUpdate.current = response.data.last_update;
                        console.log(`[${endpoint}] Initial timestamp stored:`, lastKnownUpdate.current);
                    } else if (response.data.has_update) {
                        // Data has changed, reload the page
                        console.log(`[${endpoint}] ✅ Update detected! Reloading...`);
                        console.log(`[${endpoint}] Old:`, lastKnownUpdate.current);
                        console.log(`[${endpoint}] New:`, response.data.last_update);
                        lastKnownUpdate.current = response.data.last_update;
                        router.reload({ only: onlyProps.length > 0 ? onlyProps : undefined });
                    } else {
                        console.log(`[${endpoint}] ⏸️ No changes (Last: ${lastKnownUpdate.current})`);
                    }
                }
            } catch (error) {
                console.error(`[${endpoint}] Error checking for updates:`, error);
            } finally {
                isCheckingRef.current = false;
            }
        };

        // Initial check
        checkForUpdates();

        // Set up interval for subsequent checks
        const interval = setInterval(checkForUpdates, checkInterval);

        return () => clearInterval(interval);
    }, [endpoint, checkInterval, enabled, onlyProps]);
}
