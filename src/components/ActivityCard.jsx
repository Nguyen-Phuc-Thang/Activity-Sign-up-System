import { useState } from 'react';
import '../styles/components/ActivityCard.css';
import { Colors } from '../global/styles';

export default function ActivityCard({ title, description, location, time, type, capacity, remaining }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='activity-card'>
            <div className='card-main-content'>
                <div className='card-header'>
                    <h3 className='card-title'>{title}</h3>
                    <span className='card-type'>{type}</span>
                </div>
                <div className='card-details'>
                    <div className='detail-item'>
                        <span className='detail-label'>Location:</span>
                        <span className='detail-value'>{location}</span>
                    </div>
                    <div className='detail-item'>
                        <span className='detail-label'>Time:</span>
                        <span className='detail-value'>{time}</span>
                    </div>
                    <div className='detail-item'>
                        <span className='detail-label'>Capacity:</span>
                        <span className='detail-value'>{capacity - remaining}/{capacity}</span>
                    </div>
                </div>
            </div>

            <button
                className='toggle-description-btn'
                onClick={toggleDescription}
                aria-expanded={isExpanded}
            >
                {isExpanded ? '▼' : '▶'} Description
            </button>

            {isExpanded && (
                <div className='card-description'>
                    <p>{description}</p>
                </div>
            )}
        </div>
    );
}