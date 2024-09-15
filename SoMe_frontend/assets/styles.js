import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  input: {
    color: "white",
    borderColor: "white",
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  whiteText: {
    color: "white",
  },
  backarrow: {
    position: "absolute",
    left: 10,
    top: 30,
  },
  footer: {
    marginBottom: 5,
  },
  iconsContainer: {
    borderTopWidth: 1,
    height: "200px",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icons: {
    color: "white",
    padding: 5,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderRadius: 2,
  },
  icon: {
    borderColor: "pink",
  },
  activeicon: {
    fontWeight: "bold",
    borderColor: "red",
  },
});
