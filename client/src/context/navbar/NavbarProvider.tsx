import { createContext, useContext, useState } from "react";

type NavbarContextType = {
    isOpen: boolean;
    setOpen: (open : boolean) => void;
};

const NavbarContext = createContext<NavbarContextType>({
    isOpen: false,
    setOpen: () => {},
});

const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const setOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <NavbarContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </NavbarContext.Provider>
    );
};

const useNavbar = () => {
    return useContext(NavbarContext);
};

export { NavbarProvider, useNavbar };
