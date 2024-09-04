import { useDataContext } from "./Context";
import { Main } from "./components/main.js"

export default function App() {
  return (
    <useDataContext>
      <Main/>
    </useDataContext>
  );
}

