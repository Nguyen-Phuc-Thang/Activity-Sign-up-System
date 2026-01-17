import { useEffect, useMemo, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/pages/Calendar.css";
import CaregiverNavBar from "../components/CaregiverNavBar";

import { AuthContext } from "../providers/AuthContext";
import { getAllActivities } from "../database/activity";
import { getMyRecipientEmails } from "../database/recipients";
import { getAcceptedRequestsByRecipientEmails } from "../database/request";

function Calendar() {
    const { user, loading } = useContext(AuthContext);

    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    const caregiverEmail = useMemo(() => user?.email ?? null, [user?.email]);

    function parseDDMMYYYYTimeRange(rangeStr) {
        if (!rangeStr) return null;

        const [datePart, timeRangePart] = rangeStr.split(' ');
        if (!datePart || !timeRangePart) return null;

        const [dd, mm, yyyy] = datePart.split('/');
        if (!dd || !mm || !yyyy) return null;

        const rest = rangeStr.slice(datePart.length).trim();
        const [startPartRaw, endPartRaw] = rest.split('-');
        if (!startPartRaw || !endPartRaw) return null;

        const start = parseTime12h(`${yyyy}-${mm}-${dd}`, startPartRaw.trim());
        const end = parseTime12h(`${yyyy}-${mm}-${dd}`, endPartRaw.trim());

        if (!start || !end) return null;

        return { startISO: start, endISO: end };
    }

    function parseTime12h(isoDate, time12h) {
        const m = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!m) return null;

        let hour = Number(m[1]);
        const minute = Number(m[2]);
        const ampm = m[3].toUpperCase();

        if (ampm === 'AM') {
            if (hour === 12) hour = 0;
        } else { // PM
            if (hour !== 12) hour += 12;
        }

        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');

        return `${isoDate}T${hh}:${mm}:00`;
    }


    useEffect(() => {
        if (loading) return;
        if (!caregiverEmail) return;

        const loadCalendar = async () => {
            setError(null);
            const recipientEmails = await getMyRecipientEmails(caregiverEmail);

            console.log("Recipient emails:", recipientEmails);

            const acceptedRequests = await getAcceptedRequestsByRecipientEmails(recipientEmails);

            console.log("Accepted requests:", acceptedRequests);

            const activities = await getAllActivities();
            const activityMap = new Map((activities || []).map(a => [a.id, a]));

            //map accepted requests -> events
            const calendarEvents = acceptedRequests
                .map((req) => {
                    const act = activityMap.get(req.activity_id);
                    if (!act) return null;

                    const start = act.time;

                    const parsed = parseDDMMYYYYTimeRange(act.time);
                    if (!parsed) return null;

                    return {
                        title: act.title,
                        start: parsed.startISO,
                        end: parsed.endISO,
                    };
                })
                .filter(Boolean);

            console.log("Calendar events:", calendarEvents);
            const uniqueCalendarEvents = Array.from(
                new Map(
                    calendarEvents.map(e => [`${e.start}-${e.title}`, e])
                ).values()
            );
            console.log("Unique calendar events:", uniqueCalendarEvents);

            setEvents(uniqueCalendarEvents);
        };

        loadCalendar().catch((e) => setError(e.message || "Failed to load calendar"));
    }, [loading, caregiverEmail]);

    return (
        <>
            <CaregiverNavBar />

            {error && <p style={{ color: "red", padding: "0 16px" }}>{error}</p>}

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,multiMonthYear",
                }}
                height="auto"
                selectable={true}
                events={events}
            />
        </>
    );
}

export default Calendar;
