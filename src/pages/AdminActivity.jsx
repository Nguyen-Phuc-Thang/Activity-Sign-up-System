import { useState, useContext, useEffect } from 'react';
import '../styles/pages/AdminActivity.css';
import AdminNavBar from '../components/AdminNavBar';
import ActivityCard from '../components/ActivityCard';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';
import { getUserMetadata } from '../database/userMetadata';
import { AuthContext } from '../providers/AuthContext';
import { getAllActivities } from '../database/activity';



export default function AdminActivity() {
    const navigate = useNavigate();
    const [userMetadata, setUserMetadata] = useState(null);
    const { user, loading } = useContext(AuthContext);
    const [activities, setActivities] = useState(null);

    useEffect(() => {
        getAllActivities().then((activities) => {
            setActivities(activities);
        });
    }, []);


    return (
        <div className="activity-page">
            <AdminNavBar />
            <main className="activity-page-content" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
                <h1>Activity</h1>
                <div className="activity-grid">
                    {activities && activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="activity-card-wrapper"
                            onClick={() => navigate(`/admin/activity/modify/${activity.id}`)}
                        >
                            <ActivityCard
                                title={activity.title}
                                description={activity.description}
                                location={activity.location}
                                time={activity.time}
                                type={activity.type}
                                capacity={activity.capacity}
                                remaining={activity.remaining}
                            />
                        </div>
                    ))}

                    <div
                        className="add-activity-card"
                        onClick={() => navigate('/admin/activity/add')}
                    >
                        <div className="plus-icon">+</div>
                        <p>Add New Activity</p>
                    </div>
                </div>
            </main>
        </div>
    );
}  