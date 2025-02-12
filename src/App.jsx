import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Members from "./pages/Members";
import Careers from "./pages/Careers";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/members" element={<ProtectedRoute element={<Members />} />} />
        <Route path="/careers" element={<ProtectedRoute element={<Careers />} />} />
      </Routes>
    </Router>
  );
}

export default App;