import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Screens imports
import Login from './pages/Login.jsx';
import AdminActivity from './pages/AdminActivity.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/activity" element={<AdminActivity />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;