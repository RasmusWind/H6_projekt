import { View, useState } from "react-native";
import { session_request } from "../Api";

export default function PostPage({ publicBool }) {
  const [posts, setPosts] = useState([]);

  if (publicBool) {
    session_request.get("/all_posts").then(function (response) {
      setPosts(response.posts);
    });

    return (
      <View>
        {posts.map((post) => (
          <View styles={styles.postContainer}>
            <Text>{post.text}</Text>
          </View>
        ))}
      </View>
    );
  }

  session_request.get("/friend_posts").then(function (response) {
    setPosts(response.posts);
  });
  return (
    <View>
      {posts.map((post) => (
        <View styles={styles.postContainer}>
          <Text>{post.text}</Text>
        </View>
      ))}
    </View>
  );
}
