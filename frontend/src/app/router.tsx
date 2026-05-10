import { createBrowserRouter, redirect } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { ProjectSelectPage } from '../pages/ProjectSelectPage';
import RegisterPage from '../pages/RegisterPage';
import type { Project } from '../types/project';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/projects/select',
        element: (
          <ProjectSelectPage
            onSelectProject={(project: Project) => {
              localStorage.setItem('selectedProject', JSON.stringify(project));
            }}
          />
        ),
      },
      {
        path: '/',
        loader: () => {
          const stored = localStorage.getItem('selectedProject');
          if (!stored) {
            return redirect('/projects/select');
          }
          return null;
        },
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
]);