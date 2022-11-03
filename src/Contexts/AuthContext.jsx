import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig/firebase";

export const AuthContex = createContext(null);

export default function AuthContexProvider({ children }) {
    const [user, setUser] = useState(null);
    return (
        <AuthContex.Provider value={{ user, setUser }}>
            {children}
        </AuthContex.Provider>
    );
};