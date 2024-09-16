import { styles } from "../assets/styles";

export default function ProfileMenu({data}){
    return (
        <View style={styles.profileMenu}>
            <View>
                <Text>Profile</Text>
            </View>
            {data.has_friend_requests}
            <View>
                <Text>Friend requests</Text>
            </View>
        </View>
    )
}