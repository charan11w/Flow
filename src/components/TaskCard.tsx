import { useState } from "react";
import { Task } from "@/types";

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
      className={`bg-white rounded p-4 shadow-sm transition-all cursor-grab select-none flex flex-col gap-2 h-fit ${
        isDragging ? "opacity-100 cursor-grabbing bg-white shadow-lg rotate-1" : "hover:shadow-md hover:bg-gray-50"
      }`}
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
      <div className="flex items-start justify-between gap-2 min-h-8">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{task.title}</h3>
        <div className="flex gap-1 items-center flex-shrink-0 w-16 justify-end">
          {isHovered && (
            <>
              <button
                className="bg-none border-none p-0 cursor-pointer text-lg opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
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
                className="bg-none border-none p-0 cursor-pointer text-lg opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={handleDelete}
                aria-label="Delete task"
                title="Delete"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{task.description}</p>
    </div>
  );
};
