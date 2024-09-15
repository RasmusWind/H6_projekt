import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";
import Login from "./Login";
import HomePage from "./HomePage";
import GestureHandler from "./GestureHandler";

export default function Main() {
  const dataContext = useDataContext();
  useEffect(() => {
    // sessionAuth
    //   .get(`/sessionGetUser`)
    //   .then(function (response) {
    //     dataContext.setUser(response.user);
    //     dataContext.setToken(response.token);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     dataContext.setUser();
    //   });
  }, []);

  if (dataContext.user) {
    console.log(dataContext.user);
    const components = [
      {
        icon: <Icon name="home" size={30} color="blue" />,
        component: HomePage,
      },
      {
        icon: <Icon name="signs-post" size={30} color="blue" />,
        component: PublicPostPage,
      },
    ];

    return <GestureHandler components={components} defaultComponentIndex={1} />;
  }

  return <Login />;
}

const textStyle = StyleSheet.create({
  testText: {
    fontWeight: "bold",
  },
});
