interface DeleteConfirmationModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-sm w-11/12 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <div className="px-8 pt-8 pb-6 border-b border-gray-200">
          <h2 id="delete-confirm-title" className="text-2xl font-bold text-gray-900">
            Delete Task?
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">{taskTitle}</p>
        </div>

        <div className="px-8 py-6">
          <p className="text-base text-gray-700">
            This action cannot be undone. The task will be permanently deleted.
          </p>
        </div>

        <div className="flex gap-3 px-8 py-6 border-t border-gray-200 justify-end">
          <button
            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all cursor-pointer"
            onClick={onConfirm}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
