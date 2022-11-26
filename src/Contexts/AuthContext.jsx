import { createContext, useState } from "react";

export const AuthContex = createContext(null);

export default function AuthContexProvider({ children }) {
    const [user, setUser] = useState(null);
    return (
        <AuthContex.Provider value={{ user, setUser }}>
            {children}
        </AuthContex.Provider>
    );
};