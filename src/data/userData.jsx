import { useState, createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const userData = createContext()

export const useUserProvider = () => {
    return useContext(userData);
}

export function UserProvider({children}) {
    const [value, setValue] = useLocalStorage("test1", "")
    const [user, setUser] = useState(value);
    
    useEffect(() => {
        // setUser(value)
        setValue(user)
    }, [user])

    const contextValue = {
        user,
        setUser,
        value
    }

    return (
        <userData.Provider value={contextValue}>
            {children}
        </userData.Provider>
    )
}
