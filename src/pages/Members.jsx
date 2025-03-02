import { useEffect, useState } from "react";
import memberService from "../api/memberService";
import { FaUser } from "react-icons/fa";
import MemberForm from "../components/MemberForm";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "",
    name: "",
    from: "",
    to: "",
    action: null,
    memberId: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await memberService.getMembers();
      const membersData = response.data; // Ensure the data exists
      setMembers(Array.isArray(membersData) ? membersData : []); // Always set an array
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]); // Ensure state is always an array
    }
    setLoading(false);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await memberService.updateMemberRole(id, newRole);
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await memberService.removeMember(id);
      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleAddMember = async (newMember) => {
    try {
      await memberService.addMember(newMember);
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleConfirm = () => {
    confirmationModal.action === "delete"
      ? handleRemoveMember(confirmationModal.memberId)
      : handleRoleChange(confirmationModal.memberId, confirmationModal.action);

    setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, memberId: null });
  };

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    //error chech members
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">View and Manage Members</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setIsModalOpen(true)}>
          Add Member
        </button>
      </div>
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center bg-white p-4 rounded-lg shadow-md border gap-4">
              <FaUser className="text-gray-600" />
              <div className="flex items-center gap-4">
                <span className="text-gray-800 font-medium">{member.username}</span>
                <span className={`px-2 py-1 text-sm rounded border ${
                    member.role === "admin"
                      ? "text-blue-600 border-blue-500"
                      : member.role === "editor"
                      ? "text-purple-600 border-purple-500"
                      : "text-gray-600 border-gray-500"
                  }`}>
                  {member.role}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => toggleDropdown(member.id)} className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100">
                    Change Role
                  </button>
                  {dropdownVisible === member.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                      {["admin", "editor", "viewer"].map((role) => (
                        <button
                          key={role}
                          onClick={() =>
                            setConfirmationModal({
                              isOpen: true,
                              type: "role",
                              name: member.username,
                              from: member.role,
                              to: role,
                              action: role,
                              memberId: member.id,
                            })
                          }
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: true,
                      type: "delete",
                      name: member.username,
                      from: "",
                      to: "",
                      action: "delete",
                      memberId: member.id,
                    })
                  }
                  className="text-red-500 border px-3 py-1 rounded hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && <MemberForm onSubmit={handleAddMember} onClose={() => setIsModalOpen(false)} />}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        type={confirmationModal.type}
        name={confirmationModal.name}
        from={confirmationModal.from}
        to={confirmationModal.to}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, memberId: null })}
      />
    </div>
  );
};

export default Members;
