import {
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Text,
  Button,
} from "react-native";
import { useDataContext } from "../Context";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "../assets/styles";
import { server_url, sessionAuth } from "../Api";

export default function ProfilePage({ user }) {
  const dataContext = useDataContext();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.extendeduser.image);
  const [file, setFile] = useState();
  const [isFriend, setIsFriend] = useState(
    dataContext.user.friends.includes(user.id)
  );
  const [pendingFR, setPendingFR] = useState(user.has_pending_friend_request);

  function removeFriendRequest(to_user) {
    sessionAuth
      .post(
        "/remove_friend_request",
        { to_user_username: to_user.username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        setPendingFR(false);
        setIsFriend(false);
      });
  }

  function addFriend(to_user) {
    sessionAuth
      .post(
        "/send_friend_request",
        {
          to_user_username: to_user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        setPendingFR(!pendingFR);
      });
  }

  function removeFriend(to_user) {
    sessionAuth
      .post(
        "/remove_friend",
        {
          friend_username: to_user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        let userindex = dataContext.user.friends.indexOf(user.id);
        dataContext.user.friends.slice(userindex, userindex);
        setIsFriend(!isFriend);
      });
  }

  async function updateProfile() {
    let form = new FormData();
    if (file) {
      form.append("file", {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });
    }

    form.append("first_name", firstName);
    form.append("last_name", lastName);
    form.append("email", email);

    sessionAuth
      .post("/update_profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${dataContext.token}`,
        },
      })
      .then((response) => {
        let new_user = response.data.user;
        setFirstName(new_user.first_name);
        setLastName(new_user.last_name);
        setImage(new_user.extendeduser.image);
      });
  }

  console.log(user);

  if (dataContext.user.username != user.username) {
    return (
      <View>
        <View>
          <View style={styles.userSearch}>
            <Icon
              onPress={() => dataContext.setActionComponent(null)}
              style={styles.iconBack}
              name="arrow-left"
              size={30}
            />
            <Text style={styles.createPostTitle}>Profile Page</Text>
          </View>
          <View style={styles.profileContainer}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: server_url + image }}
                style={styles.profilePageImage}
              />
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  {firstName}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  {lastName}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {isFriend ? (
          <Button
            title="Remove friend"
            color="red"
            onPress={() => removeFriend(user)}
          />
        ) : null}
        {pendingFR ? (
          <Button
            title="Pending"
            color="yellow"
            onPress={() => removeFriendRequest(user)}
          />
        ) : (
          <Button
            title="Add friend"
            color="green"
            onPress={() => addFriend(user)}
          />
        )}
      </View>
    );
  }

  return (
    <View>
      <View>
        <View style={styles.userSearch}>
          <Icon
            onPress={() => dataContext.setActionComponent(null)}
            style={styles.iconBack}
            name="arrow-left"
            size={30}
          />
          <Text style={styles.createPostTitle}>Profile Page</Text>
        </View>
        <View style={styles.profileContainer}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: server_url + image }}
              style={styles.profilePageImage}
            />
            <View
              style={{
                flexDirection: "row",
                columnGap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                }}
              >
                {firstName}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                }}
              >
                {lastName}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <View style={styles.profileInputContainer}>
              <Text style={styles.whiteText}>First name:</Text>
              <TextInput
                style={styles.profileInput}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.profileInputContainer}>
              <Text style={styles.whiteText}>Last name:</Text>
              <TextInput
                style={styles.profileInput}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.profileInputContainer}>
              <Text style={styles.whiteText}>Email:</Text>
              <TextInput
                style={styles.profileInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <TouchableOpacity
              style={styles.uploadImageProfile}
              onPress={async () => {
                const { assets, canceled } =
                  await DocumentPicker.getDocumentAsync({
                    base64: true,
                  });
                if (!canceled && assets.length > 0) {
                  let selected_file = assets[0];
                  setFile(selected_file);
                }
              }}
            >
              {file ? <Text>{file.name}</Text> : null}
              <Icon name="upload" size={30} color="#ddd" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Button
          title="Update profile"
          onPress={() => {
            updateProfile();
          }}
        />
      </View>
    </View>
  );
}
