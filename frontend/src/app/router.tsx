import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/AppShell';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
