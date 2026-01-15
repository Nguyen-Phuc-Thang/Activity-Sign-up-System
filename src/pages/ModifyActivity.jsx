import { useState, useEffect, useContext } from 'react';
import '../styles/pages/ModifyActivity.css';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';
import { useParams } from 'react-router-dom';
import { getActivityById, modifyActivity, deleteActivity } from '../database/activity';

export default function ModifyActivity() {
    const navigate = useNavigate();
    const { activityId } = useParams();
    const [activityData, setActivityData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        location: '',
        date: '',
        hour: '',
        minute: '',
        period: 'AM',
        durationHours: '',
        durationMinutes: '',
        capacity: ''
    });

    useEffect(() => {
        getActivityById(activityId).then((activity) => {
            setActivityData(activity);

            // Parse the time string: "DD/MM/YYYY HH:MM AM/PM-HH:MM AM/PM"
            const timeParts = activity.time.split(' ');
            const datePart = timeParts[0]; // "DD/MM/YYYY"
            const startTime = timeParts[1]; // "HH:MM"
            const startPeriod = timeParts[2].split('-')[0]; // "AM" or "PM"
            const endTimeWithPeriod = timeParts[2].split('-')[1] + ' ' + timeParts[3]; // "HH:MM AM/PM"

            // Parse date
            const [day, month, year] = datePart.split('/');
            const formattedDate = `${year}-${month}-${day}`;

            // Parse start time
            const [startHour, startMinute] = startTime.split(':');

            // Parse end time
            const endParts = endTimeWithPeriod.split(' ');
            const [endHour, endMinute] = endParts[0].split(':');
            const endPeriod = endParts[1];

            // Calculate duration
            let startHour24 = parseInt(startHour);
            if (startPeriod === 'PM' && startHour24 !== 12) {
                startHour24 += 12;
            } else if (startPeriod === 'AM' && startHour24 === 12) {
                startHour24 = 0;
            }

            let endHour24 = parseInt(endHour);
            if (endPeriod === 'PM' && endHour24 !== 12) {
                endHour24 += 12;
            } else if (endPeriod === 'AM' && endHour24 === 12) {
                endHour24 = 0;
            }

            let durationMinutes = (endHour24 * 60 + parseInt(endMinute)) - (startHour24 * 60 + parseInt(startMinute));
            const durationHours = Math.floor(durationMinutes / 60);
            durationMinutes = durationMinutes % 60;

            setFormData({
                title: activity.title,
                description: activity.description,
                type: activity.type,
                location: activity.location,
                date: formattedDate,
                hour: startHour,
                minute: startMinute,
                period: startPeriod,
                durationHours: String(durationHours),
                durationMinutes: String(durationMinutes),
                capacity: String(activity.capacity)
            });
        });
    }, [activityId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Parse the date
        const [year, month, day] = formData.date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        // Convert 12-hour time to 24-hour format for calculation
        let startHour = parseInt(formData.hour);
        if (formData.period === 'PM' && startHour !== 12) {
            startHour += 12;
        } else if (formData.period === 'AM' && startHour === 12) {
            startHour = 0;
        }

        // Calculate end time
        const startMinutes = parseInt(formData.minute);
        const durationHours = parseInt(formData.durationHours) || 0;
        const durationMinutes = parseInt(formData.durationMinutes) || 0;

        let endHour = startHour + durationHours;
        let endMinute = startMinutes + durationMinutes;

        // Handle minute overflow
        if (endMinute >= 60) {
            endHour += Math.floor(endMinute / 60);
            endMinute = endMinute % 60;
        }

        // Handle hour overflow (past midnight)
        if (endHour >= 24) {
            endHour = endHour % 24;
        }

        // Format start time
        const startTime = `${formData.hour.padStart(2, '0')}:${formData.minute.padStart(2, '0')} ${formData.period}`;

        // Convert end time back to 12-hour format
        let endPeriod = 'AM';
        let endHour12 = endHour;
        if (endHour >= 12) {
            endPeriod = 'PM';
            if (endHour > 12) {
                endHour12 = endHour - 12;
            }
        }
        if (endHour === 0) {
            endHour12 = 12;
        }

        const endTime = `${String(endHour12).padStart(2, '0')}:${String(endMinute).padStart(2, '0')} ${endPeriod}`;

        // Combine into final time format
        const time = `${formattedDate} ${startTime}-${endTime}`;

        const updatedActivityData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            location: formData.location,
            time: time,
            capacity: parseInt(formData.capacity)
        };

        modifyActivity(activityId, updatedActivityData).then(() => {
            navigate('/admin/activity');
            alert('Activity updated successfully!');
        }).catch((error) => {
            console.error('Error updating activity:', error);
            alert('Failed to update activity. Please try again.');
        });
    };

    const handleCancel = () => {
        navigate('/admin/activity');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
            deleteActivity(activityId).then(() => {
                navigate('/admin/activity');
                alert('Activity deleted successfully!');
            }).catch((error) => {
                console.error('Error deleting activity:', error);
                alert('Failed to delete activity. Please try again.');
            });
        }
    };

    // Generate hour options (1-12)
    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    // Generate minute options (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    if (!activityData) {
        return (
            <div className="modify-activity-page">
                <AdminNavBar />
                <main className="modify-activity-content" style={{ backgroundColor: Colors.BACKGROUND }}>
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="modify-activity-page">
            <AdminNavBar />
            <main className="modify-activity-content" style={{ backgroundColor: Colors.BACKGROUND }}>
                <h1>Edit Activity</h1>

                <form className="activity-form" onSubmit={handleSubmit}>
                    {/* Title Field */}
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter activity title"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter activity description"
                            rows="5"
                        />
                    </div>

                    {/* Type Field */}
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select activity type</option>
                            <option value="Recipient-only">Recipient-only</option>
                            <option value="Accompanied">Accompanied</option>
                            <option value="Joint">Joint</option>
                            <option value="Community">Community</option>
                        </select>
                    </div>

                    {/* Location Field */}
                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Enter activity location"
                        />
                    </div>

                    {/* Time Field */}
                    <div className="form-group">
                        <label>Time</label>
                        <div className="time-inputs">
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="date-input"
                            />
                            <div className="time-selectors">
                                <select
                                    name="hour"
                                    value={formData.hour}
                                    onChange={handleChange}
                                    required
                                    className="time-select"
                                >
                                    <option value="">HH</option>
                                    {hours.map(hour => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <span className="time-separator">:</span>
                                <select
                                    name="minute"
                                    value={formData.minute}
                                    onChange={handleChange}
                                    required
                                    className="time-select"
                                >
                                    <option value="">MM</option>
                                    {minutes.map(minute => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select
                                    name="period"
                                    value={formData.period}
                                    onChange={handleChange}
                                    required
                                    className="period-select"
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Duration Field */}
                    <div className="form-group">
                        <label>Duration</label>
                        <div className="duration-inputs">
                            <div className="duration-field">
                                <input
                                    type="number"
                                    name="durationHours"
                                    value={formData.durationHours}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="23"
                                    placeholder="Hours"
                                    className="duration-input"
                                />
                                <span className="duration-label">Hours</span>
                            </div>
                            <div className="duration-field">
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="59"
                                    placeholder="Minutes"
                                    className="duration-input"
                                />
                                <span className="duration-label">Minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Field */}
                    <div className="form-group">
                        <label htmlFor="capacity">Capacity</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="Enter capacity"
                        />
                    </div>

                    {/* Form Buttons */}
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Update Activity
                        </button>
                    </div>
                </form>

                {/* Delete Button */}
                <button className="delete-button" onClick={handleDelete}>
                    Delete Activity
                </button>
            </main>
        </div>
    );
}