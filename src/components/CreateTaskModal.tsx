import { useState, useEffect } from "react";
import { ColumnType, BoardAction } from "@/types";
import { useBoard } from "@/context/BoardContext";
import "@/styles/TaskModal.css";

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
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          title="Close"
        >
          ×
        </button>

        <div className="modal-header">
          <h2 id="create-modal-title" className="modal-title">
            Create New Task
          </h2>
          <span className="modal-meta">in {columnName}</span>
        </div>

        {error && (
          <div className="modal-error" role="alert">
            {error}
          </div>
        )}

        <div className="modal-body">
          <div className="modal-form-group">
            <label htmlFor="create-title-input" className="modal-label">
              Title <span className="required-indicator">*</span>
            </label>
            <input
              id="create-title-input"
              type="text"
              className="modal-input"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <span className="modal-char-count">
              {title.length}/{100}
            </span>
          </div>

          <div className="modal-form-group">
            <label htmlFor="create-description-input" className="modal-label">
              Description <span className="required-indicator">*</span>
            </label>
            <textarea
              id="create-description-input"
              className="modal-textarea"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={6}
              required
            />
            <span className="modal-char-count">
              {description.length}/{500}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-primary"
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
