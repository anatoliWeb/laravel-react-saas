import { createContext, useContext, useState } from 'react';

/**
 * Header context.
 *
 * Keeps global header UI state in one place.
 */
const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
    const [title, setTitle] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    return (
        <HeaderContext.Provider
            value={{
                title,
                setTitle,
                isRefreshing,
                setIsRefreshing,
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);

    if (!context) {
        throw new Error('useHeader must be used inside HeaderProvider');
    }

    return context;
}