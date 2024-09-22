import { View, Image, Text, Button, TouchableOpacity } from "react-native";
import { server_url } from "../Api";
import { styles } from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDataContext } from "../Context";
import ProfilePage from "./ProfilePage";
import { sessionAuth } from "../Api";

export default function Post({ data, allposts, setPosts }) {
  const dataContext = useDataContext();
  const user = data.author;

  function removePost(post_data) {
    sessionAuth
      .post(
        "/remove_post",
        {
          post_id: post_data.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        let new_posts = allposts.filter((post) => {
          return post.id != post_data.id;
        });
        setPosts(new_posts);
      })
      .catch((error) => {});
  }

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
          <TouchableOpacity
            onPress={() => {
              dataContext.setActionComponent(<ProfilePage user={user} />);
            }}
          >
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
          </TouchableOpacity>
          <View>
            <Text style={{ color: "white" }}>{data.text}</Text>
          </View>
        </View>
        {data.author.id == dataContext.user.id ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row-reverse",
            }}
          >
            <Icon
              name="times"
              color="grey"
              size={20}
              onPress={() => removePost(data)}
            />
          </View>
        ) : null}
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
