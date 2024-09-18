import { ContextProvider } from "./Context";
import { StatusBar } from "react-native";
import SocketWrapper from "./components/SocketWrapper";

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <ContextProvider>
        <SocketWrapper />
      </ContextProvider>
    </>
  );
}
