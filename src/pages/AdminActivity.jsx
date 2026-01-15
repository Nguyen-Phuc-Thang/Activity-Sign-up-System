import { useState } from 'react';
import '../styles/pages/AdminActivity.css';
import AdminNavBar from '../components/AdminNavBar';
import ActivityCard from '../components/ActivityCard';
import { Colors } from '../global/styles';

const activitiesData = [
    {
        id: 1,
        title: 'Morning Stretch & Balance',
        description: 'Light exercise session focused on flexibility and balance for seniors.',
        location: 'Tsao Community Hub – Hall A',
        time: '2026-01-20 09:00–10:00',
        type: 'Recipient-only',
        capacity: 30,
        remaining: 12,
    },
    {
        id: 2,
        title: 'Community Outing: Botanic Gardens',
        description: 'Guided outdoor walk and social outing with optional caregiver accompaniment.',
        location: 'Singapore Botanic Gardens',
        time: '2026-01-22 08:30–12:00',
        type: 'Accompanied',
        capacity: 25,
        remaining: 7,
    },
    {
        id: 3,
        title: 'Caregiver Support Circle',
        description: 'Peer support session for caregivers to share experiences and coping strategies.',
        location: 'Tsao Community Hub – Room 3',
        time: '2026-01-24 19:00–20:30',
        type: 'Caregiver-only',
        capacity: 20,
        remaining: 5,
    },
    {
        id: 4,
        title: 'Intergenerational Art Workshop',
        description: 'Creative art session designed for seniors and their caregivers to participate together.',
        location: 'Tsao Community Hub – Art Studio',
        time: '2026-01-26 14:00–16:00',
        type: 'Joint',
        capacity: 16,
        remaining: 4,
    },
    {
        id: 5,
        title: 'Nutrition & Healthy Ageing Talk',
        description: 'Educational talk on nutrition, meal planning, and healthy ageing practices.',
        location: 'Tsao Community Hub – Auditorium',
        time: '2026-01-28 10:30–12:00',
        type: 'Community',
        capacity: 50,
        remaining: 28,
    },
]


export default function AdminActivity() {
    return (
        <div className="activity-page">
            <AdminNavBar />
            <main className="activity-page-content" style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}>
                <h1>Activity</h1>
                <div className="activity-grid">
                    {activitiesData.map((activity) => (
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