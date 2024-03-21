import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from '../services/i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
        const loadSelectedLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
                if (storedLanguage) {
                    setSelectedLanguage(storedLanguage);
                    i18next.changeLanguage(storedLanguage);
                }
            } catch (error) {
                console.error('Error loading language from AsyncStorage:', error);
            }
        };

        loadSelectedLanguage();
    }, []);

    const changeLanguage = (lng) => {
        i18next.changeLanguage(lng);
        setSelectedLanguage(lng);
    };

    return (
        <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}