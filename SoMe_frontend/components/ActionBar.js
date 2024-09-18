import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { iconColor, styles } from "../assets/styles";
import CreatePost from "./CreatePost";
import UserSearch from "./UserSearch";
import { useDataContext } from "../Context";

export default function ActionBar() {
  const dataContext = useDataContext();
  return (
    <View style={styles.actionBar}>
      <Icon
        name="pencil"
        size={30}
        color={iconColor}
        onPress={() => {
          dataContext.setShowProfile(false);
          dataContext.setActionComponent(
            <CreatePost />
          );
        }}
      />
      <Icon
        name="search"
        size={30}
        color={iconColor}
        onPress={() => {
          dataContext.setShowProfile(false);
          dataContext.setActionComponent(
            <UserSearch />
          );
        }}
      />
    </View>
  );
}
