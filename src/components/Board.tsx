import { useState } from "react";
import { Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import { Column } from "./Column";
import { TaskModal } from "./TaskModal";

export const Board = () => {
  const { state, dispatch } = useBoard();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-medium text-blue-700" role="status" aria-live="polite">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-blue-200">
      <header className="relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 shadow-md">
        <div className="max-w-6xl w-full mx-auto text-center">
          <p className="text-lg opacity-90 font-light">Kanban Board</p>
        </div>
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 border border-white border-opacity-60 text-white px-4 py-2 rounded text-sm font-medium hover:bg-white hover:bg-opacity-10 transition-all"
          onClick={() => setShowClearModal(true)}
          aria-label="Clear board"
        >
          Clear
        </button>
      </header>

      <main className="flex flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="grid grid-cols-3 gap-6 w-full">
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
        <div className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-4 rounded shadow-lg animate-slideInUp z-50" role="alert">
          {state.error}
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={() => setShowClearModal(false)}>
          <div
            className="bg-white rounded-lg shadow-2xl max-w-sm w-11/12 p-8 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clear Board</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Which board would you like to clear?</p>
            <div className="flex flex-col gap-3 mb-6">
              <button
                className="px-4 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleClearColumn("todo")}
              >
                Clear To Do
              </button>
              <button
                className="px-4 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleClearColumn("inProgress")}
              >
                Clear In Progress
              </button>
              <button
                className="px-4 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleClearColumn("done")}
              >
                Clear Done
              </button>
              <button
                className="px-4 py-3 bg-gray-100 text-red-700 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 hover:border-gray-300 transition-all text-left"
                onClick={() => handleClearColumn("all")}
              >
                Clear All Boards
              </button>
            </div>
            <button
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 hover:border-gray-300 transition-all"
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
