import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Register from '../Pages/Register';
import Profile from '../Pages/Profile';
import PlayerProfile from '../Pages/PlayerProfile';
import FilterScreen from '../Pages/Home/Components/FilterScreen';
import SearchResultsPage from '../Pages/Home/Components/SearchResultsPage';
import ConfigScreen from '../Pages/Home/Components/ConfigScreen';
import ChangeRol from '../Pages/ChangeRol'
import Jugador from '../Pages/ChangeRol/Components/Jugador';
import Reclutador from '../Pages/ChangeRol/Components/Reclutador';
import MailJugador from '../Pages/ChangeRol/Components/MailJugador';
import MailReclutador from '../Pages/ChangeRol/Components/MailReclutador';
import ForgotPassword from '../Pages/ForgotPassword';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/filter" element={<FilterScreen />} />
      <Route path="/changeRol" element={<ChangeRol />} />
      <Route path="/config" element={<ConfigScreen />} />
      <Route path="/jugador" element={<Jugador />} />
      <Route path="/playerProfile/:usuario_id" element={<PlayerProfile />} />
      <Route path="/reclutador" element={<Reclutador />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/mailJugador" element={<MailJugador />} />
      <Route path="/mailReclutador" element={<MailReclutador />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
    </Routes>
  );
};

export default AppRouter;