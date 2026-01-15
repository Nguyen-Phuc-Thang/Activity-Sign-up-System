import { useState } from 'react';
import '../styles/pages/AddActivity.css';
import AdminNavBar from '../components/AdminNavBar';
import { Colors } from '../global/styles';
import { useNavigate } from 'react-router-dom';
import { addNewActivity } from '../database/activity';

export default function AddActivity() {
    const navigate = useNavigate();
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

        const activityData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            location: formData.location,
            time: time,
            capacity: parseInt(formData.capacity),
            remaining: parseInt(formData.capacity)
        };


        addNewActivity(activityData).then(() => {
            navigate('/admin/activity');
            alert('Activity added successfully!');
        }).catch((error) => {
            console.error('Error adding activity:', error);
            alert('Failed to add activity. Please try again.');
        });
    };

    const handleCancel = () => {
        navigate('/admin/activity');
    };

    // Generate hour options (1-12)
    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    // Generate minute options (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="add-activity-page">
            <AdminNavBar />
            <main className="add-activity-page-content" style={{ backgroundColor: Colors.BACKGROUND }}>
                <h1>Add New Activity</h1>

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

                    {/* Add Duration in Hours and Minutes here */}
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
                            Add Activity
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}