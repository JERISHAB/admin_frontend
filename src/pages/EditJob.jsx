import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import JobForm from "../components/JobForm";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Job ID from useParams:", id);  // Debugging step 1
  // console.log("Location state:", location.state); // Debugging step 2 (check if job data is passed via state)

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Error: Job ID is undefined in useParams");
      return;
    }

    // console.log("Fetching job for ID:", id); // Debugging step 3

    const token = localStorage.getItem("refresh_token");
    axios.get(`http://127.0.0.1:8000/api/v1/jobs/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log("API response:", response.data); // Debugging step 4
        setJob(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching job:", error.response ? error.response.data : error.message); // Debugging step 5
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (updatedJob) => {

    if (updatedJob){
      console.log("Updated job data in handle submit:", updatedJob); // Debugging step 6
    }
    else{
      console.log("Error in creating updated job data in handle submit"); // Debugging step 7
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading job...</p>
      ) : (
        <JobForm 
          onSubmit={handleSubmit} 
          onClose={() => navigate("/careers")} 
          existingJob={job} 
        />
      )}
    </div>
  );
};

export default EditJob;
