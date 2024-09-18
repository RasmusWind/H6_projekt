import { createContext, useContext, useState } from "react";
import { websocket_url } from "./Api";

const Context = createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export function useDataContext() {
  return useContext(Context);
}

export function ContextProvider({ children }) {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [showProfile, setShowProfile] = useState(false);
  const [profileXY, setProfileXY] = useState();
  const [actionComponent, setActionComponent] = useState(null);
  const websocket = new WebSocket(websocket_url);

  return (
    <Context.Provider
      value={{
        user: user,
        setUser: setUser,
        token: token,
        setToken: setToken,
        showProfile: showProfile,
        setShowProfile: setShowProfile,
        profileXY: profileXY,
        setProfileXY: setProfileXY,
        actionComponent: actionComponent,
        setActionComponent: setActionComponent,
        webSocket: websocket,
      }}
    >
      {children}
    </Context.Provider>
  );
}
