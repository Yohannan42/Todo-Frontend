import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import listIcon from "../../assets/listicon.svg"; 
import taskIcon from "../../assets/task.png";
import stickyNoteIcon from "../../assets/StickyNotes.png";
import productivityIcon from "../../assets/Tracker.png";
import moodTrackerIcon from "../../assets/react.svg";
import calendarIcon from "../../assets/calendar.png";

const NavigationBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 1, name: "Tasks", path: "/tasks", icon: taskIcon },
    { id: 2, name: "Sticky Note", path: "/sticky-notes", icon: stickyNoteIcon },
    { id: 3, name: "Productivity Status", path: "/productivity", icon: productivityIcon },
    { id: 4, name: "Mood Tracker", path: "/mood-tracker", icon: moodTrackerIcon },
    { id: 5, name: "Calendar", path: "/calendar", icon: calendarIcon },
  ];

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      {/* Navigation Toggle Icon */}
      <div className="nav-toggle-icon" onClick={handleToggle}>
        <img src={listIcon} alt="Menu Icon" />
      </div>

      {/* Navigation Bar */}
      {isVisible && (
        <>
          <div className="navigation-bar">
          <ul className="nav-list">
  {navItems.map((item) => (
    <li key={item.id} className="nav-item">
      <Link
        to={item.path}
        className="nav-link"
        onClick={() => setIsVisible(false)} // Close navigation on link click
      >
        <img src={item.icon} alt={`${item.name} Icon`} className="nav-icon" />
        <span>{item.name}</span>
      </Link>
    </li>
  ))}
</ul>
          </div>

          {/* Overlay */}
          <div
            className="overlay"
            onClick={() => setIsVisible(false)} // Close navigation when overlay is clicked
          ></div>
        </>
      )}
    </>
  );
};

export default NavigationBar;
