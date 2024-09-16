import { styles } from "../assets/styles";
import { View, Image, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDataContext } from "../Context";
import { sessionAuth } from "../Api";
import { activeIconColor, iconColor } from "../assets/styles";
import { useState } from "react";

export default function ComponentNavigation({
  icons,
  activeComponentIndex,
  setComponentIndex,
}) {
  const dataContext = useDataContext();
  const user = dataContext.user;
  const server_url = sessionAuth.getUri();

  const [showProfile, setShowProfile] = useState(false);

  function handleProfilePress() {}

  return (
    <View style={styles.navContainer}>
      <View style={styles.iconsContainer}>
        {icons.map((icon, index) => (
          <View style={styles.iconView} key={index}>
            <Icon
              key={index}
              name={icon.name}
              size={icon.size}
              color={
                activeComponentIndex == index ? activeIconColor : iconColor
              }
              onPress={() => {
                setComponentIndex(index);
              }}
            />
          </View>
        ))}
      </View>
      <View style={styles.navigationProfile}>
        <TouchableHighlight
          onPress={handleProfilePress}
          style={{ borderRadius: 50 }}
        >
          <Image
            style={styles.navProfilePicture}
            source={{ uri: server_url + user.extendeduser.image }}
          />
        </TouchableHighlight>
      </View>
      {showProfile ? <ProfileMenu data={dataContext.user} /> : null}
    </View>
  );
}
