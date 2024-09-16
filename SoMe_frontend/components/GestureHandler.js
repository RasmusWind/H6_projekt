import { View } from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { useState } from "react";
import ComponentNavigation from "./ComponentNavigation";
import { styles } from "../assets/styles";
import ActionBar from "./ActionBar";

export default function GestureHandler({
  components = [],
  defaultComponentIndex = 0,
}) {
  if (components.length == 0) {
    return;
  }

  const [componentIndex, setComponentIndex] = useState(defaultComponentIndex);
  console.log(componentIndex);
  const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

  function onSwipeHandler(direction, state) {
    switch (direction) {
      case SWIPE_UP:
        break;

      case SWIPE_DOWN:
        break;

      case SWIPE_LEFT:
        // TODO, should switch pages
        if (componentIndex >= components.length) {
          return;
        } else {
          setComponentIndex(componentIndex + 1);
        }
        break;

      case SWIPE_RIGHT:
        // TODO, should switch pages
        if (componentIndex <= 0) {
          return;
        } else {
          setComponentIndex(componentIndex - 1);
        }
        break;
    }
  }

  let component = components[componentIndex];

  return (
    <View style={styles.flexFillHeight}>
      <ComponentNavigation
        icons={components.map((comp) => comp.icon)}
        activeComponentIndex={componentIndex}
        setComponentIndex={setComponentIndex}
      />
      <GestureRecognizer
        onSwipe={(direction, state) => onSwipeHandler(direction, state)}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 50,
        }}
      >
        <component.component {...component.props} />
      </GestureRecognizer>
    </View>
  );
}
