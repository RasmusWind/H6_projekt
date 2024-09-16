import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { iconColor, styles } from "../assets/styles";
import CreatePost from "./CreatePost";
import UserSearch from "./UserSearch";

export default function ActionBar({ setActionComponent }) {
  return (
    <View style={styles.actionBar}>
      <Icon
        name="pencil"
        size={30}
        color={iconColor}
        onPress={() =>
          setActionComponent(
            <CreatePost setActionComponent={setActionComponent} />
          )
        }
      />
      <Icon
        name="search"
        size={30}
        color={iconColor}
        onPress={() =>
          setActionComponent(
            <UserSearch setActionComponent={setActionComponent} />
          )
        }
      />
    </View>
  );
}
