import { BoardProvider } from "@/context/BoardContext";
import { Board } from "@/components/Board";

function App(): JSX.Element {
  return (
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

export default App;
