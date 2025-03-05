import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../api/jobService"; // Import JobService
import JobForm from "../components/JobForm";
import ConfirmationModal from "../components/ConfirmationModal";
import UserService from "../api/userService";
import { Lock } from "lucide-react"; // Keep Lucide's lock icon
import { FaLock } from "react-icons/fa"; // Import FontAwesome Lock icon

const Careers = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: "",
    name: "",
    from: "",
    to: "",
    action: null,
    jobId: null,
  });
  const navigate = useNavigate();

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await JobService.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const response = await UserService.getCurrentUser();
      setCurrentUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }


  useEffect(() => {
    fetchJobs();
    fetchUser();
  }, []);

  // Update Job Status
  const handleUpdateJobStatus = async (id, newStatus) => {
    try {
      await JobService.updateJobStatus(id, newStatus);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  // Delete Job
  const handleDeleteJob = async (id) => {
    try {
      await JobService.deleteJob(id);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Add Job
  const handleSubmit = async (newJob) => {
    try {
      await JobService.addJob(newJob);
      setIsModalOpen(false);
      fetchJobs(); // Refresh job list
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  // Handle Confirmation
  const handleConfirm = () => {
    if (confirmationModal.action === "delete") {
      handleDeleteJob(confirmationModal.jobId);
    } else {
      handleUpdateJobStatus(confirmationModal.jobId, confirmationModal.action);
    }
    setConfirmationModal({
      isOpen: false,
      type: "",
      name: "",
      from: "",
      to: "",
      action: null,
      jobId: null,
    });
  };

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">View and Manage Careers</h2>

        {/* Add New Job Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow disabled:opacity-50"
          onClick={() => currentUser?.role !== "viewer" && setIsModalOpen(true)}
          disabled={currentUser?.role === "viewer"}
        >
          {currentUser?.role === "viewer" && <Lock size={16} className="text-gray-300" />}
          Add New Job
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="relative inline-block text-left mb-4">
        <button
          onClick={() =>
            setDropdownOpen(dropdownOpen === "filter" ? null : "filter")
          }
          className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
          <span
            className="transform transition-transform"
            style={{
              transform:
                dropdownOpen === "filter" ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>
        {dropdownOpen === "filter" && (
          <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
            {["all", "private", "active", "closed"].map((status) => (
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
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white shadow-lg rounded-lg border w-full"
            >
              {/* Top Row: Category, Status & Buttons */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-200 text-blue-600 rounded-lg font-semibold">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 border border-gray-400 text-gray-700 bg-white rounded-lg">
                    {job.status}
                  </span>
                </div>
                {/* Job Actions */}
                <div className="flex gap-2">
                   {/* Change Status Button */}
                  <div className="relative">
                    <button
                      className={`flex items-center gap-2 px-3 py-1 border rounded shadow ${currentUser?.role === "viewer" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => currentUser?.role !== "viewer" && setDropdownOpen(dropdownOpen === job.id ? null : job.id)}
                      disabled={currentUser?.role === "viewer"}
                    >
                      {currentUser?.role === "viewer" && <Lock size={16} className="text-gray-400" />}
                      Change Status
                    </button>
                    {dropdownOpen === job.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        {["active", "private", "closed"].map((status) => (
                          <div
                            key={status}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              setConfirmationModal({
                                isOpen: true,
                                type: "status",
                                name: job.title,
                                from: job.status,
                                to: status,
                                action: status,
                                jobId: job.id,
                              })
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Edit Button */}
                  <button
                   className={`flex items-center gap-2 px-3 py-1 border rounded shadow ${currentUser?.role === "viewer" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => currentUser?.role !== "viewer" && navigate(`/edit-job/${job.id}`)}
                  disabled={currentUser?.role === "viewer"}
                  >
                    {currentUser?.role === "viewer" && <Lock size={16} className="text-gray-400" />}
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className={`flex items-center gap-2 px-3 py-1 border rounded shadow ${currentUser?.role === "viewer" ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() =>
                      currentUser?.role !== "viewer" &&
                      setConfirmationModal({
                        isOpen: true,
                        type: "delete",
                        name: job.title,
                        from: "",
                        to: "",
                        action: "delete",
                        jobId: job.id,
                      })
                    }
                    disabled={currentUser?.role === "viewer"}
                  >
                    {currentUser?.role === "viewer" && <Lock size={16} className="text-gray-400" />}
                    Delete
                  </button>
                </div>
              </div>

              {/* Job Details */}
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-500 mt-1">
                Experience Required: {job.experience_required} years
              </p>

              {/* Make Public / Make Private Button */}
              <p
              className={`text-blue-500 mt-2 cursor-pointer flex items-center gap-2 ${
                currentUser?.role === "viewer" ? "opacity-50 cursor-not-allowed" : ""
              }`}              
              onClick={() =>{
                if (currentUser?.role !== "viewer") {
                  setConfirmationModal({
                    isOpen: true,
                    type: "status",
                    name: job.title,
                    from: job.status,
                    to: job.status === "private" ? "active" : "private",
                    action: job.status === "private" ? "active" : "private",
                    jobId: job.id,
                  });
                }
              }}
              >
                 {currentUser?.role === "viewer" && <FaLock className="text-gray-400" />} {/* Lock icon */}
                 {job.status === "active" || job.status === "closed" ? "Make Private" : "Make Public"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && <JobForm onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} />}
      <ConfirmationModal {...confirmationModal} onConfirm={handleConfirm} onCancel={() => setConfirmationModal({ isOpen: false })} />
    </>
  );
};

export default Careers;
