import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig/firebase";

export const AuthContex = createContext(null);

export default function AuthContexProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProp,setUserProp] = useState(null);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            console.log(user);
        });
        
        return () => {
            unsub()
        }

    }, []);

    return (
        <AuthContex.Provider value={{ user, setUser, userProp, setUserProp }}>
            {children}
        </AuthContex.Provider>
    )
}