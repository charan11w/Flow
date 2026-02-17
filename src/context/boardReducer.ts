import { BoardState, BoardAction, Task, ColumnType } from "@/types";

const STORAGE_KEY = "flow_kanban_board";
const DUPLICATE_THRESHOLD = 100;

export const initialState: BoardState = {
  tasks: [],
  isLoading: true,
  error: null,
};

/**
 * Validates if a task ID already exists in the tasks array
 */
function isTaskIdDuplicate(tasks: Task[], newId: string): boolean {
  return tasks.some((task) => task.id === newId);
}

/**
 * Generates a unique ID using timestamp + random value
 */
function generateUniqueId(existingTasks: Task[]): string {
  let id: string;
  let attempts = 0;

  do {
    id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    attempts++;

    if (attempts > DUPLICATE_THRESHOLD) {
      console.warn(
        "Failed to generate unique ID after multiple attempts, using fallback"
      );
      id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
      break;
    }
  } while (isTaskIdDuplicate(existingTasks, id));

  return id;
}

/**
 * Recalculate order for tasks in a column
 */
function recalculateOrder(
  tasks: Task[],
  column: ColumnType
): { updatedTasks: Task[]; maxOrder: number } {
  const columnTasks = tasks.filter((t) => t.column === column);
  const maxOrder = columnTasks.length;

  const updatedTasks = tasks.map((task) => {
    if (task.column === column) {
      const index = columnTasks.indexOf(task);
      return { ...task, order: index };
    }
    return task;
  });

  return { updatedTasks, maxOrder };
}

export const boardReducer = (
  state: BoardState,
  action: BoardAction
): BoardState => {
  switch (action.type) {
    case "ADD_TASK": {
      const columnTasks = state.tasks.filter(
        (t) => t.column === action.payload.column
      );
      const newOrder = columnTasks.length;

      const newTask: Task = {
        ...action.payload,
        id: generateUniqueId(state.tasks),
        createdAt: Date.now(),
        order: newOrder,
      };

      const newState: BoardState = {
        ...state,
        tasks: [...state.tasks, newTask],
        error: null,
      };

      persistToStorage(newState.tasks);
      return newState;
    }

    case "DELETE_TASK": {
      const updatedTasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );

      // Recalculate order for all columns
      const allColumns: ColumnType[] = ["todo", "inProgress", "done"];
      let finalTasks = updatedTasks;

      for (const column of allColumns) {
        const { updatedTasks: reordered } = recalculateOrder(finalTasks, column);
        finalTasks = reordered;
      }

      const newState: BoardState = {
        ...state,
        tasks: finalTasks,
        error: null,
      };

      persistToStorage(newState.tasks);
      return newState;
    }

    case "MOVE_TASK": {
      const taskToMove = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );

      if (!taskToMove) {
        return {
          ...state,
          error: `Task with ID ${action.payload.taskId} not found`,
        };
      }

      // Move task to new column
      let updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, column: action.payload.newColumn }
          : task
      );

      // Recalculate order for old and new columns
      const { updatedTasks: reorderedOld } = recalculateOrder(
        updatedTasks,
        taskToMove.column
      );
      const { updatedTasks: reorderedNew } = recalculateOrder(
        reorderedOld,
        action.payload.newColumn
      );

      const newState: BoardState = {
        ...state,
        tasks: reorderedNew,
        error: null,
      };

      persistToStorage(newState.tasks);
      return newState;
    }

    case "REORDER_TASK": {
      const taskToMove = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );

      if (!taskToMove) {
        return {
          ...state,
          error: `Task with ID ${action.payload.taskId} not found`,
        };
      }

      // Filter tasks in the column
      const columnTasks = state.tasks.filter(
        (t) => t.column === action.payload.column
      );

      // Remove task from column
      const otherColumnTasks = columnTasks.filter(
        (t) => t.id !== action.payload.taskId
      );

      // Insert at new index
      const newIndex = Math.max(
        0,
        Math.min(action.payload.newIndex, otherColumnTasks.length)
      );
      otherColumnTasks.splice(newIndex, 0, taskToMove);

      // Rebuild full task list
      const tasksOutsideColumn = state.tasks.filter(
        (t) => t.column !== action.payload.column
      );
      const reorderedTasks = otherColumnTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      const newState: BoardState = {
        ...state,
        tasks: [...tasksOutsideColumn, ...reorderedTasks],
        error: null,
      };

      persistToStorage(newState.tasks);
      return newState;
    }

    case "UPDATE_TASK": {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              title: action.payload.title,
              description: action.payload.description,
            }
          : task
      );

      const newState: BoardState = {
        ...state,
        tasks: updatedTasks,
        error: null,
      };

      persistToStorage(newState.tasks);
      return newState;
    }

    case "LOAD_FROM_STORAGE": {
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        error: null,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
      };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
};

/**
 * Persists tasks to localStorage
 */
function persistToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to persist state to localStorage:", error);
  }
}

/**
 * Loads and validates tasks from localStorage
 */
export function loadFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn("Invalid localStorage data: not an array");
      return [];
    }

    const tasks = parsed.filter((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        typeof item.description !== "string" ||
        !["todo", "inProgress", "done"].includes(item.column) ||
        typeof item.createdAt !== "number"
      ) {
        console.warn("Skipping invalid task item:", item);
        return false;
      }
      return true;
    });

    return tasks as Task[];
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return [];
  }
}
