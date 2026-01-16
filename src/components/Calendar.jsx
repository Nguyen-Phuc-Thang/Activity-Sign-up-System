import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";
import CaregiverNavBar from "./CaregiverNavBar";

function Calendar() {
    const [events, setEvents] = useState([
        { id: "a", title: "Activity A", start: "2026-01-14T10:00:00" },
        { id: "b", title: "Activity B", start: "2026-01-15T14:00:00" },
    ]);

    const addEvent = (e) => {
        alert("Adding event");
        e.preventDefault();

        const form = e.currentTarget;

        console.log(form);

        const title = form.title.value;
        const date = form.date.value;
        const timeStart = form.timeStart.value;
        const timeEnd = form.timeEnd.value;

        const newEvent = {
            id: crypto.randomUUID(),
            title,
            start: `${date}T${timeStart}`,
            end: `${date}T${timeEnd}`,
        };

        setEvents((prev) => [...prev, newEvent]);
        setShowEventForm(false);
    };

    return (
        <>
            <CaregiverNavBar />

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,multiMonthYear",
                }}
                selectable={true}
                events={events}
            />
        </>
    );
}

export default Calendar;
