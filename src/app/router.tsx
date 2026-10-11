import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingLayout } from '../components/layout/LandingLayout';
import { LandingPage } from '../pages/LandingPage';
import { FriendPage } from '../pages/FriendPage';
import { TrackerPage } from '../pages/TrackerPage';
import { RunningPage } from '../pages/RunningPage';
import { CalendarPage } from '../pages/CalendarPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: 'friend',
        element: <FriendPage />,
      },
      {
        path: 'tracker',
        element: <TrackerPage />,
      },
      {
        path: 'running',
        element: <RunningPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
