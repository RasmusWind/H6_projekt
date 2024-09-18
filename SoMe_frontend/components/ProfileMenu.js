import { styles } from "../assets/styles";
import { View, Text, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDataContext } from "../Context";
import ProfilePage from "./ProfilePage";
import { useEffect } from "react";
import FriendRequests from "./FriendRequests";

export default function ProfileMenu({ user, location }) {
  const dataContext = useDataContext();
  const boxWidth = 170;
  const menuTop = location[1];
  const menuLeft = location[0] - boxWidth;

  return (
    <View
      style={{
        position: "absolute",
        width: boxWidth,
        top: menuTop,
        left: menuLeft,
        backgroundColor: "grey",
        borderWidth: 1,
        borderColor: "black",
        padding: 5,
        rowGap: 5,
        zIndex: 10000,
      }}
    >
      <TouchableHighlight
        onPress={() => {
          dataContext.setShowProfile(false);
          dataContext.setActionComponent(
            <ProfilePage user={dataContext.user} />
          );
        }}
      >
        <Text style={styles.profileMenuText}>Profile</Text>
      </TouchableHighlight>
      {user.has_friend_requests ? (
        <TouchableHighlight
          onPress={() => {
            dataContext.setShowProfile(false);
            dataContext.setActionComponent(<FriendRequests />);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 5,
            }}
          >
            <Text style={styles.profileMenuText}>Friend requests</Text>
            <Icon name="exclamation" color="red" size={20} />
          </View>
        </TouchableHighlight>
      ) : (
        <Text style={{ ...styles.profileMenuText, color: "#444" }}>
          Friend requests
        </Text>
      )}
      <TouchableHighlight
        onPress={() => {
          dataContext.setToken();
          dataContext.setUser();
        }}
      >
        <Text style={styles.profileMenuText}>Logout</Text>
      </TouchableHighlight>
    </View>
  );
}
