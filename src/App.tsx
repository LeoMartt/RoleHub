import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProfileLayout from './components/ProfileLayout';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
              <Route element={<ProfileLayout />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      </Route>

      <Route path="*" element={<div className="container py-5">404</div>} />
    </Routes>
  );
}
