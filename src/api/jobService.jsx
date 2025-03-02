import apiClient from "./apiClient";
import { getAccessToken } from "./authService";

const JobService = {
  getJobs: async () => {
    const response = await apiClient.get("/jobs/", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    return response.data;
  },

  addJob: async (jobData) => {
    return await apiClient.post("/jobs/", jobData, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },

  updateJobStatus: async (id, status) => {
    return await apiClient.put(`/jobs/${id}/status/${status}/`, null, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },

  deleteJob: async (id) => {
    return await apiClient.delete(`/jobs/${id}/delete/`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
  },
};

export default JobService;
