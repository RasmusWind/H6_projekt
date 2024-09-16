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
        let user_index = users.indexOf(to_user);
        to_user.has_pending_friend_request = false;
        setUsers([
          ...users.slice(0, user_index),
          to_user,
          ...users.slice(user_index + 1),
        ]);
      });
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
        let user_index = users.indexOf(to_user);
        to_user.has_pending_friend_request = true;
        setUsers([
          ...users.slice(0, user_index),
          to_user,
          ...users.slice(user_index + 1),
        ]);
      });
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      sessionAuth
        .get(`search_users?searchTerm=${searchTerm}`)
        .then((response) => {
          setUsers(response.data.users);
        });
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  return (
    <View>
      <View style={styles.userSearch}>
        <Icon
          onPress={() => setActionComponent(null)}
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
            {user.has_pending_friend_request ? (
              <Button
                style={styles.userListButton}
                title="pending"
                color="red"
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
