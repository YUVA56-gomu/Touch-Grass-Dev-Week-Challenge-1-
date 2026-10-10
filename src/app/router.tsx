import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { TrackerPage } from '../pages/TrackerPage';
import { RunningPage } from '../pages/RunningPage';
import { CalendarPage } from '../pages/CalendarPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
        element: <HomePage />,
      },
    ],
  },
]);
