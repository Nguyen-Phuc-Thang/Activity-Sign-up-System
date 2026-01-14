import "./EventForm.css";

function EventForm({ onClose }) {
    return (
        <div>
            <form className="form-container">
                <label>
                    Title
                    <input type="text" name="title" />
                </label>

                <label>
                    Date
                    <input type="date" name="date" />
                </label>

                <label>
                    Time Start
                    <input type="time" name="timeStart" />
                </label>

                <label>
                    Time End
                    <input type="time" name="timeEnd" />
                </label>

                <div className="form-buttons">
                    <button type="submit">Save Event</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
