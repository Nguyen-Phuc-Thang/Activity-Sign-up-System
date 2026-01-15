import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Calendar from './components/Calendar.jsx';

// Screens imports
import Login from './pages/Login.jsx';
import AdminActivity from './pages/AdminActivity.jsx';
import Profile from './pages/Profile.jsx';
import Caregiver from './pages/Caregiver.jsx';
import CareRecipient from './pages/CareRecipient.jsx';

function App() {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/care-recipient" element={<CareRecipient />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/" element={<Login />} />
          <Route path="/admin/activity" element={<AdminActivity />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;