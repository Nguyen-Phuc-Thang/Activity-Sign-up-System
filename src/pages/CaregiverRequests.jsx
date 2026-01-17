import { useEffect, useMemo, useState, useContext } from 'react';
import '../styles/pages/CaregiverRequests.css';
import CaregiverNavBar from '../components/CaregiverNavBar';
import { Colors } from '../global/styles';

import { AuthContext } from '../providers/AuthContext';
import { getAllActivities } from '../database/activity';
import { getMyRecipients } from '../database/recipients';
import { getRequestsByRecipientEmails, updateRequestStatus } from '../database/request';

export default function CaregiverRequests() {
    const auth = useContext(AuthContext);
    const { user, loading } = auth || { user: null, loading: true };

    const [activities, setActivities] = useState([]);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [busyIds, setBusyIds] = useState(new Set());

    const giverEmail = useMemo(() => user?.email ?? null, [user?.email]);

    const activityById = useMemo(() => {
        const map = new Map();
        activities.forEach(a => map.set(a.id, a));
        return map;
    }, [activities]);

    const loadAll = async () => {
        if (!giverEmail) return;

        setError(null);

        const recipientEmails = await getMyRecipients(giverEmail);

        const reqs = await getRequestsByRecipientEmails(recipientEmails);

        console.log('Fetched requests:', reqs);

        const acts = await getAllActivities();

        setRequests(reqs || []);
        setActivities(acts || []);
    };

    useEffect(() => {
        if (loading) return;
        if (!giverEmail) return;

        loadAll().catch((e) => setError(e.message || 'Failed to load requests'));
    }, [giverEmail, loading]);

    const onDecision = async (requestId, status) => {
        try {
            setBusyIds(prev => new Set(prev).add(requestId));
            setError(null);

            const updated = await updateRequestStatus(requestId, status);

            setRequests(prev =>
                prev.map(r => (r.id === requestId ? updated : r))
            );
        } catch (e) {
            setError(e.message || 'Failed to update request');
        } finally {
            setBusyIds(prev => {
                const next = new Set(prev);
                next.delete(requestId);
                return next;
            });
        }
    };

    const pending = requests.filter(r => (r.status ?? 'pending') === 'pending');
    const decided = requests.filter(r => (r.status ?? 'pending') !== 'pending');

    return (
        <div className="caregiver-requests-page">
            <CaregiverNavBar />

            <main
                className="caregiver-requests-content"
                style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}
            >
                <div className="caregiver-requests-header">
                    <h1>Requests</h1>
                    <button
                        className="caregiver-requests-refresh"
                        type="button"
                        onClick={() => loadAll().catch((e) => setError(e.message || 'Failed to refresh'))}
                        disabled={loading || !giverEmail}
                    >
                        Refresh
                    </button>
                </div>

                {error && <p className="caregiver-requests-error">{error}</p>}
                {loading && <p>Loading...</p>}

                {!loading && pending.length === 0 && (
                    <div className="caregiver-requests-empty">
                        <p>No pending requests.</p>
                    </div>
                )}

                {pending.length > 0 && (
                    <>
                        <h2 className="caregiver-requests-section-title">Pending</h2>
                        <div className="caregiver-requests-list">
                            {pending.map((r) => {
                                const act = activityById.get(r.activity_id);
                                const title = act?.title ?? `Activity #${r.activity_id}`;
                                const time = act?.time ?? '';
                                const location = act?.location ?? '';
                                const disabled = busyIds.has(r.id);

                                return (
                                    <div key={r.id} className="caregiver-requests-card">
                                        <div className="caregiver-requests-card-main">
                                            <div className="caregiver-requests-title">{title}</div>
                                            <div className="caregiver-requests-meta">
                                                <span>Recipient email: {r.recipient_email}</span>
                                                {time && <span>• {time}</span>}
                                                {location && <span>• {location}</span>}
                                            </div>
                                        </div>

                                        <div className="caregiver-requests-actions">
                                            <button
                                                className="caregiver-requests-accept"
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => onDecision(r.id, 'accepted')}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="caregiver-requests-reject"
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => onDecision(r.id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {decided.length > 0 && (
                    <>
                        <h2 className="caregiver-requests-section-title">History</h2>
                        <div className="caregiver-requests-list">
                            {decided.map((r) => {
                                const act = activityById.get(r.activity_id);
                                const title = act?.title ?? `Activity #${r.activity_id}`;

                                return (
                                    <div key={r.id} className="caregiver-requests-card">
                                        <div className="caregiver-requests-card-main">
                                            <div className="caregiver-requests-title">{title}</div>
                                            <div className="caregiver-requests-meta">
                                                <span>Recipient email: {r.recipient_email}</span>
                                            </div>
                                        </div>

                                        <div className={`caregiver-requests-badge badge-${r.status}`}>
                                            {r.status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
