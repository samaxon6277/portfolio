import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App, { MainSite } from './App.tsx';
import AdminLayout from './admin/AdminLayout.tsx';
import AdminDashboard from './admin/pages/AdminDashboard.tsx';
import ProjectsManager from './admin/pages/ProjectsManager.tsx';
import ServicesManager from './admin/pages/ServicesManager.tsx';
import MessagesManager from './admin/pages/MessagesManager.tsx';
import SettingsManager from './admin/pages/SettingsManager.tsx';
import ProfileSettings from './admin/pages/ProfileSettings.tsx';
import BlogsManager from './admin/pages/BlogsManager.tsx';
import AnalyticsManager from './admin/pages/AnalyticsManager.tsx';
import MediaManager from './admin/pages/MediaManager.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthProvider } from './lib/AuthContext.tsx';
import { SettingsProvider } from './lib/SettingsContext.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <MainSite />
      },
      {
        path: "projects",
        element: <ProjectsPage />
      },
      {
        path: "projects/:id",
        element: <ProjectDetailsPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />
          },
          {
            path: "projects",
            element: <ProjectsManager />
          },
          {
            path: "services",
            element: <ServicesManager />
          },
          {
            path: "blogs",
            element: <BlogsManager />
          },
          {
            path: "messages",
            element: <MessagesManager />
          },
          {
            path: "analytics",
            element: <AnalyticsManager />
          },
          {
            path: "media",
            element: <MediaManager />
          },
          {
            path: "settings",
            element: <SettingsManager />
          },
          {
            path: "profile",
            element: <ProfileSettings />
          },
          {
            path: "*",
            element: <div className="p-8 text-center text-[#A8AFBD]">This section is coming soon. Select another section from the menu.</div>
          }
        ]
      },
      {
        // Aliases for admin
        path: "admin/*",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "cms/*",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
);


