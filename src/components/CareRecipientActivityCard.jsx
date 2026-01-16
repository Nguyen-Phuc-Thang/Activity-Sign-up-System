import '../styles/components/CareRecipientActivityCard.css';

export default function CareRecipientActivityCard({
    title,
    description,
    location,
    time,
    type,
    capacity,
    remaining,
    onClick,
    status = null,
}) {
    const isClickable = typeof onClick === 'function' && status !== 'requested';

    return (
        <div
            className={`cr-activity-card ${status ? `cr-status-${status}` : ''
                } ${isClickable ? 'cr-clickable' : ''}`}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? onClick : undefined}
            onKeyDown={
                isClickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onClick();
                    }
                    : undefined
            }
        >
            <div className="cr-card-header">
                <h3 className="cr-card-title">{title}</h3>
                <span className="cr-card-type">{type}</span>
            </div>

            <div className="cr-card-details">
                <div className="cr-detail-item">
                    <span className="cr-detail-label">Location</span>
                    <span className="cr-detail-value">{location}</span>
                </div>

                <div className="cr-detail-item">
                    <span className="cr-detail-label">Time</span>
                    <span className="cr-detail-value">{time}</span>
                </div>

                <div className={`cr-detail-item cr-status-box`}>
                    <span className="cr-detail-label">
                        {status ? 'Status' : 'Capacity'}
                    </span>

                    <span className="cr-detail-value">
                        {status === 'requested' && 'REQUEST SENT'}
                        {status === 'accepted' && 'ACCEPTED'}
                        {status === 'rejected' && 'REJECTED'}
                        {!status && `${capacity - remaining}/${capacity}`}
                    </span>
                </div>
            </div>

            <div className="cr-card-description">
                <p>{description}</p>
            </div>
        </div>
    );
}
