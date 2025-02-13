import { useState } from "react";

const JobForm = ({ onSubmit, onClose }) => {
  const [newJob, setNewJob] = useState({
    title: "",
    category: "",
    experience_required: "",
    location: "",
    timing: "",
    about: "",
    responsibilities: [""],
    status: "private", 
  });
  
  const [categories, setCategories] = useState(["Design", "Development", "Marketing"]);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setNewJob({ ...newJob, category: e.target.value });
  };

  const addNewCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewJob({ ...newJob, category: newCategory.trim() });
      setNewCategory("");
      setAddingCategory(false);
    }
  };

  const handleSubmit = (status) => {
    onSubmit({ ...newJob, status });
    setNewJob({
      title: "",
      category: "",
      experience_required: "",
      location: "",
      timing: "",
      about: "",
      responsibilities: [""],
      status: "private",
    });
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
        <h2 className="text-2xl font-bold mb-4">Add Job Opening</h2>
        
        <div className="mb-4 flex gap-4">
          <div className="w-1/3">
            <label className="block text-gray-700">Category</label>
            <select value={newJob.category} onChange={handleCategoryChange} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            {addingCategory ? (
              <div className="mt-2 flex gap-2">
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} 
                  className="border px-2 py-1 rounded-lg w-full" placeholder="New category" />
                <button onClick={addNewCategory} className="px-3 py-1 bg-blue-500 text-white rounded-lg">Add</button>
              </div>
            ) : (
              <button onClick={() => setAddingCategory(true)} className="text-blue-500 mt-2">+ Add New Category</button>
            )}
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700">Location</label>
            <input type="text" name="location" value={newJob.location} onChange={handleInputChange} 
              className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          
          <div className="w-1/3">
            <label className="block text-gray-700">Timing</label>
            <input type="text" name="timing" value={newJob.timing} onChange={handleInputChange} 
              className="w-full px-4 py-2 border rounded-lg" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Job Title</label>
          <input type="text" name="title" value={newJob.title} onChange={handleInputChange} 
            className="w-full px-4 py-2 border rounded-lg" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Experience</label>
          <input type="number" name="experience_required" value={newJob.experience_required} onChange={handleInputChange} 
            className="w-full px-4 py-2 border rounded-lg" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">About</label>
          <textarea name="about" value={newJob.about} onChange={handleInputChange} 
            className="w-full px-4 py-2 border rounded-lg" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Responsibilities</label>
          {newJob.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" value={resp} onChange={(e) => {
                const updatedResponsibilities = [...newJob.responsibilities];
                updatedResponsibilities[index] = e.target.value;
                setNewJob({ ...newJob, responsibilities: updatedResponsibilities });
              }} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
          ))}
          <button onClick={() => setNewJob({ ...newJob, responsibilities: [...newJob.responsibilities, ""] })} 
            className="text-blue-500">+ Add</button>
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <div>
            <button onClick={() => handleSubmit("private")} className="border px-4 py-2 rounded mr-2">Save as Private</button>
            <button onClick={() => handleSubmit("public")} className="bg-blue-600 text-white px-4 py-2 rounded">Save & Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
