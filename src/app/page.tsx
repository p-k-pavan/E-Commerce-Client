"use client";

import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function DebugRedux() {
    const auth = useAppSelector((state) => state.auth);
    
    useEffect(() => {
        console.log("🔍 DebugRedux - Current Auth State:", auth);
        const persistedState = localStorage.getItem('persist:root');
        console.log("🔍 DebugRedux - Persisted State in localStorage:", persistedState);
    }, [auth]);

    const checkStorage = () => {
        const state = localStorage.getItem('persist:root');
        console.log('📦 Manual Check - Persisted State:', state);
        console.log('📦 Manual Check - Current Redux State:', auth);
    };

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-black text-white text-xs z-50">
            <button onClick={checkStorage} className="mb-2 p-1 bg-blue-500">
                Debug Redux
            </button>
            <div>Auth: {auth.isAuthenticated ? '✅ Logged In' : '❌ Logged Out'}</div>
            <div>User: {auth.user?.name || 'No User'}</div>
            <div>Loading: {auth.loading ? 'Yes' : 'No'}</div>
            <div>Token: {auth.token ? 'Exists' : 'None'}</div>
        </div>
    );
}