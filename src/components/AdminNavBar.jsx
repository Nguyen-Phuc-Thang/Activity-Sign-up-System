import { User } from 'lucide-react';
import '../styles/components/AdminNavBar.css';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';

export default function AdminNavBar() {
    const navigate = useNavigate();
    return (
        <nav className="admin-navbar" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
            <button className="navbar-btn icon-btn" onClick={() => navigate('/profile')}>
                <User size={24} />
            </button>
            <button className="navbar-btn" onClick={() => navigate('/admin/activity')}>Activity</button>
            <button className="navbar-btn" onClick={() => navigate('/admin/account/add')}>Accounts</button>
        </nav>
    );
}