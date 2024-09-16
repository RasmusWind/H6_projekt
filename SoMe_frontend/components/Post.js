import { View, Image, Text, Button } from "react-native";
import { server_url } from "../Api";
import { styles } from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Post({ data }) {
  const user = data.author;
  return (
    <View
      style={{
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 5,
        }}
      >
        <View
          style={{
            height: 50,
          }}
        >
          <Image
            source={{ uri: server_url + user.extendeduser.image }}
            style={styles.postUserImage}
          />
        </View>
        <View>
          <View
            style={{
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>
              {user.first_name} {user.last_name}
            </Text>
          </View>
          <View>
            <Text style={{ color: "white" }}>{data.text}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 30,
          borderTopWidth: 1,
          borderTopColor: "grey",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Icon name="thumbs-o-up" color="grey" size={20} />
        <Icon name="comment-o" color="grey" size={20} />
      </View>
    </View>
  );
}
