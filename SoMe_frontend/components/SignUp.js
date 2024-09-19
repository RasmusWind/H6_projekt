import { useState, useEffect } from "react";
import { TextInput, Text, View, Button, BackHandler } from "react-native";
import { styles } from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";

export default function SignUp({ setSignUp }) {
  const dataContext = useDataContext();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [errorText, setErrorText] = useState();

  useEffect(() => {
    const handleBackButtonClick = () => {
      setSignUp(false);
      return true;
    };

    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => {
      backhandler.remove();
    };
  }, []);

  function handleSignupSubmit(event) {
    if (password != passwordCheck) {
      setErrorText("Passwords do not match");
      return;
    }
    if (username.length == 0) {
      setErrorText("Username field is empty");
      return;
    }
    if (password.length == 0) {
      setErrorText("Password field is empty");
      return;
    }
    if (firstName.length == 0) {
      setErrorText("First name field is empty");
      return;
    }
    if (lastName.length == 0) {
      setErrorText("Last name field is empty");
      return;
    }
    if (email.length == 0) {
      setErrorText("Email field is empty");
      return;
    }

    sessionAuth
      .post("/signup", {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      })
      .then((response) => {
        console.log("SIGNUP success", response);
        setSignUp(false);
      })
      .catch((error) => {
        console.log("SIGNUP error", error);
        let response = error.response.data;
        if (response.status == "error") {
          // TODO, handle error
          // Display an error
          setErrorText(response.message);
        }
      });
  }

  if (signupSuccess) {
    this.props.navigation.goBack(null);
    // Should either return Login page or move back to Login page
  }

  return (
    <View style={styles.container}>
      <Icon
        onPress={() => setSignUp(false)}
        style={styles.backarrow}
        name="arrow-left"
        size={30}
        color="blue"
      />
      <View style={styles.signUpTitleContainer}>
        <Text style={styles.signUpTitle}>Sign Up</Text>
      </View>
      <View style={styles.signUpErrorContainer}>
        <Text style={styles.signUpError}>{errorText}</Text>
      </View>
      <View>
        <TextInput
          placeholder="username"
          placeholderTextColor="grey"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor="grey"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="confirm password"
          placeholderTextColor="grey"
          style={styles.input}
          value={passwordCheck}
          onChangeText={setPasswordCheck}
        />
        <TextInput
          placeholder="email"
          placeholderTextColor="grey"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="first name"
          placeholderTextColor="grey"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="last name"
          placeholderTextColor="grey"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <Button onPress={handleSignupSubmit} title="Submit" color="blue" />
    </View>
  );
}
