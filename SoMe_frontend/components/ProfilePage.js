import {
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Text,
  Button,
} from "react-native";
import { useDataContext } from "../Context";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    sessionAuth.get("/get_inbound_friend_requests").then((response) => {
      dataContext.setInboundFriendRequests(
        response.data.inbound_friendrequests
      );
    });
    sessionAuth.get("/get_outbound_friend_requests").then((response) => {
      dataContext.setOutboundFriendRequests(
        response.data.outbound_friendrequests
      );
    });
  }, []);

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
        let temp = dataContext.outboundFriendRequests.filter((obj) => {
          return obj != to_user.id;
        });
        dataContext.setOutboundFriendRequests(temp);
        dataContext.webSocket.send(
          JSON.stringify({
            sender: dataContext.user,
            receiver: to_user.id,
            message: "removefriendrequest",
          })
        );
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
        if (response.data.message == "accepted") {
          let temp = dataContext.inboundFriendRequests.filter((obj) => {
            return obj != user.id;
          });
          dataContext.setInboundFriendRequests(temp);
          let tempuser = dataContext.user;
          tempuser.friends.push(user.id);
          dataContext.setUser(tempuser);
          user.friends.push(dataContext.user.id);
          dataContext.webSocket.send(
            JSON.stringify({
              sender: dataContext.user,
              receiver: to_user.id,
              message: "acceptfriendrequest",
            })
          );
        } else {
          dataContext.setOutboundFriendRequests([
            ...dataContext.outboundFriendRequests,
            user.id,
          ]);
          dataContext.webSocket.send(
            JSON.stringify({
              sender: dataContext.user,
              receiver: to_user.id,
              message: "friendrequest",
            })
          );
        }
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
        let tempuser = dataContext.user;
        tempuser.friends = tempuser.friends.filter((obj) => {
          return obj != to_user.id;
        });
        dataContext.setUser(tempuser);

        dataContext.webSocket.send(
          JSON.stringify({
            sender: dataContext.user,
            receiver: to_user.id,
            message: "removefriend",
          })
        );
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
        {dataContext.user.friends.includes(user.id) ? (
          <Button
            title="Remove friend"
            color="red"
            onPress={() => removeFriend(user)}
          />
        ) : null}
        {dataContext.outboundFriendRequests.includes(user.id) ? (
          <Button
            title="Pending"
            color="orange"
            onPress={() => removeFriendRequest(user)}
          />
        ) : null}
        {!dataContext.user.friends.includes(user.id) &&
        !dataContext.outboundFriendRequests.includes(user.id) &&
        !dataContext.inboundFriendRequests.includes(user.id) ? (
          <Button
            title="Add friend"
            color="green"
            onPress={() => addFriend(user)}
          />
        ) : null}
        {dataContext.inboundFriendRequests.includes(user.id) ? (
          <Button
            title="Accept friend request"
            color="green"
            onPress={() => addFriend(user)}
          />
        ) : null}
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
