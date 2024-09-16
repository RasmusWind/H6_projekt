import { TextInput, Text, View, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "../assets/styles";
import { useState } from "react";
import CheckBox from "react-native-check-box";
import { sessionAuth } from "../Api";
import { useDataContext } from "../Context";

export default function CreatePost({ setActionComponent }) {
  const dataContext = useDataContext();
  const [postText, setPostText] = useState();
  const [publicPost, setPublicPost] = useState(false);
  const [errorText, setErrorText] = useState();

  function handleSubmitPost(event) {
    if (postText.length == 0) {
      setErrorText("Cannot create an empty post");
    }

    sessionAuth
      .post(
        "/create_post",
        {
          postText: postText,
          isPublic: publicPost,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${dataContext.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setActionComponent(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View>
      <View style={styles.userSearch}>
        <Icon
          onPress={() => setActionComponent(null)}
          style={styles.iconBack}
          name="arrow-left"
          size={30}
        />
        <Text style={styles.createPostTitle}>Create Post</Text>
      </View>
      <View style={styles.createPostContainer}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}
        >
          Post:
        </Text>
        <TextInput
          value={postText}
          onChangeText={setPostText}
          placeholder="Text..."
          placeholderTextColor="grey"
          style={styles.postInput}
          numberOfLines={10}
          multiline
          textBreakStrategy=""
        />
        <CheckBox
          onClick={() => setPublicPost(!publicPost)}
          isChecked={publicPost}
          leftText="Make post public?"
          leftTextStyle={{
            fontSize: 20,
            color: "white",
          }}
          checkBoxColor="grey"
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button title="Submit" onPress={handleSubmitPost} />
      </View>
    </View>
  );
}
