import { useState, useEffect } from 'react';
import '../styles/pages/Caregiver.css';
import ActivityCard from '../components/ActivityCard';
import { Colors } from '../global/styles';
import CaregiverNavBar from '../components/CaregiverNavBar';
import { getAllActivities } from '../database/activity';

export default function Caregiver() {
    const [activities, setActivities] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllActivities()
            .then(setActivities)
            .catch((e) => setError(e.message || 'Failed to load activities'));
    }, []);

    return (
        <div className="activity-page">
            <CaregiverNavBar />
            <main
                className="activity-page-content"
                style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}
            >
                <h1>Activity</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!activities && !error && <p>Loading...</p>}

                <div className="activity-grid">
                    {activities &&
                        activities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                title={activity.title}
                                description={activity.description}
                                location={activity.location}
                                time={activity.time}
                                type={activity.type}
                                capacity={activity.capacity}
                                remaining={activity.remaining}
                            />
                        ))}
                </div>
            </main>
        </div>
    );
}
