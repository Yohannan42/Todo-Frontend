import React, { useState } from "react";
import dayjs from "dayjs";
import "./Calendar.css";

interface Task {
    _id: string;
    title: string;
    date?: string;
}

interface CalendarProps {
    events: Task[];
    onDateClick?: (date: string) => void; // Optional callback for date clicks
}

const Calendar: React.FC<CalendarProps> = ({ events, onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let day = startDate;
    while (day.isBefore(endDate, "day")) {
        days.push(day);
        day = day.add(1, "day");
    }

    const handleMonthChange = (direction: number) => {
        setCurrentDate(currentDate.add(direction, "month"));
    };

    const handleDateClick = (date: string) => {
        if (onDateClick) {
            onDateClick(date); // Trigger callback with the selected date
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => handleMonthChange(-1)} className="nav-button">
                    &lt;
                </button>
                <h2 className="month-year">{currentDate.format("MMMM YYYY")}</h2>
                <button onClick={() => handleMonthChange(1)} className="nav-button">
                    &gt;
                </button>
            </div>
            <div className="days-of-week">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="day-name">
                        {day}
                    </div>
                ))}
            </div>
            <div className="calendar-grid">
                {days.map((day) => {
                    const isToday = day.isSame(dayjs(), "day");
                    const isCurrentMonth = day.month() === currentDate.month();

                    return (
                        <div
                            key={day.toString()}
                            className={`day ${
                                isToday
                                    ? "today"
                                    : isCurrentMonth
                                    ? "current-month"
                                    : "other-month"
                            }`}
                            onClick={() => handleDateClick(day.format("YYYY-MM-DD"))} // Add click handler
                        >
                            <span>{day.format("D")}</span>
                            <div className="event-list">
                                {events
                                    .filter((event) => dayjs(event.date).isSame(day, "day"))
                                    .map((event) => (
                                        <div key={event._id} className="event">
                                            {event.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
