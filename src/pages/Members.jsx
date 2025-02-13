import { useEffect, useState } from "react";
import { getMembers, updateMemberRole, removeMember, addMember } from "../api/api";
import { FaUser } from "react-icons/fa";
import MemberForm from "../components/MemberForm";
import ConfirmationModal from "../components/ConfirmationModal";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Assume the logged-in user is an admin for demonstration
  const [dropdownVisible, setDropdownVisible] = useState(null); // Track which dropdown is visible
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: "", name: "", from: "", to: "", action: null, memberId: null });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getMembers();
      if (response && Array.isArray(response.data)) {
        setMembers(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setMembers([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateMemberRole(id, newRole);
      fetchMembers();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await removeMember(id);
      fetchMembers();
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleAddMember = async (newMember) => {
    try {
      await addMember(newMember);
      fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleConfirm = () => {
    if (confirmationModal.action === "delete") {
      handleRemoveMember(confirmationModal.memberId);
    } else {
      handleRoleChange(confirmationModal.memberId, confirmationModal.action);
    }
    setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, memberId: null });
  };

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View and Manage Members</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>Add Member</button>
        </div>
        {loading ? (
          <p>Loading members...</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border"
              >
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-600" />
                  <div>
                    <span className="text-gray-800 font-medium block">{member.name}</span>
                    <span className="text-gray-500 text-sm block">{member.username}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-sm rounded border ${
                      member.role === "admin"
                        ? "text-blue-600 border-blue-500"
                        : member.role === "editor"
                        ? "text-purple-600 border-purple-500"
                        : "text-gray-600 border-gray-500"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 relative">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => toggleDropdown(member.id)}
                        className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100"
                      >
                        Change Role
                      </button>
                      {dropdownVisible === member.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                          {["admin", "editor", "viewer"].map((role) => (
                            <button
                              key={role}
                              onClick={() => setConfirmationModal({ isOpen: true, type: "role", name: member.name, from: member.role, to: role, action: role, memberId: member.id })}
                              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setConfirmationModal({ isOpen: true, type: "delete", name: member.name, from: "", to: "", action: "delete", memberId: member.id })}
                    className="text-red-500 border px-3 py-1 rounded hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Adding New Member */}
      {isModalOpen && (
        <MemberForm onSubmit={handleAddMember} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        type={confirmationModal.type}
        name={confirmationModal.name}
        from={confirmationModal.from}
        to={confirmationModal.to}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, memberId: null })}
      />
    </>
  );
};

export default Members;