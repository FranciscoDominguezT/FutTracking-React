import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Register from '../Pages/Register';
import Profile from '../Pages/Profile';
import Animation from '../Pages/Login/Components/Animation/Animation';
import './AppRouter.css';

const AppRouter = () => {
  return (
    <>
      <Animation /> {/* Añadir la animación */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default AppRouter;
