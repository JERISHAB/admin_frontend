import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Members from "./pages/Members";
import Careers from "./pages/Careers";
import LoginPage from "./pages/LoginPage";
import EditJob from "./pages/EditJob"; // Import the EditJob component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/members" element={<ProtectedRoute element={<Members />} />} />
        <Route path="/careers" element={<ProtectedRoute element={<Careers />} />} />
        <Route path="/edit-job/:id" element={<ProtectedRoute element={<EditJob />} />} /> {/* Add the edit job route */}
      </Routes>
    </Router>
  );
}

export default App;