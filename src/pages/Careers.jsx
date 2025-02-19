import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../api/api";
import JobForm from "../components/JobForm";
import ConfirmationModal from "../components/ConfirmationModal";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

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
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: "", name: "", from: "", to: "", action: null, jobId: null });

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
    api.put(`/jobs/${id}/status/${newStatus}/`)
      .then(() => setJobs(jobs.map(job => 
        job.id === id ? { ...job, status: newStatus } : job)))
      .catch(error => console.error("Error updating job status:", error));
  };

  const deleteJob = (id) => {
    api.delete(`/jobs/${id}`)
      .then(() => setJobs(jobs.filter(job => job.id !== id)))
      .catch(error => console.error("Error deleting job:", error));
  };

  const handleSubmit = (newJob) => {
    api.post("/jobs/", newJob)
      .then(response => {
        setJobs([...jobs, response.data]);
        setIsModalOpen(false);
      })
      .catch(error => console.error("Error creating job:", error));
  };

  const handleConfirm = () => {
    if (confirmationModal.action === "delete") {
      deleteJob(confirmationModal.jobId);
    } else {
      updateJobStatus(confirmationModal.jobId, confirmationModal.action);
    }
    setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, jobId: null });
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter(job => job.status === filter);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">View and Manage Careers</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow" onClick={() => setIsModalOpen(true)}>Add New Job</button>
      </div>
      
      {/* Minimalistic Filter Dropdown */}
      <div className="relative inline-block text-left mb-4">
        <button 
          onClick={() => setDropdownOpen(dropdownOpen === "filter" ? null : "filter")}
          className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
          <span className="transform transition-transform" style={{ transform: dropdownOpen === "filter" ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {dropdownOpen === "filter" && (
          <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
            {['all', 'private', 'active', 'closed'].map(status => (
              <div 
                key={status} 
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setFilter(status);
                  setDropdownOpen(null);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="p-6 bg-white shadow-lg rounded-lg border w-full">
              
              {/* Top Row: Category, Status on the Left & Buttons on the Right */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-200 text-blue-600 rounded-lg font-semibold">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 border border-gray-400 text-gray-700 bg-white rounded-lg">
                    {job.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <button 
                      className="bg-white text-gray-700 px-3 py-1 rounded shadow border"
                      onClick={() => setDropdownOpen(dropdownOpen === job.id ? null : job.id)}
                    >
                      Change Status
                    </button>
                    {dropdownOpen === job.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        {['active', 'private', 'closed'].map(status => (
                          <div 
                            key={status} 
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => setConfirmationModal({ isOpen: true, type: "status", name: job.title, from: job.status, to: status, action: status, jobId: job.id })}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    className="bg-white text-gray-700 px-3 py-1 rounded shadow border"
                    onClick={() => console.log("Edit job", job.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-white text-gray-700 px-3 py-1 rounded shadow border"
                    onClick={() => setConfirmationModal({ isOpen: true, type: "delete", name: job.title, from: "", to: "", action: "delete", jobId: job.id })}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Job Title */}
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>

              {/* Experience */}
              <p className="text-gray-500 mt-1">Experience Required: {job.experience_required} years</p>

              {/* Make Public Link */}
              <p 
                className="text-blue-500 mt-2 cursor-pointer"
                onClick={() => setConfirmationModal({ isOpen: true, type: "status", name: job.title, from: job.status, to: "public", action: "public", jobId: job.id })}
              >
                Make Public
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding New Job */}
      {isModalOpen && (
        <JobForm onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        type={confirmationModal.type}
        name={confirmationModal.name}
        from={confirmationModal.from}
        to={confirmationModal.to}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmationModal({ isOpen: false, type: "", name: "", from: "", to: "", action: null, jobId: null })}
      />
    </>
  );
};

export default Careers;