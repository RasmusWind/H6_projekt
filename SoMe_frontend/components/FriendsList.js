import { useEffect, useState } from "react";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";
import { View, Text, Image, Button } from "react-native";
import { server_url } from "../Api";
import { styles } from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome";

export default function FriendsList({ setState }) {
  const dataContext = useDataContext();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    sessionAuth.get("/get_friends").then((response) => {
      const data = response.data;
      setFriends(data.friends);
    });
  }, []);

  if (friends.length == 0) {
    return (
      <View style={{ height: "100%" }}>
        <Text>You have no friends</Text>
      </View>
    );
  }

  function handleRemoveFriend(friend) {
    sessionAuth
      .post(
        "/remove_friend",
        {
          friend_username: friend.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        let friend_index = friends.indexOf(friend);
        let friends_temp = friends.slice(friend_index, friend_index);
        setFriends(friends_temp);
      });
  }

  return (
    <View style={{ height: "100%" }}>
      <View style={styles.friendList}>
        {friends.map((friend, index) => (
          <View key={index} style={styles.userContainer}>
            <Image
              source={{ uri: server_url + friend.extendeduser.image }}
              style={styles.userImage}
            />
            <View style={styles.userText}>
              <Text>
                {friend.first_name} {friend.last_name}
              </Text>
              <Text>{friend.email}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Button
                style={styles.userListButton}
                title="Remove"
                color="red"
                onPress={() => handleRemoveFriend(friend)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
