export type ColumnType = "todo" | "inProgress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  createdAt: number;
  order: number;
}

export interface BoardState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

export type BoardAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "createdAt" | "order"> }
  | { type: "DELETE_TASK"; payload: string }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; newColumn: ColumnType };
    }
  | {
      type: "REORDER_TASK";
      payload: { taskId: string; newIndex: number; column: ColumnType };
    }
  | {
      type: "UPDATE_TASK";
      payload: { taskId: string; title: string; description: string };
    }
  | { type: "LOAD_FROM_STORAGE"; payload: Task[] }
  | { type: "SET_ERROR"; payload: string | null };
