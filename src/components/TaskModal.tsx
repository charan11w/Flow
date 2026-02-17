import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useBoard } from "@/context/BoardContext";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal = ({ task, isOpen, onClose }: TaskModalProps) => {
  const { dispatch } = useBoard();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description);
      setIsEditing(false);
      setError(null);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSave = (): void => {
    setError(null);

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required");
      return;
    }

    if (title.trim().length > 100) {
      setError("Task title must be 100 characters or less");
      return;
    }

    if (description.trim().length > 500) {
      setError("Task description must be 500 characters or less");
      return;
    }

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        taskId: task.id,
        title: title.trim(),
        description: description.trim(),
      },
    });

    setIsEditing(false);
  };

  const handleDelete = (): void => {
    if (confirm("Are you sure you want to delete this task?")) {
      dispatch({ type: "DELETE_TASK", payload: task.id });
      onClose();
    }
  };

  const handleCancel = (): void => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
    setError(null);
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose} role="presentation">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-xl w-11/12 max-h-96 overflow-y-auto relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="absolute top-4 right-4 bg-transparent text-gray-400 border-none text-3xl leading-none w-10 h-10 flex items-center justify-center cursor-pointer rounded hover:bg-gray-100 hover:text-gray-800 transition-all z-50"
          onClick={onClose}
          aria-label="Close modal"
          title="Close"
        >
          ×
        </button>

        <div className="px-6 pt-6 pb-4 border-b border-gray-300 flex items-baseline justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 font-medium">{formattedDate}</span>
        </div>

        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-300 text-red-800 px-3.5 py-3 rounded text-sm animate-shake" role="alert">
            {error}
          </div>
        )}

        <div className="p-6">
          {isEditing ? (
            <>
              <div className="mb-6 flex flex-col gap-2">
                <label htmlFor="modal-title-input" className="text-sm font-medium text-gray-800">
                  Title
                </label>
                <input
                  id="modal-title-input"
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <span className="text-xs text-gray-500 text-right">
                  {title.length}/{100}
                </span>
              </div>

              <div className="mb-6 flex flex-col gap-2">
                <label htmlFor="modal-description-input" className="text-sm font-medium text-gray-800">
                  Description
                </label>
                <textarea
                  id="modal-description-input"
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={5}
                />
                <span className="text-xs text-gray-500 text-right">
                  {description.length}/{500}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Title</label>
                <p className="text-sm text-gray-900 leading-relaxed">{task.title}</p>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Description</label>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{task.description}</p>
              </div>

              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Column</label>
                <p className="text-sm text-gray-900">
                  {task.column === "todo"
                    ? "To Do"
                    : task.column === "inProgress"
                      ? "In Progress"
                      : "Done"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 py-6 border-t border-gray-300 justify-end">
          {isEditing ? (
            <>
              <button
                className="px-5 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-gray-800 text-white border border-gray-800 rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="px-5 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={handleDelete}
              >
                Delete Task
              </button>
              <button
                className="px-5 py-2 bg-gray-800 text-white border border-gray-800 rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Edit Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
