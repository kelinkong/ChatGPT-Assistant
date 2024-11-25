import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

interface ApiKeyType {
    type: 'OpenAI' | 'GroqCloud';
    key: string;
}

interface ApiKeyContextType {
    apiKey: ApiKeyType;
    setApiKey: (key: string) => void;
    selectApiType: (type: 'OpenAI' | 'GroqCloud') => void;
}

// Create API key context
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

// API key context provider component
export const ApiKeyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [apiKey, setApiKeyState] = useState<ApiKeyType>({type: 'OpenAI', key: ''});

    // Load API key from storage on component mount
    useEffect(() => {
        const loadApiKey = async () => {
            const storedKey = await AsyncStorage.getItem('apiKey');
            if (storedKey) {
                const parseKey = JSON.parse(storedKey) as ApiKeyType;
                setApiKeyState(parseKey);
            }
        };

        loadApiKey();
    }, []);

    // Function to update the API key state and save it to storage
    const setApiKey = async (key: string) => {
        setApiKeyState({...apiKey, key});
        await AsyncStorage.setItem('apiKey', JSON.stringify({...apiKey, key}));
    };

    // Function to select the API type
    const selectApiType = (type: 'OpenAI' | 'GroqCloud') => {
        setApiKeyState({ ...apiKey, type });
        AsyncStorage.setItem('apiKey', JSON.stringify({ ...apiKey, type }));
    };

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, selectApiType }}>
            {typeof children === 'string' ? <Text>{children}</Text> : children}
        </ApiKeyContext.Provider>
    );
};

// Custom hook to use the API key context
export const useApiKeyContext = (): ApiKeyContextType => {

    const context = useContext(ApiKeyContext);

    if (!context) {
        throw new Error('useApiKeyContext must be used within an ApiKeyContextProvider');
    }

    return context;
};