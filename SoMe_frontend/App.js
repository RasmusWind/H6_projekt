import { ContextProvider } from "./Context";
import Main from "./components/Main";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <ContextProvider>
        <Main />
      </ContextProvider>
    </>
  );
}
