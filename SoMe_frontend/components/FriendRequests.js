import { View, Text, Image, Button } from "react-native";
import { useState, useEffect } from "react";
import { sessionAuth, server_url } from "../Api";
import { styles } from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDataContext } from "../Context";

export default function FriendRequests() {
  const dataContext = useDataContext();
  const [friendRequestUsers, setFriendRequestUsers] = useState([]);

  useEffect(() => {
    sessionAuth.get("/get_friend_requests").then((response) => {
      const data = response.data;
      setFriendRequestUsers(data.users);
    });
  }, []);

  function handleRejectRequest(from_user) {
    sessionAuth
      .post(
        "/reject_friend_request",
        {
          from_username: from_user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        let temp_fru = friendRequestUsers.filter((fru) => {
          return from_user.username != fru.username;
        });
        setFriendRequestUsers(temp_fru);
        dataContext.webSocket.send(
          JSON.stringify({
            sender: dataContext.user,
            receiver: from_user.id,
            message: "removefriendrequest",
          })
        );
      });
  }

  function handleAcceptRequest(from_user) {
    sessionAuth
      .post(
        "/accept_friend_request",
        {
          from_username: from_user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        let temp_fru = friendRequestUsers.filter((fru) => {
          return from_user.username != fru.username;
        });
        setFriendRequestUsers(temp_fru);

        let tempuser = dataContext.user;
        tempuser.friends = [...tempuser.friends, from_user.id];
        dataContext.setUser(tempuser);
        dataContext.webSocket.send(
          JSON.stringify({
            sender: dataContext.user,
            receiver: from_user.id,
            message: "acceptfriendrequest",
          })
        );
      });
  }

  return (
    <View>
      <View style={styles.userSearch}>
        <Icon
          onPress={() => dataContext.setActionComponent(null)}
          style={styles.iconBack}
          name="arrow-left"
          size={30}
        />
        <Text style={styles.createPostTitle}>Friend Requests</Text>
      </View>
      <View style={styles.createPostContainer}>
        <View style={styles.userSearchResults}>
          {friendRequestUsers.map((user, index) => (
            <View key={index} style={styles.userContainer}>
              <Image
                source={{ uri: server_url + user.extendeduser.image }}
                style={styles.userImage}
              />
              <View style={styles.userText}>
                <Text style={styles.whiteText}>
                  {user.first_name} {user.last_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Button
                  style={styles.userListButton}
                  title="Reject"
                  color="red"
                  onPress={() => handleRejectRequest(user)}
                />
                <Button
                  style={styles.userListButton}
                  title="Accept"
                  color="green"
                  onPress={() => handleAcceptRequest(user)}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
