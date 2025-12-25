import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router";
import { SpeedInsights } from '@vercel/speed-insights/react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Results = lazy(() => import('./pages/Results'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));

const OptimizationHub = lazy(() => import('./pages/OptimizationHub'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/results" element={<Results />} />
      <Route path="/optimizer" element={<OptimizationHub />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Dashboard />} />
    </Route>
  )
);

export default function App() {
  return (
    <div className="centered-container">
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <SpeedInsights />
    </div>
  );
}