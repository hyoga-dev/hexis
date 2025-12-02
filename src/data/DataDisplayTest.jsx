import { useState, createContext, useContext, useEffect } from "react";

const test = createContext()

export const useUserProvider = () => {
    return useContext(test);
}

export function UserProvider({children}) {
    const [user, setUser] = useState("linus");

    const contextValue = {
        user,
        setUser
    }

    return (
        <test.Provider value={contextValue}>
            {children}
        </test.Provider>
    )
}

export default function Component1() {
    // const {user, setUser} = useUserProvider()


    return (
        <UserProvider>
            <h1>
                {/* {`hello ${user}`} */}
            </h1>
            <Component2/>
        </UserProvider>
    )
}



function Component2 () {
    return (
        <>
            <h1>Component 2</h1>
            <Component3 />
        </>
    )
}

 function Component3 () {
    const {user, setUser} = useUserProvider()
    
    function bambang() {
        setUser("bambang")
    }

    return (
        <>  
            <button onClick={bambang}>clickme bambang!</button>
            <h1>Component 3</h1>
            <h2> {`Hello ${user}`} </h2>
        </>
    )
}