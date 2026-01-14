import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventForm from "./EventForm";
import "./Calendar.css";

function Calendar() {
    const [events, setEvents] = useState([
        { id: "a", title: "Activity A", start: "2026-01-14T10:00:00" },
        { id: "b", title: "Activity B", start: "2026-01-15T14:00:00" },
    ]);

    const [showEventForm, setShowEventForm] = useState(false);

    const addEvent = () => {
        alert("Add Event button clicked!");
        setShowEventForm(true);
    };

    const closeEventForm = () => {
        setShowEventForm(false);
    }

    return (
        <>
            <button onClick={addEvent}>+ Add Event</button>
            {showEventForm && (
                <div className="overlay" onClick={() => setShowEventForm(false)}>
                    <div
                        className="content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EventForm onClose={() => setShowEventForm(false)} />
                    </div>
                </div>
            )}
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek"
                }}
                selectable
                events={events}
            >
            </FullCalendar>
        </>
    );
}

export default Calendar;