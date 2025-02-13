import { useState } from "react";

const MemberForm = ({ onSubmit, onClose }) => {
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Editor",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newMember);
    setNewMember({ name: "", email: "", role: "Editor" });
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-blue-600 text-sm mb-4">Adding member</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Choose role</label>
            <select
              name="role"
              value={newMember.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            >
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Enter Email</label>
            <input
              type="email"
              name="email"
              value={newMember.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="mb-3 text-left">
            <label className="block text-gray-600">Enter Name</label>
            <input
              type="text"
              name="name"
              value={newMember.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Send email invite
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
