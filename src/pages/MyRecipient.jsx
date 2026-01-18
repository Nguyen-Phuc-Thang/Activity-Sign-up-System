import { useEffect, useMemo, useState, useContext } from 'react';
import CaregiverNavBar from '../components/CaregiverNavBar';
import { Colors } from '../global/styles';
import '../styles/pages/MyRecipients.css';

import { AuthContext } from '../providers/AuthContext';
import { getMyRecipients, addRecipient } from '../database/recipients';

export default function MyRecipients() {
    const auth = useContext(AuthContext);
    const { user, loading } = auth || { user: null, loading: true };

    const [recipients, setRecipients] = useState([]);

    const [adding, setAdding] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const giverEmail = useMemo(() => user?.email ?? null, [user?.email]);

    const loadRecipients = async () => {
        if (!giverEmail) return;
        const data = await getMyRecipients(giverEmail);
        setRecipients(data || []);
    };

    useEffect(() => {
        if (loading || !giverEmail) return;
        loadRecipients();
    }, [giverEmail, loading]);

    const handleSave = async () => {
        if (!newEmail.trim()) return;

        setSaving(true);
        await addRecipient(giverEmail, newEmail.trim());
        await loadRecipients();
        setAdding(false);
        setNewEmail('');
        setSaving(false);

    };

    const normalized = recipients.map((r) =>
        typeof r === 'string' ? r : r.recipient_email
    );

    const isDuplicate = normalized.includes(newEmail.trim().toLowerCase());

    return (
        <div className="myrecipients-page">
            <CaregiverNavBar />

            <main
                className="myrecipients-content"
                style={{ backgroundColor: Colors.BACKGROUND, color: Colors.TEXT }}
            >
                <div className="myrecipients-header">
                    <h1>My Recipients</h1>

                    {!adding ? (
                        <button
                            className="myrecipients-add-btn"
                            onClick={() => setAdding(true)}
                            disabled={loading}
                        >
                            + Add Care Recipient
                        </button>
                    ) : (
                        <div className="myrecipients-add-inline">
                            {isDuplicate && (
                                <small style={{ color: '#dc2626' }}>
                                    Recipient already added
                                </small>
                            )}
                            <input
                                type="email"
                                placeholder="recipient@email.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                autoFocus
                            />
                            <button
                                className="add-save-btn"
                                onClick={handleSave}
                                disabled={saving || !newEmail.trim() || isDuplicate}
                            >
                                ✓
                            </button>
                            <button
                                className="add-cancel-btn"
                                onClick={() => {
                                    setAdding(false);
                                    setNewEmail('');
                                }}
                                disabled={saving}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {loading && <p>Loading...</p>}

                {!loading && normalized.length === 0 && !adding && (
                    <div className="myrecipients-empty">
                        <p>You have no care recipients yet.</p>
                    </div>
                )}

                <div className="myrecipients-list">
                    {normalized.map((email) => (
                        <div key={email} className="myrecipients-row">
                            <div className="myrecipients-email">{email}</div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
