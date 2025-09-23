import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";

export default function App() {
  return (
    <div className="centered-container">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}        
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}