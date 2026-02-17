import { useState, useMemo } from "react";
import { ColumnType, Task } from "@/types";
import { useBoard } from "@/context/BoardContext";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";

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
  const [columnHovered, setColumnHovered] = useState(false);

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
         className="flex flex-col bg-gray-100 rounded-lg shadow-sm overflow-hidden min-h-[120vh] transition-all hover:shadow-md"
         role="region"
         aria-label={`${title} column with ${columnTasks.length} tasks`}
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
         onMouseEnter={() => setColumnHovered(true)}
         onMouseLeave={() => setColumnHovered(false)}
       >
        <div className="flex items-center justify-between px-5 py-5 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
            <span className="ml-2 text-blue-600 font-medium text-sm" aria-label={`${columnTasks.length} tasks`}>
              {columnTasks.length}
            </span>
          </h2>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 pb-20 flex flex-col gap-4"
        >
          {isEmpty ? (
            <div
              className="flex-1 flex flex-col gap-4 min-h-48"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onMouseEnter={() => setColumnHovered(true)}
              onMouseLeave={() => setColumnHovered(false)}
            >
              {columnType === "todo" && (
                <div
                  className="w-full px-4 py-3 transition-colors cursor-pointer flex items-center gap-2 bg-transparent hover:bg-gray-200"
                  onClick={() => setIsCreateModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsCreateModalOpen(true);
                    }
                  }}
                  aria-label={`Create new task in ${title}`}
                >
                  <span className="text-lg font-bold text-gray-800">+</span>
                  <span className="text-sm font-medium text-gray-800">Create</span>
                </div>
              )}
              {columnType !== "todo" && (
                <div
                  className={`w-full px-4 py-3 transition-all cursor-pointer flex items-center gap-2 bg-transparent hover:bg-gray-300 ${
                    columnHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsCreateModalOpen(true)}
                  role="button"
                  tabIndex={columnHovered ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsCreateModalOpen(true);
                    }
                  }}
                  aria-label={`Create new task in ${title}`}
                >
                  <span className="text-lg font-bold text-gray-800">+</span>
                  <span className="text-sm font-medium text-gray-800">Create</span>
                </div>
              )}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 font-normal text-center w-full">No tasks in this column</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4" role="list">
              {columnTasks.map((task, index) => (
                <div
                  key={task.id}
                  role="listitem"
                  className="relative"
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
              {columnType === "todo" && (
                <div
                  className="w-full px-4 py-3 transition-colors cursor-pointer flex items-center gap-2 bg-transparent hover:bg-gray-200"
                  onClick={() => setIsCreateModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsCreateModalOpen(true);
                    }
                  }}
                  aria-label={`Create new task in ${title}`}
                >
                  <span className="text-lg font-bold text-gray-800">+</span>
                  <span className="text-sm font-medium text-gray-800">Create</span>
                </div>
              )}
              {columnType !== "todo" && (
                <div
                  className={`w-full px-4 py-3 transition-all cursor-pointer flex items-center gap-2 bg-transparent hover:bg-gray-300 ${
                    columnHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsCreateModalOpen(true)}
                  role="button"
                  tabIndex={columnHovered ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsCreateModalOpen(true);
                    }
                  }}
                  aria-label={`Create new task in ${title}`}
                >
                  <span className="text-lg font-bold text-gray-800">+</span>
                  <span className="text-sm font-medium text-gray-800">Create</span>
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
