import { StyleSheet } from "react-native";

export const activeIconColor = "#0272fa";
export const iconColor = "#0228fa";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  appTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appLoginContainer: {
    flex: 1,
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
  loginFooter: {
    marginBottom: 5,
  },
  navContainer: {
    backgroundColor: "#111",
    height: "200px",
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icons: {
    color: "white",
    padding: 5,
  },
  iconView: {
    margin: 5,
  },
  activeIcon: {
    fontWeight: "bold",
    borderColor: "red",
  },
  appTitle: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 35,
    fontStyle: "italic",
  },
  signUpTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "blue",
  },
  signUpError: {
    color: "red",
  },
  signUpTitleContainer: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpErrorContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  navProfilePicture: {
    margin: 5,
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  appBase: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#222",
    height: "100%",
  },
  actionBar: {
    backgroundColor: "#111",
    borderTopWidth: 1,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  main: {
    height: "100%",
  },
  flexFillHeight: {
    flex: 1,
  },
  friendList: {
    flexDirection: "column",
    overflow: "scroll",
  },
  userContainer: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    flex: 1,
    flexDirection: "column",
    margin: 5,
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    margin: 5,
  },
  searchBarContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "grey",
    flexDirection: "row",
  },
  searchBarIcon: {
    margin: 8,
  },
  iconBack: {
    padding: 5,
    color: "grey",
  },
  userSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  userSearchResults: {
    flexDirection: "column",
  },
  userListButton: {
    marginRight: 5,
  },
  searchBarInput: {
    flex: 1,
  },
  createPostTitle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  createPostContainer: {
    padding: 10,
    rowGap: 10,
  },
  postInput: {
    color: "white",
    borderWidth: 1,
    borderColor: "grey",
    padding: 3,
    textAlignVertical: "top",
    borderRadius: 5,
  },
  postUserImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    margin: 5,
  },
});
