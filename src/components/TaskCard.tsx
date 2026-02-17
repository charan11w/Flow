import { useState } from "react";
import { Task } from "@/types";
import "@/styles/TaskCard.css";

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void;
  onTaskDelete?: (taskId: string) => void;
}

export const TaskCard = ({
  task,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskDelete,
}: TaskCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      onTaskDelete?.(task.id);
    }
  };

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""}`}
      role="article"
      aria-label={`Task: ${task.title}`}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.order)}
      onClick={() => onTaskClick(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        {isHovered && (
          <div className="task-card-actions">
            <button
              className="task-card-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onTaskClick(task);
              }}
              aria-label="Edit task"
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="task-card-delete-btn"
              onClick={handleDelete}
              aria-label="Delete task"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <p className="task-card-description">{task.description}</p>
    </div>
  );
};
