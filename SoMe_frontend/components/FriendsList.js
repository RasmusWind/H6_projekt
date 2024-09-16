import { useEffect, useState } from "react";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";
import { View, Text, Image } from "react-native";
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
      <View>
        <Text>You have no friends</Text>
      </View>
    );
  }

  return (
    <View style={{ height: "100%" }}>
      <View style={styles.friendList}>
        {friends.map((friend) => (
          <View style={styles.userContainer}>
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
          </View>
        ))}
      </View>
    </View>
  );
}
