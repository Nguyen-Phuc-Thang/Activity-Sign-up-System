import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Screens imports
import Calendar from './pages/Calendar.jsx';
import Login from './pages/Login.jsx';
import AdminActivity from './pages/AdminActivity.jsx';
import AddActivity from './pages/AddActivity.jsx';
import Profile from './pages/Profile.jsx';
import Caregiver from './pages/Caregiver.jsx';
import CareRecipient from './pages/CareRecipient.jsx';
import ModifyActivity from './pages/ModifyActivity.jsx';
import MyRecipients from './pages/MyRecipient.jsx';
import CaregiverRequests from './pages/CaregiverRequests.jsx';

function App() {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/caregiver/requests" element={<CaregiverRequests />} />
          <Route path="/caregiver/my-recipients" element={<MyRecipients />} />
          <Route path="/care-recipient" element={<CareRecipient />} />
          <Route path="/caregiver/calendar" element={<Calendar />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/" element={<Login />} />
          <Route path="/admin/activity" element={<AdminActivity />} />
          <Route path="/admin/activity/add" element={<AddActivity />} />
          <Route path="/admin/activity/modify/:activityId" element={<ModifyActivity />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;