import { useState, useEffect, useContext, use } from 'react';
import '../styles/pages/Profile.css';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';
import { getUserMetadata, updateUserMetadata } from '../database/userMetadata.js';
import { AuthContext } from '../providers/AuthContext.js';
import CaregiverNavBar from '../components/CaregiverNavBar';
import CareRecipientNavBar from '../components/CareRecipientNavBar';


export default function Profile() {
    const { user, loading } = useContext(AuthContext);
    const [userMetadata, setUserMetadata] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');


    useEffect(() => {
        if (user) {
            getUserMetadata(user.id).then((metadata) => {
                setUserMetadata(metadata);
            });
        }
    }, [user, userMetadata]);

    const startEditing = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const saveEdit = async (field) => {
        await updateUserMetadata(user.id, field, editValue);
        await getUserMetadata(user.id).then((metadata) => {
            setUserMetadata(metadata);
        });
        setEditingField(null);
    };

    const cancelEdit = () => {
        setEditingField(null);
        setEditValue('');
    };

    return (
        <div className="profile-page">
            {userMetadata.role === 'Admin' && <AdminNavBar />}
            {userMetadata.role === 'Caregiver' && <CaregiverNavBar />}
            {userMetadata.role === 'Recipient' && <CareRecipientNavBar />}
            <main className="profile-content" style={{ backgroundColor: Colors.BACKGROUND }}>
                <div className="profile-container">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <div className="avatar-frame">
                            <img src="/assets/images/default_avatar.jpeg" alt="User Avatar" className="user-avatar" />
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="user-info-section">
                        <h1>Profile</h1>

                        {/* Display Name */}
                        <div className="info-item">
                            <label>Display Name</label>
                            <div className="info-field">
                                {editingField === 'display_name' ? (
                                    <div className="edit-input-group">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                        />
                                        <button className="save-btn" onClick={() => saveEdit('display_name')}>✓</button>
                                        <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="info-value">{userMetadata?.display_name ?? "DISPLAY NAME NOT SET"}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => startEditing('display_name', userMetadata?.display_name ?? "")}
                                            title="Edit display name"
                                        >
                                            ✎
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="info-item">
                            <label>Email</label>
                            <div className="info-field">
                                {editingField === 'email' ? (
                                    <div className="edit-input-group">
                                        <input
                                            type="email"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                        />
                                        <button className="save-btn" onClick={() => saveEdit('email')}>✓</button>
                                        <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="info-value">{user.email ?? "EMAIL NOT SET"}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => startEditing('email', user.email)}
                                            title="Edit email"
                                        >
                                            ✎
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Role */}
                        <div className="info-item">
                            <label>Role</label>
                            <div className="info-field">
                                <span className="info-value">{userMetadata?.role ?? "ROLE NOT SET"}</span>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="info-item">
                            <label>Age</label>
                            <div className="info-field">
                                {editingField === 'age' ? (
                                    <div className="edit-input-group">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                        />
                                        <button className="save-btn" onClick={() => saveEdit('age')}>✓</button>
                                        <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="info-value">{userMetadata?.age ?? "AGE NOT SET"}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => startEditing('age', userMetadata?.age)}
                                            title="Edit age"
                                        >
                                            ✎
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="info-item">
                            <label>Gender</label>
                            <div className="info-field">
                                {editingField === 'gender' ? (
                                    <div className="edit-input-group">
                                        <select
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <button className="save-btn" onClick={() => saveEdit('gender')}>✓</button>
                                        <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="info-value">{userMetadata?.gender ?? "GENDER NOT SET"}</span>
                                        <button
                                            className="edit-btn"
                                            onClick={() => startEditing('gender', userMetadata?.gender)}
                                            title="Edit gender"
                                        >
                                            ✎
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}