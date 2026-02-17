import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  openInEditMode?: boolean;
}

export const TaskModal = ({ task, isOpen, onClose, openInEditMode = false }: TaskModalProps) => {
  const { dispatch } = useBoard();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(openInEditMode);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description);
      setIsEditing(openInEditMode);
      setError(null);
    }
  }, [isOpen, task, openInEditMode]);

  if (!isOpen) return null;

  const hasChanges = title !== task.title || description !== task.description;

  const handleSave = (): void => {
    setError(null);

    if (!hasChanges) {
      setError("Have not done any changes");
      return;
    }

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

    onClose();
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    dispatch({ type: "DELETE_TASK", payload: task.id });
    onClose();
  };

  const handleExit = (): void => {
    if (isEditing && hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        onClick={handleExit}
        role="presentation"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto relative animate-slideUp flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="sticky top-0 z-40 bg-white px-8 pt-8 pb-6 border-b border-gray-200 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 id="modal-title" className="text-3xl font-bold text-gray-900">
                {isEditing ? "Edit Task" : "Task Details"}
              </h2>
              <p className="text-sm text-gray-500 mt-2 font-medium">{formattedDate}</p>
            </div>
            <button
              className="flex-shrink-0 bg-transparent text-gray-400 border-none text-3xl leading-none w-10 h-10 flex items-center justify-center cursor-pointer rounded hover:bg-gray-100 hover:text-gray-800 transition-all"
              onClick={handleExit}
              aria-label="Close modal"
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake font-medium"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-8">
            {isEditing ? (
              <>
                {/* Edit Mode */}
                <div className="mb-8 flex flex-col gap-3">
                  <label htmlFor="modal-title-input" className="text-sm font-bold text-gray-900">
                    Title
                  </label>
                  <input
                    id="modal-title-input"
                    type="text"
                    className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    autoFocus
                  />
                  <span className="text-xs text-gray-500 text-right">
                    {title.length}/100 characters
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="modal-description-input" className="text-sm font-bold text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="modal-description-input"
                    className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={10}
                  />
                  <span className="text-xs text-gray-500 text-right">
                    {description.length}/500 characters
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Title</h3>
                  <p className="text-xl font-semibold text-gray-800 leading-relaxed">{task.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{task.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 px-8 py-6 flex gap-3 justify-end">
            {isEditing ? (
              <>
                <button
                  className="px-7 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
                  onClick={handleExit}
                >
                  Exit
                </button>
                <button
                  className={`px-7 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    hasChanges
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-7 py-3 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
                <button
                  className="px-7 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        taskTitle={task.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
