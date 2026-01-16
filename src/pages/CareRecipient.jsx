import { useState, useEffect, useContext } from 'react';
import '../styles/pages/CareRecipient.css';
import CaregiverNavBar from '../components/CaregiverNavBar';
import CareRecipientActivityCard from '../components/CareRecipientActivityCard';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';
import { getAllActivities } from '../database/activity';
import { getUserMetadata } from '../database/userMetadata';
import { createRequest } from '../database/request';

export default function CareRecipientActivity() {
    const navigate = useNavigate();

    const { user, loading } = useContext(AuthContext);
    const [userMetadata, setUserMetadata] = useState(null);

    const [activities, setActivities] = useState(null);
    const [requestedIds, setRequestedIds] = useState(new Set());

    useEffect(() => {
        if (loading) return;
        if (!user?.id) return;

        getUserMetadata(user.id).then(setUserMetadata);
        getAllActivities().then(setActivities);
    }, [user?.id, loading]);


    if (loading || !activities) {
        return (
            <div className="activity-page">
                <CaregiverNavBar />
                <main className="activity-page-content" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
                    <h1>Activity</h1>
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="activity-page">
            <CaregiverNavBar />
            <main className="activity-page-content" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
                <h1>Activity</h1>

                <div className="activity-grid">
                    {activities.map((activity) => (
                        <CareRecipientActivityCard
                            key={activity.id}
                            title={activity.title}
                            description={activity.description}
                            location={activity.location}
                            time={activity.time}
                            type={activity.type}
                            capacity={activity.capacity}
                            remaining={activity.remaining}
                            status={requestedIds.has(activity.id) ? 'requested' : null}
                            onClick={() => createRequest({
                                activity_id: activity.id,
                                recipient_id: user.id,
                                registered: false,
                            }).then(() => {
                                setRequestedIds(prev => new Set(prev).add(activity.id));
                            })}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
