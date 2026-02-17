import { useState, useEffect } from "react";
import { ColumnType, BoardAction } from "@/types";
import { useBoard } from "@/context/BoardContext";

interface CreateTaskModalProps {
  isOpen: boolean;
  columnType: ColumnType;
  onClose: () => void;
}

export const CreateTaskModal = ({
  isOpen,
  columnType,
  onClose,
}: CreateTaskModalProps) => {
  const { dispatch } = useBoard();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (): void => {
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
      type: "ADD_TASK",
      payload: {
        title: title.trim(),
        description: description.trim(),
        column: columnType as ColumnType,
      },
    } as BoardAction);

    setTitle("");
    setDescription("");
    onClose();
  };

  const columnName =
    columnType === "todo"
      ? "To Do"
      : columnType === "inProgress"
        ? "In Progress"
        : "Done";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose} role="presentation">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-11/12 max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title"
      >
        <div className="sticky top-0 z-50 bg-white px-6 pt-6 pb-4 border-b border-gray-300 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 id="create-modal-title" className="text-lg font-semibold text-gray-900">
              Create New Task
            </h2>
            <p className="text-xs text-gray-500 font-medium">in {columnName}</p>
          </div>
          <button
            className="flex-shrink-0 bg-transparent text-gray-400 border-none text-2xl leading-none w-8 h-8 flex items-center justify-center cursor-pointer rounded hover:bg-gray-100 hover:text-gray-800 transition-all"
            onClick={onClose}
            aria-label="Close modal"
            title="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="mx-4 mt-4 bg-red-50 border border-red-300 text-red-800 px-3.5 py-3 rounded text-sm animate-shake" role="alert">
              {error}
            </div>
          )}

          <div className="p-6">
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="create-title-input" className="text-sm font-medium text-gray-800">
              Title <span className="text-gray-400 font-normal">*</span>
            </label>
            <input
              id="create-title-input"
              type="text"
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <span className="text-xs text-gray-500 text-right">
              {title.length}/{100}
            </span>
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="create-description-input" className="text-sm font-medium text-gray-800">
              Description <span className="text-gray-400 font-normal">*</span>
            </label>
            <textarea
              id="create-description-input"
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-colors"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={5}
              required
            />
            <span className="text-xs text-gray-500 text-right">
              {description.length}/{500}
            </span>
          </div>
        </div>
        </div>

        <div className="sticky bottom-0 z-50 bg-white flex gap-3 px-6 py-4 border-t border-gray-300 justify-end">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white border border-gray-800 rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};
