import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout/Layout';
import { BlogDataProvider } from './context/BlogDataContext';
import { FiltersProvider } from './context/FiltersContext';
import { Home } from './pages/Home/Home';
import { PostDetail } from './pages/PostDetail/PostDetail';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/posts/:id', element: <PostDetail /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
]);

export default function App() {
  return (
    <BlogDataProvider>
      <FiltersProvider>
        <RouterProvider router={router} />
      </FiltersProvider>
    </BlogDataProvider>
  )
}
