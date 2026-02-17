import { useState, useMemo } from "react";
import { ColumnType, Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import "@/styles/Column.css";

interface ColumnProps {
  title: string;
  columnType: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  draggedTask: Task | null;
  onTaskDragStart: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

export const Column = ({
  title,
  columnType,
  tasks,
  onTaskClick,
  draggedTask,
  onTaskDragStart,
  onTaskDelete,
}: ColumnProps) => {
  const { dispatch } = useBoard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [emptyStateHovered, setEmptyStateHovered] = useState(false);
  const [colContentHovered, setColContentHovered] = useState(false);

  const columnTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.column === columnType)
        .sort((a, b) => a.order - b.order),
    [tasks, columnType]
  );

  const isEmpty = columnTasks.length === 0;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    if (!draggedTask) return;

    // If dropping in different column, move task
    if (draggedTask.column !== columnType) {
      dispatch({
        type: "MOVE_TASK",
        payload: { taskId: draggedTask.id, newColumn: columnType },
      });
    } else {
      // If dropping in same column, reorder at position 0
      dispatch({
        type: "REORDER_TASK",
        payload: { taskId: draggedTask.id, newIndex: 0, column: columnType },
      });
    }
  };

  const handleTaskDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTask) return;

    // If dropping in different column
    if (draggedTask.column !== columnType) {
      dispatch({
        type: "MOVE_TASK",
        payload: { taskId: draggedTask.id, newColumn: columnType },
      });
    } else {
      // Reorder within same column
      dispatch({
        type: "REORDER_TASK",
        payload: { taskId: draggedTask.id, newIndex: dropIndex, column: columnType },
      });
    }
  };

  return (
    <>
      <div
        className="column"
        role="region"
        aria-label={`${title} column with ${columnTasks.length} tasks`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="column-header">
          <h2 className="column-title">
            {title}
            <span className="column-count" aria-label={`${columnTasks.length} tasks`}>
              {columnTasks.length}
            </span>
          </h2>
        </div>

        <div
          className="column-content"
          onMouseEnter={() => setColContentHovered(true)}
          onMouseLeave={() => {
            setColContentHovered(false);
            setHoveredIndex(null);
          }}
        >
          {isEmpty ? (
            <div
              className="column-empty-state"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onMouseEnter={() => setEmptyStateHovered(true)}
              onMouseLeave={() => setEmptyStateHovered(false)}
            >
              {!emptyStateHovered && (
                <p className="column-empty-text">No tasks in this column</p>
              )}
              {emptyStateHovered && (
                <div className="empty-state-create-row">
                  <button
                    className="empty-state-create-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label={`Create new task in ${title}`}
                    title="Create task"
                  >
                    <span className="create-icon">+</span>
                    <span className="create-label">Create</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="task-list" role="list">
              {columnTasks.map((task, index) => (
                <div
                  key={task.id}
                  role="listitem"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="task-item-wrapper"
                >
                  <TaskCard
                    task={task}
                    onTaskClick={onTaskClick}
                    onDragStart={() => onTaskDragStart(task)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleTaskDrop(e, index)}
                    onTaskDelete={onTaskDelete}
                  />
                </div>
              ))}
              {(hoveredIndex !== null || colContentHovered) && (
                <div className="task-create-below-row">
                  <button
                    className="task-create-below-btn"
                    onClick={() => setIsCreateModalOpen(true)}
                    aria-label={`Create new task in ${title}`}
                    title="Create task"
                  >
                    <span className="create-icon">+</span>
                    <span className="create-label">Create</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        columnType={columnType}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};
