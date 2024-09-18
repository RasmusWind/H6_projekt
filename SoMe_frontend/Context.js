import { createContext, useContext, useState, useEffect } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [showProfile, setShowProfile] = useState(false);
  const [profileXY, setProfileXY] = useState();
  const [actionComponent, setActionComponent] = useState(null);
  const [webSocket, setWebSocket] = useState();
  const [publicPostUpdatedAmount, setPublicPostUpdatedAmount] = useState(0);
  const [friendPostUpdatedAmount, setFriendPostUpdatedAmount] = useState(0);
  const [inboundFriendRequests, setInboundFriendRequests] = useState([]);
  const [outboundFriendRequests, setOutboundFriendRequests] = useState([]);

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
        webSocket: webSocket,
        setWebSocket: setWebSocket,
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        publicPostUpdatedAmount: publicPostUpdatedAmount,
        setPublicPostUpdatedAmount: setPublicPostUpdatedAmount,
        friendPostUpdatedAmount: friendPostUpdatedAmount,
        setFriendPostUpdatedAmount: setFriendPostUpdatedAmount,
        inboundFriendRequests: inboundFriendRequests,
        setInboundFriendRequests: setInboundFriendRequests,
        outboundFriendRequests: outboundFriendRequests,
        setOutboundFriendRequests: setOutboundFriendRequests,
      }}
    >
      {children}
    </Context.Provider>
  );
}
