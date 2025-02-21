import React from "react";

const ConfirmationModal = ({ isOpen, type, name, from, to, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case "role":
        return "Changing roles";
      case "status":
        return "Changing status";
      case "delete":
        return "Deleting job";
      case "remove":
        return "Removing member";
      default:
        return "Confirmation";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "role":
        return `Are you sure you want to change the role of ${name}?`;
      case "status":
        return `Are you sure you want to change the status of ${name}?`;
      case "delete":
        return `Are you sure you want to delete the job ${name}?`;
      case "remove":
        return `Are you sure you want to remove the member ${name}?`;
      default:
        return `Are you sure you want to proceed?`;
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-blue-700 font-semibold mb-2">{getTitle()}</h2>
        <p className="text-gray-700 mb-4">{getMessage()}</p>
        {type === "role" || type === "status" ? (
          <div className="flex items-center justify-center text-gray-600 font-medium mb-4">
            <span className="capitalize">{from}</span> ➝ <span className="capitalize">{to}</span>
          </div>
        ) : null}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;