import { User } from 'lucide-react';
import '../styles/components/AdminNavBar.css';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';

export default function CaregiverNavBar() {
    const navigate = useNavigate();
    return (
        <nav className="admin-navbar" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
            <button className="navbar-btn icon-btn" onClick={() => navigate('/profile')}>
                <User size={24} />
            </button>
            <button className="navbar-btn" onClick={() => navigate('/caregiver')}>Activity</button>
            <button className="navbar-btn" onClick={() => navigate('/caregiver/my-recipients')}>My Recipients</button>
            <button className="navbar-btn" onClick={() => navigate('/caregiver/requests')}>Requests</button>
            <button className="navbar-btn" onClick={() => navigate('/caregiver/calendar')}>Calendar</button>
        </nav>
    );
}