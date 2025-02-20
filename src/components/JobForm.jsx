import { useState, useEffect } from "react";
import axios from "axios";

const JobForm = ({ onSubmit, onClose, existingJob }) => {
  console.log("JobForm rendered with existingJob:", existingJob);

  // Initial state setup
  const [job, setJob] = useState(
    existingJob && existingJob.id
      ? existingJob
      : {
          title: "",
          category: "",
          experience_required: 0,
          last_date: "",
          status: "private",
          location: "",
          timing: "",
          about: "",
          responsibilities: [""],
        }
  );

  console.log("Initial job state:", job);

  const [categories, setCategories] = useState(["Design", "Development", "Marketing"]);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingJob && existingJob.id) {
      console.log("Updating job state with existingJob:", existingJob);
      setJob(existingJob);
    }
  }, [existingJob]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
    console.log(`Updated job field - ${name}:`, value);
  };
  

  // Handle category selection
  const handleCategoryChange = (e) => {
    setJob((prevJob) => ({ ...prevJob, category: e.target.value }));
    // console.log("Updated job category:", e.target.value);
  };

  // Add a new category
  const addNewCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setJob((prevJob) => ({ ...prevJob, category: newCategory.trim() }));
      // console.log("Added new category:", newCategory.trim());
      setNewCategory("");
      setAddingCategory(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (status) => {
    console.log("Submitting job with status:", status, "Job data:", job);

    if (!job.title || !job.category || !job.location || !job.last_date) {
        setError("All required fields must be filled.");
        console.log("Form validation failed: Missing required fields.");
        return;
    }

    // try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("Authentication required. Please log in.");
            console.log("Authentication error: No access token found.");
            return;
        }

        // Format data properly
        const jobData = {
            title: job.title,
            category: job.category,
            experience_required: job.experience_required,
            last_date: job.last_date, 
            status: status,
            location: job.location,
            timing: job.timing,
            about: job.about,
            responsibilities: job.responsibilities.filter(r => r.trim() !== ""),
        };

        console.log("Final job data before sending:", jobData);

        const url = existingJob
            ? `http://127.0.0.1:8000/api/v1/jobs/${existingJob.data.id}/edit/`
            : "http://127.0.0.1:8000/api/v1/jobs/";

        console.log("Sending request to:", url, "Method:", existingJob ? "PUT" : "POST");

        const response = await axios({
            method: existingJob ? "PUT" : "POST",
            url,
            data: jobData,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Job saved successfully:", response.data);
        onSubmit(jobData);
        onClose();
    // } catch (error) {
    //     console.error("Error submitting job:", error.response?.data || error);
    //     setError("Failed to save job. Please try again.");
    //}
};


  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
        <h2 className="text-2xl font-bold mb-4">{existingJob ? "Edit Job" : "Add Job"}</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4 flex gap-4">
          <div className="w-1/3">
            <label className="block text-gray-700">Category *</label>
            <select
              value={job.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {addingCategory ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border px-2 py-1 rounded-lg w-full"
                  placeholder="New category"
                />
                <button onClick={addNewCategory} className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                  Add
                </button>
              </div>
            ) : (
              <button onClick={() => setAddingCategory(true)} className="text-blue-500 mt-2">
                + Add New Category
              </button>
            )}
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700">Location *</label>
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700">Timing</label>
            <input
              type="text"
              name="timing"
              value={job.timing}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Job Title *</label>
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Experience Required</label>
          <input
            type="number"
            name="experience_required"
            value={job.experience_required}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Last Date *</label>
          <input
            type="date"
            name="last_date"
            value={job.last_date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">About</label>
          <textarea
            name="about"
            value={job.about}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Responsibilities</label>
          {job.responsibilities?.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => {
                  const updatedResponsibilities = [...job.responsibilities];
                  updatedResponsibilities[index] = e.target.value;
                  setJob({ ...job, responsibilities: updatedResponsibilities });
                }}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <button
            onClick={() => setJob({ ...job, responsibilities: [...(job.responsibilities || []), ""] })}
            className="text-blue-500"
          >
            + Add Responsibility
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <div>
            <button onClick={() => handleSubmit("private")} className="border px-4 py-2 rounded mr-2">
              Save as Private
            </button>
            <button onClick={() => handleSubmit("active")} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
