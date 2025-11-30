import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize();
        }

        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signInWithGoogle: async () => {
            if (Capacitor.isNativePlatform()) {
                // Native Flow (Android/iOS)
                try {
                    const googleUser = await GoogleAuth.signIn();
                    const { idToken } = googleUser.authentication;

                    return supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: idToken,
                    });
                } catch (error) {
                    console.error('Google Sign-In Error:', error);
                    alert('Error: ' + JSON.stringify(error));
                    throw error;
                }
            } else {
                // Web Flow
                return supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
            }
        },
        signOut: () => supabase.auth.signOut(),
        user,
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Auth...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
