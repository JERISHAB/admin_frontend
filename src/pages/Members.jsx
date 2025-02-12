import { useEffect, useState } from "react";
import { getMembers, updateMemberRole, removeMember } from "../api/api";
import { FaUser } from "react-icons/fa";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Assume the logged-in user is an admin for demonstration
  const [dropdownVisible, setDropdownVisible] = useState(null); // Track which dropdown is visible

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

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">View and manage Members</h2>
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <ul className="mt-4">
          {members.map((member) => (
            <li key={member.id} className="flex items-center bg-gray-100 p-4 mb-2 rounded shadow-md">
              <FaUser className="text-gray-600 mr-4" />
              <div className="flex-1 flex items-center">
                <span className="block text-gray-800 mr-4">{member.email}</span>
                <span className={`inline-block px-2 py-1 rounded mr-4 ${
                  member.role === "admin" ? "bg-red-500 text-white" :
                  member.role === "editor" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {member.role}
                </span>
                {isAdmin && (
                  <div className="relative mr-4">
                    <button
                      onClick={() => toggleDropdown(member.id)}
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      Change Role
                    </button>
                    {dropdownVisible === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                        <button
                          onClick={() => handleRoleChange(member.id, "viewer")}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                          Viewer
                        </button>
                        <button
                          onClick={() => handleRoleChange(member.id, "editor")}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                          Editor
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Members;