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
  const [username, setUsername] = useState("rasmustest");
  const [password, setPassword] = useState("123AsD4AsD5");

  // TODO, check if this is even necessary
  function handleBackButtonClick() {}

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    dataContext.setShowProfile(false);
  }, []);

  function userLogin(event) {
    sessionAuth
      .post("/sessionLogin", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "success") {
          dataContext.setUser(response.data.user);
          dataContext.setToken(response.data.token);
        }
      })
      .catch((error) => console.log(error));
  }

  if (signUp) {
    return <SignUp setSignUp={setSignUp} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.appTitleContainer}>
        <Text style={styles.appTitle}>Awesome Media</Text>
      </View>
      <View style={styles.appLoginContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="grey"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          placeholderTextColor="grey"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          style={styles.input}
        ></TextInput>
        <Button
          style={styles.loginButton}
          onPress={userLogin}
          title="Login"
          color="blue"
        />
      </View>
      <View style={styles.loginFooter}>
        <Text style={{ color: "grey" }}>Don't have an account?</Text>
        <Button onPress={() => setSignUp(true)} title="Sign-up" color="blue" />
      </View>
    </View>
  );
}
