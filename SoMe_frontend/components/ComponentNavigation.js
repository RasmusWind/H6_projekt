import { styles } from "../assets/styles";

export default function ComponentNavigation({
  icons,
  activeComponentIndex,
  setComponentIndex,
}) {
  return (
    <View style={styles.labelsContainer}>
      {icons.map((icon, index) => (
        <View
          key={index}
          onPress={() => setComponentIndex(index)}
          style={{
            ...(index == activeComponentIndex
              ? styles.activeIcon
              : styles.icon),
            ...styles.icons,
          }}
        >
          {icon}
        </View>
      ))}
    </View>
  );
}
