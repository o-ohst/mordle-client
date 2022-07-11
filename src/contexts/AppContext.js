import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({children}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState();

    const value = {
    loggedIn,
    setLoggedIn,
    userId,
    setUserId
    };

    return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
    );
}