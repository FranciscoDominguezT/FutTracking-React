import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Register from '../Pages/Register';
import Profile from '../Pages/Profile';
import PlayerProfile from '../Pages/PlayerProfile';
import FilterScreen from '../Pages/Home/Components/FilterScreen';
import SearchResultsPage from '../Pages/Home/Components/SearchResultsPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/filter" element={<FilterScreen />} />
      <Route path="/playerProfile/:usuario_id" element={<PlayerProfile />} />
      <Route path="/search" element={<SearchResultsPage />} />
    </Routes>
  );
};

export default AppRouter;