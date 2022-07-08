import { createContext, useState } from "react";

export const SingleplayerContext = createContext();

export function SingleplayerProvider({ children }) {
    const [guesses, setGuesses] = useState([]);

    const value = {
        guesses,
        setGuesses
    };

    return (
        <SingleplayerContext.Provider value={value}>{children}</SingleplayerContext.Provider>
    );
}