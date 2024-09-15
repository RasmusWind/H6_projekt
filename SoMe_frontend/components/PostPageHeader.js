import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function PostPageHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text>All Posts</Text>
      <Text>Friend Posts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    height: "15px",
  },
});
