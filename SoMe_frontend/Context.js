import { createContext, useContext, useState } from 'react';

const Context = createContext({
    user: null,
    setUser: () => {},
    token: null,
    setToken: () => {},
})

export function useDataContext() {
    return useContext(Context);
  }

export function ContextProvider({children}){
    const [user, setUser] = useState();
    const [token, setToken] = useState();


    return (
        <Context.Provider
            value={{
                user: user,
                setUser: setUser,
                token: token,
                setToken: setToken,
            }}>
            {children}
        </Context.Provider>
    )
}
