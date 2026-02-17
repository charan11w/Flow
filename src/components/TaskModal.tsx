import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import "@/styles/TaskModal.css";

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
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
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
          <h2 id="modal-title" className="modal-title">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <span className="modal-meta">{formattedDate}</span>
        </div>

        {error && (
          <div className="modal-error" role="alert">
            {error}
          </div>
        )}

        <div className="modal-body">
          {isEditing ? (
            <>
              <div className="modal-form-group">
                <label htmlFor="modal-title-input" className="modal-label">
                  Title
                </label>
                <input
                  id="modal-title-input"
                  type="text"
                  className="modal-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <span className="modal-char-count">
                  {title.length}/{100}
                </span>
              </div>

              <div className="modal-form-group">
                <label htmlFor="modal-description-input" className="modal-label">
                  Description
                </label>
                <textarea
                  id="modal-description-input"
                  className="modal-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={6}
                />
                <span className="modal-char-count">
                  {description.length}/{500}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="modal-field">
                <label className="modal-field-label">Title</label>
                <p className="modal-field-value">{task.title}</p>
              </div>

              <div className="modal-field">
                <label className="modal-field-label">Description</label>
                <p className="modal-field-value">{task.description}</p>
              </div>

              <div className="modal-field">
                <label className="modal-field-label">Column</label>
                <p className="modal-field-value">
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

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="modal-btn modal-btn-danger"
                onClick={handleDelete}
              >
                Delete Task
              </button>
              <button
                className="modal-btn modal-btn-primary"
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
