const ConfirmationModal = ({ isOpen, type, name, from, to, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-blue-700 font-semibold mb-2">
          {type === "role" ? "Changing roles" : "Changing status"}
        </h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to change {type === "role" ? "role" : "status"} of  
          <span className="font-bold"> {name}</span>?
        </p>
        <div className="flex items-center justify-center text-gray-600 font-medium mb-4">
          <span className="capitalize">{from}</span> ➝ <span className="capitalize">{to}</span>
        </div>
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