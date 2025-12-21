import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Results = lazy(() => import('./pages/Results'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));

export default function App() {
  return (
    <div className="centered-container">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}