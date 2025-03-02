import apiClient from "./apiClient";
import { getAccessToken } from "./authService";

const MemberService = {
  getMembers: async () => {
    const response = await apiClient.get("/members/", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    return response.data;
  },

  updateMemberRole: async (id, role) => {
    return await apiClient.put(`/members/${id}/change-role/${role}/`, null, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },

  removeMember: async (id) => {
    return await apiClient.delete(`/members/${id}/delete/`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },

  addMember: async (memberData) => {
    return await apiClient.post("/members/create/", memberData, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },
};

export default MemberService;
