import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { sessionAuth } from "../Api";
import Post from "./Post";
import { useDataContext } from "../Context";

export default function PublicPostPage() {
  const dataContext = useDataContext();
  const [posts, setPosts] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(-1);
  const [beginDrag, setBeginDrag] = useState(-1);

  function getPosts() {
    sessionAuth
      .get("/get_public_posts")
      .then((response) => {
        setPosts(response.data.posts);
        dataContext.setPublicPostUpdatedAmount(0);
      })
      .catch((error) => {});
  }

  useEffect(() => {
    dataContext.setPublicPostUpdatedAmount(0);
    getPosts();
  }, []);

  function getScrollPosition(event) {
    console.log(event.nativeEvent.contentOffset.y);
    const y = event.nativeEvent.contentOffset.y;
    setScrollPosition(y);
  }

  function shouldUpdate(event) {
    let endPos = event.nativeEvent.contentOffset.y;
    if (
      endPos == 0 &&
      beginDrag == 0 &&
      scrollPosition == 0 &&
      dataContext.publicPostUpdatedAmount > 0
    ) {
      getPosts();
    }
  }

  return (
    <ScrollView
      onScroll={getScrollPosition}
      onScrollBeginDrag={(event) => {
        setBeginDrag(event.nativeEvent.contentOffset.y);
        setScrollPosition(event.nativeEvent.contentOffset.y);
      }}
      onScrollEndDrag={shouldUpdate}
      style={{
        overflow: "scroll",
        padding: 5,
        height: "100%",
      }}
    >
      <View
        style={{
          rowGap: 5,
        }}
      >
        {dataContext.publicPostUpdatedAmount > 0 ? (
          <Text>New posts: {dataContext.publicPostUpdatedAmount}</Text>
        ) : null}
        {posts.map((post, index) => (
          <Post key={index} data={post} allposts={posts} setPosts={setPosts} />
        ))}
      </View>
    </ScrollView>
  );
}
