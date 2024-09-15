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
      console.log("Passwords do not match");
      return;
    }
    if (username.Length() == 0) {
      console.log("Username field is empty");
      return;
    }
    if (password.Length() == 0) {
      console.log("Password field is empty");
      return;
    }
    if (firstName.Length() == 0) {
      console.log("First name field is empty");
      return;
    }
    if (lastName.Length() == 0) {
      console.log("Last name field is empty");
      return;
    }
    if (email.Length() == 0) {
      console.log("Email field is empty");
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
        if (response.status == "error") {
          // TODO, handle error
          // Display an error
        }
        if (response.status == "success") {
          // return the user to login page where they can now login
          setSignUp(false);
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
        color="#000"
      />
      <View>
        <Text style={styles.whiteText}>username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.whiteText}>password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.whiteText}>confirm password</Text>
        <TextInput
          style={styles.input}
          value={passwordCheck}
          onChangeText={setPasswordCheck}
        />
        <Text style={styles.whiteText}>email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        <Text style={styles.whiteText}>first name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.whiteText}>last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <Button onPress={handleSignupSubmit} title="Submit" color="blue" />
    </View>
  );
}
