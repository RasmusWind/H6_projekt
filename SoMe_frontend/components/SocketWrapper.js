import { useState, useEffect } from "react";
import { useDataContext } from "../Context";
import { websocket_url } from "../Api";
import Main from "./Main";
import { ToastAndroid } from "react-native";

export default function SocketWrapper() {
  const dataContext = useDataContext();

  useEffect(() => {
    if (dataContext.user && !dataContext.isLoggedIn) {
      dataContext.setIsLoggedIn(true);
      let webSocket = new WebSocket(websocket_url);
      webSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        let message = data.message;
        let sender = data.sender;

        if (message == "publicPost" && dataContext.user.id != sender) {
          dataContext.setPublicPostUpdatedAmount(
            dataContext.publicPostUpdatedAmount + 1
          );
        }

        if (message == "friendsPost" && dataContext.user.id != sender) {
          dataContext.setFriendPostUpdatedAmount(
            dataContext.friendPostUpdatedAmount + 1
          );
        }

        if (message == "friendrequest") {
          ToastAndroid.showWithGravity(
            `${sender.first_name} sent a friend request`,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
          );
          dataContext.setInboundFriendRequests([
            ...dataContext.inboundFriendRequests,
            sender.id,
          ]);
        }

        if (message == "acceptfriendrequest") {
          ToastAndroid.showWithGravity(
            `${sender.first_name} accepted your friend request`,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
          );
          let temp_frs = dataContext.outboundFriendRequests.filter((obj) => {
            return obj != sender.id;
          });
          dataContext.setOutboundFriendRequests(temp_frs);

          let tempuser = dataContext.user;
          tempuser.friends = [...tempuser.friends, sender.id];
          dataContext.setUser(tempuser);
        }

        if (message == "removefriendrequest") {
          let temp_frs = dataContext.outboundFriendRequests.filter((obj) => {
            return obj != sender.id;
          });
          dataContext.setOutboundFriendRequests(temp_frs);
        }

        if (message == "removefriend") {
          let tempuser = dataContext.user;
          tempuser.friends = tempuser.friends.filter((friend) => {
            return friend != sender.id;
          });
          dataContext.setUser(tempuser);
        }
      };
      webSocket.onclose = function (e) {
        if (dataContext.user) {
          dataContext.setUser();
          dataContext.setToken();
        }
      };
      dataContext.setWebSocket(webSocket);
    } else if (!dataContext.user && dataContext.isLoggedIn) {
      dataContext.setIsLoggedIn(false);
      dataContext.webSocket.close(1000, "test");
      dataContext.setWebSocket();
    }
  }, [dataContext.user]);

  return <Main />;
}
