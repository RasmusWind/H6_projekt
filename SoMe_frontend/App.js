import { ContextProvider } from "./Context";
import Main from "./components/Main";

export default function App() {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
}
