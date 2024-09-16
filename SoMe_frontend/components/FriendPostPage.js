import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { sessionAuth } from "../Api";
import Post from "./Post";

export default function FriendPostPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    sessionAuth
      .get("/get_friend_posts")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {});
  }, []);

  return (
    <ScrollView
      style={{
        overflow: "scroll",
        padding: 5,
      }}
    >
      <View
        style={{
          rowGap: 5,
        }}
      >
        {posts.map((post, index) => (
          <Post key={index} data={post} />
        ))}
      </View>
    </ScrollView>
  );
}
