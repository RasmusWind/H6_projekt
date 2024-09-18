import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";
import Login from "./Login";
import HomePage from "./FriendPostPage";
import GestureHandler from "./GestureHandler";
import PublicPostPage from "./PublicPostPage";
import ActionBar from "./ActionBar";
import { styles } from "../assets/styles";
import FriendsList from "./FriendsList";
import ProfileMenu from "./ProfileMenu";
import FriendPostPage from "./FriendPostPage";

export default function Main() {
  const dataContext = useDataContext();

  useEffect(() => {
    sessionAuth
      .get(`/sessionGetUser`)
      .then(function (response) {
        dataContext.setUser(response.user);
        dataContext.setToken(response.token);
        console.log("user: ", dataContext.user);
      })
      .catch(function (error) {
        dataContext.setUser();
      });
  }, []);

  if (dataContext.user) {
    const components = [
      {
        icon: {
          name: "home",
          size: 30,
          color: "blue",
        },
        component: FriendPostPage,
      },
      {
        icon: {
          name: "globe",
          size: 30,
          color: "blue",
        },
        component: PublicPostPage,
      },
      {
        icon: {
          name: "address-book-o",
          size: 30,
          color: "blue",
        },
        component: FriendsList,
      },
    ];

    return (
      <View style={styles.appBase}>
        {dataContext.showProfile ? (
          <ProfileMenu
            user={dataContext.user}
            location={dataContext.profileXY}
          />
        ) : null}
        {!dataContext.actionComponent ? (
          <GestureHandler components={components} defaultComponentIndex={1} />
        ) : (
          dataContext.actionComponent
        )}
        <ActionBar />
      </View>
    );
  }

  return <Login />;
}
