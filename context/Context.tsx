import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

interface ContextType {
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
}

interface ContextProviderProps {
    children:
        | JSX.Element
        | JSX.Element[]
        | React.ReactElement
        | React.ReactNode;
}

export const Context = createContext<ContextType>({} as ContextType);

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    return (
        <Context.Provider value={{ selectedCategory, setSelectedCategory }}>
            {" "}
            {children}
        </Context.Provider>
    );
};
