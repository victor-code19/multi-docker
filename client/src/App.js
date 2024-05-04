import logo from './logo.svg';
import './App.css';
import Fib from './Fib';
import OtherPage from './OtherPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Fib />,
  },
  {
    path: '/otherpage',
    element: <OtherPage />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
