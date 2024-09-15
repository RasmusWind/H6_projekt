import { Button, TextInput, View, Text } from "react-native";
import { StyleSheet, BackHandler } from "react-native";
import { useState, useEffect } from "react";
import { sessionAuth } from "../Api";
import SignUp from "./SignUp";
import { useDataContext } from "../Context";
import { styles } from "../assets/styles";

export default function Login() {
  const dataContext = useDataContext();
  const [signUp, setSignUp] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // TODO, check if this is even necessary
  function handleBackButtonClick() {}

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  }, []);

  function userLogin(event) {
    sessionAuth
      .post("/sessionLogin", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status == "success") {
          dataContext.setUser(response.user);
          dataContext.setToken(response.token);
        }
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  if (signUp) {
    return <SignUp setSignUp={setSignUp} />;
  }

  return (
    <View style={styles.pageStyle}>
      <View style={styles.pageStyle}>
        <Text style={styles.whiteText}>Username</Text>
        <TextInput
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        ></TextInput>
        <Text style={styles.whiteText}>Password</Text>
        <TextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          style={styles.input}
        ></TextInput>
        <Button onPress={userLogin} title="Login" color="blue" />
      </View>
      <View style={styles.footer}>
        <Text style={{ color: "white" }}>Don't have an account?</Text>
        <Button onPress={() => setSignUp(true)} title="Sign-up" color="blue" />
      </View>
    </View>
  );
}
