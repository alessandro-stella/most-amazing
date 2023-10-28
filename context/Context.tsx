import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

interface ContextType {
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    productsInCart: number;
    setProductsInCart: Dispatch<SetStateAction<number>>;
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
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productsInCart, setProductsInCart] = useState(0);

    return (
        <Context.Provider
            value={{
                selectedCategory,
                setSelectedCategory,
                productsInCart,
                setProductsInCart,
            }}>
            {" "}
            {children}
        </Context.Provider>
    );
};
