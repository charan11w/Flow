import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";
import { BoardState, BoardAction } from "@/types";
import { boardReducer, initialState, loadFromStorage } from "./boardReducer";

interface BoardContextType {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadFromStorage();
    dispatch({ type: "LOAD_FROM_STORAGE", payload: loadedTasks });
  }, []);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }

  return context;
};
