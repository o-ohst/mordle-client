import { createContext, useState } from "react";

export const SingleWordleContext = createContext();

export function SingleWordleProvider({children}) {
    const [round, setRound] = useState(0);


    const value = {
        round,
        setRound
    };

    return (
        <SingleWordleContext.Provider value={value}>{children}</SingleWordleContext.Provider>
    );
}