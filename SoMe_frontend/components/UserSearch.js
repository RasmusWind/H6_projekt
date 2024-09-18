import { TextInput, View, Image, Text, Button } from "react-native";
import { styles } from "../assets/styles";
import { useState, useEffect, useRef } from "react";
import { sessionAuth } from "../Api";
import Icon from "react-native-vector-icons/FontAwesome";
import { server_url } from "../Api";
import { useDataContext } from "../Context";

export default function UserSearch({ setActionComponent }) {
  const dataContext = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  function handleRemoveFriendRequest(to_user) {
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
      })
      .catch((error) => {});
  }

  function handleAddFriend(to_user) {
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
        dataContext.setOutboundFriendRequests([...dataContext.outboundFriendRequests, to_user.id]);
        dataContext.webSocket.send(
          JSON.stringify({
            sender: dataContext.user,
            receiver: to_user.id,
            message: "friendrequest",
          })
        );
      })
      .catch((error) => {});
  }

  useEffect(() => {
    sessionAuth
      .get("/get_outbound_friend_requests")
      .then((response) => {
        dataContext.setOutboundFriendRequests(response.data.outbound_friendrequests);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      sessionAuth
        .get(`search_users?searchTerm=${searchTerm}`)
        .then((response) => {
          let response_users = response.data.users;
          response_users = response_users.filter((user) => {
            return !user.is_friend;
          });
          setUsers(response_users);
        });
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  return (
    <View>
      <View style={styles.userSearch}>
        <Icon
          onPress={() => dataContext.setActionComponent(null)}
          style={styles.iconBack}
          name="arrow-left"
          size={30}
        />
        <View style={styles.searchBarContainer}>
          <Icon
            name="search"
            size={20}
            color="grey"
            style={styles.searchBarIcon}
          />
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search users..."
            placeholderTextColor="grey"
            color="white"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>
      <View style={styles.userSearchResults}>
        {users.map((user, index) => (
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
            {dataContext.outboundFriendRequests.includes(user.id) ? (
              <Button
                style={styles.userListButton}
                title="pending"
                color="orange"
                onPress={() => handleRemoveFriendRequest(user)}
              />
            ) : (
              <Button
                style={styles.userListButton}
                title="Add friend"
                color="green"
                onPress={() => handleAddFriend(user)}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
