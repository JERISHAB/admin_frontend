import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../api/api";

// Create an axios instance with interceptors
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// Axios request interceptor → Automatically adds Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/")
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setJobs(response.data.data);
        } else {
          console.error("Unexpected response format:", response);
          setJobs([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
        setJobs([]);
      });
  }, []);

  const updateJobStatus = (id, newStatus) => {
    api.patch(`/jobs/${id}`, { status: newStatus })
      .then(() => setJobs(jobs.map(job => 
        job.id === id ? { ...job, status: newStatus } : job)))
      .catch(error => console.error("Error updating job status:", error));
  };

  const deleteJob = (id) => {
    api.delete(`/jobs/${id}`)
      .then(() => setJobs(jobs.filter(job => job.id !== id)))
      .catch(error => console.error("Error deleting job:", error));
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">View and manage Careers</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="p-4 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.category}</p>
              <p className="text-gray-600">Experience Required: {job.experience_required} years</p>
              <p className={`mt-2 px-2 py-1 rounded text-white ${
                job.status === "active" ? "bg-green-500" :
                job.status === "closed" ? "bg-red-500" : "bg-gray-500"
              }`}>
                {job.status}
              </p>

              <div className="mt-4 flex gap-2">
                <button 
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => updateJobStatus(job.id, "active")}
                >Activate</button>
                <button 
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                  onClick={() => updateJobStatus(job.id, "private")}
                >Make Private</button>
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => console.log("Edit job", job.id)}
                >Edit</button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteJob(job.id)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Careers;