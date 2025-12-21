import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Results = lazy(() => import('./pages/Results'));

export default function App() {
  return (
    <div className="centered-container">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}