import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface AuthContextType {
    token: string | null;
    role: string;
    uuid: string;
    setToken: (newToken: string | null) => void;
    setRole: (newRole: string) => void;
    setUuid: (newUuid: string) => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    role: "",
    uuid: "",
    setToken: () => {},
    setRole: () => {},
    setUuid: () => {},
});

interface DecodedToken extends JwtPayload {
    role: string;
    uuid: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken_] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [role, setRole] = useState("");
    const [uuid, setUuid] = useState("");

    const setToken = (newToken: string | null) => {
        setToken_(newToken);
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token);
            const data = jwtDecode<DecodedToken>(token);
            setRole(data.role);
            setUuid(data.uuid);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            role,
            uuid,
            setToken,
            setRole,
            setUuid
        }),
        [token, role, uuid]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
