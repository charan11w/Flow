import { useState } from "react";
import { Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import { Column } from "./Column";
import { TaskModal } from "./TaskModal";
import "@/styles/Board.css";

export const Board = () => {
  const { state, dispatch } = useBoard();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  if (state.isLoading) {
    return (
      <div className="board-loading" role="status" aria-live="polite">
        <p>Loading board...</p>
      </div>
    );
  }

  const handleTaskDelete = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  const handleClearColumn = (column: string) => {
    if (column === "all") {
      if (confirm("Are you sure you want to clear all boards?")) {
        state.tasks.forEach((task) => {
          dispatch({ type: "DELETE_TASK", payload: task.id });
        });
        setShowClearModal(false);
      }
    } else {
      const columnTasks = state.tasks.filter((task) => task.column === column);
      const columnName =
        column === "todo" ? "To Do" : column === "inProgress" ? "In Progress" : "Done";
      if (confirm(`Are you sure you want to clear the ${columnName} board?`)) {
        columnTasks.forEach((task) => {
          dispatch({ type: "DELETE_TASK", payload: task.id });
        });
        setShowClearModal(false);
      }
    }
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <div className="board-header-content">
          <h1 className="board-title">Flow</h1>
          <p className="board-subtitle">Kanban Board</p>
        </div>
        <button
          className="board-clear-btn"
          onClick={() => setShowClearModal(true)}
          aria-label="Clear board"
        >
          Clear
        </button>
      </header>

      <main className="board-main">
        <div className="board-columns">
          <Column
            title="To Do"
            columnType="todo"
            tasks={state.tasks}
            onTaskClick={setSelectedTask}
            draggedTask={draggedTask}
            onTaskDragStart={setDraggedTask}
            onTaskDelete={handleTaskDelete}
          />
          <Column
            title="In Progress"
            columnType="inProgress"
            tasks={state.tasks}
            onTaskClick={setSelectedTask}
            draggedTask={draggedTask}
            onTaskDragStart={setDraggedTask}
            onTaskDelete={handleTaskDelete}
          />
          <Column
            title="Done"
            columnType="done"
            tasks={state.tasks}
            onTaskClick={setSelectedTask}
            draggedTask={draggedTask}
            onTaskDragStart={setDraggedTask}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {state.error && (
        <div className="board-error-toast" role="alert">
          {state.error}
        </div>
      )}

      {showClearModal && (
        <div className="clear-modal-overlay" onClick={() => setShowClearModal(false)}>
          <div
            className="clear-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="clear-modal-title">Clear Board</h2>
            <p className="clear-modal-text">Which board would you like to clear?</p>
            <div className="clear-modal-options">
              <button
                className="clear-modal-btn"
                onClick={() => handleClearColumn("todo")}
              >
                Clear To Do
              </button>
              <button
                className="clear-modal-btn"
                onClick={() => handleClearColumn("inProgress")}
              >
                Clear In Progress
              </button>
              <button
                className="clear-modal-btn"
                onClick={() => handleClearColumn("done")}
              >
                Clear Done
              </button>
              <button
                className="clear-modal-btn clear-modal-btn-danger"
                onClick={() => handleClearColumn("all")}
              >
                Clear All Boards
              </button>
            </div>
            <button
              className="clear-modal-close"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
