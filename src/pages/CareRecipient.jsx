import { useState, useEffect, useContext, useMemo } from 'react';
import '../styles/pages/CareRecipient.css';
import CareRecipientNavBar from '../components/CareRecipientNavBar';
import CareRecipientActivityCard from '../components/CareRecipientActivityCard';
import { Colors } from '../global/styles';
import { AuthContext } from '../providers/AuthContext';
import { getAllActivities } from '../database/activity';
import { getUserMetadata } from '../database/userMetadata';
import { createRequest, getRequestsByRecipientEmail } from '../database/request';

export default function CareRecipientActivity() {
    const { user, loading } = useContext(AuthContext);

    const [userMetadata, setUserMetadata] = useState(null);
    const [activities, setActivities] = useState(null);

    // activity_id -> 'pending' | 'accepted' | 'rejected'
    const [requestStatusByActivity, setRequestStatusByActivity] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loading) return;
        if (!user?.id || !user?.email) return;

        setError(null);

        getUserMetadata(user.id).then(setUserMetadata);

        Promise.all([
            getAllActivities(),
            getRequestsByRecipientEmail(user.email),
        ])
            .then(([acts, reqs]) => {
                setActivities(acts);

                const map = {};
                for (const r of reqs) {
                    map[r.activity_id] = r.status; // 'pending' | 'accepted' | 'rejected'
                }
                setRequestStatusByActivity(map);
            })
            .catch((e) => setError(e.message || 'Failed to load data'));
    }, [user?.id, user?.email, loading]);

    const statusFor = useMemo(() => {
        return (activityId) => requestStatusByActivity[activityId] ?? null;
    }, [requestStatusByActivity]);

    const handleRequest = async (activityId) => {
        if (!user?.email) return;

        if (statusFor(activityId)) return;

        try {
            setError(null);

            await createRequest({
                activity_id: activityId,
                recipient_email: user.email,
                status: 'pending',
            });

            setRequestStatusByActivity(prev => ({
                ...prev,
                [activityId]: 'pending',
            }));
        } catch (e) {
            setError(e.message || 'Failed to request activity');
        }
    };

    if (loading || !activities) {
        return (
            <div className="activity-page">
                <CareRecipientNavBar />
                <main
                    className="activity-page-content"
                    style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}
                >
                    <h1>Activity</h1>
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="activity-page">
            <CareRecipientNavBar />
            <main
                className="activity-page-content"
                style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}
            >
                <h1>Activity</h1>

                {error && <p className="myrecipients-error">{error}</p>}

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
                            // IMPORTANT: pass real status from DB
                            status={statusFor(activity.id)} // 'pending' | 'accepted' | 'rejected' | null
                            onClick={() => handleRequest(activity.id)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
