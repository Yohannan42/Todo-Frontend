import React, { useState, useEffect } from "react";
import "./MoodTrackerPage.css";
import { getMoods, saveMood } from "../../api/moodApi";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import MoodEstimator from "./MoodEstimator";
import Calendar from "../Calendar/Calendar";

const MoodTrackerPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(""); 
    const [selectedMood, setSelectedMood] = useState<string>(""); 
    const [moods, setMoods] = useState<{ [date: string]: string }>({}); 
    const [isEstimatorOpen, setIsEstimatorOpen] = useState(false); 
    const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false); 

    const moodOptions = ["Happy", "Neutral", "Sad", "Stressed", "Excited"];

    // Fetch moods from the backend on component mount
    useEffect(() => {
        const fetchMoods = async () => {
            try {
                const moodData = await getMoods();
                const moodMap: { [date: string]: string } = {};
                moodData.forEach(({ date, mood }) => {
                    moodMap[date] = mood;
                });
                setMoods(moodMap);
            } catch (error) {
                console.error("Error fetching moods:", error);
            }
        };

        fetchMoods();
    }, []);

    const handleAddMood = async (mood: string) => {
        if (!selectedDate || !mood) {
            alert("Please select a date and mood.");
            return;
        }

        try {
            await saveMood({ date: selectedDate, mood });
            setMoods((prev) => ({ ...prev, [selectedDate]: mood }));
            // Reset date and mood after saving
            setSelectedDate("");
            setSelectedMood("");
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    };

    const calculateMoodFrequency = () => {
        const moodCounts: { [key: string]: number } = {};
        Object.values(moods).forEach((mood) => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        return Object.keys(moodCounts).map((mood) => ({
            mood,
            count: moodCounts[mood],
        }));
    };

    const calculateLongestStreak = () => {
        const dates = Object.keys(moods).sort();
        let longestStreak = 0;
        let currentStreak = 0;

        for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i]);
            const previousDate = new Date(dates[i - 1]);

            if (currentDate.getTime() - previousDate.getTime() === 86400000) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }

        return Math.max(longestStreak, currentStreak);
    };

    const moodEvents = Object.keys(moods).map((date) => ({
        _id: date,
        title: moods[date],
        date,
    }));

    return (
        <div className="mood-tracker-page">
            <header className="mood-header">
                <h1>Mood Tracker</h1>
                <p>Track your moods daily to identify patterns and improve well-being.</p>

                {/* Mood Estimation and Date Selector */}
                <div className="mood-tools">
                    <button
                        className="select-date-button"
                        onClick={() => setIsDateSelectorOpen(!isDateSelectorOpen)}
                    >
                        {selectedDate
                            ? `Selected Date: ${selectedDate}`
                            : "Choose Date"}
                    </button>
                    <button
                        className="estimate-mood-button"
                        onClick={() => {
                            if (!selectedDate) {
                                alert("Please choose a date first.");
                            } else {
                                setIsEstimatorOpen(true);
                            }
                        }}
                    >
                        Estimate Mood
                    </button>
                </div>

                {isDateSelectorOpen && (
                    <div className="date-picker-modal">
                        <h3>Select a Date</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-picker"
                        />
                        <button
                            onClick={() => setIsDateSelectorOpen(false)}
                            className="close-date-picker"
                        >
                            Confirm Date
                        </button>
                    </div>
                )}
            </header>

            {/* Add Mood Section */}
            <div className="add-mood-section">
                <h3>Add Mood for a Specific Date</h3>
                <div className="add-mood-form">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="date-picker"
                    />
                    <select
                        value={selectedMood}
                        onChange={(e) => setSelectedMood(e.target.value)}
                        className="mood-select"
                    >
                        <option value="">Select Mood</option>
                        {moodOptions.map((mood) => (
                            <option key={mood} value={mood}>
                                {mood}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleAddMood(selectedMood)}
                        className="add-mood-button"
                    >
                        Add Mood
                    </button>
                </div>
            </div>

            <div className="calendar-wrapper">
                <Calendar events={moodEvents} />
            </div>

            <div className="mood-stats">
                <h2>Mood Insights</h2>

                <div className="mood-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={calculateMoodFrequency()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mood" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="streak-info">
                    <h3>Longest Mood Streak: {calculateLongestStreak()} days</h3>
                </div>
            </div>

            {isEstimatorOpen && (
                <MoodEstimator
                    onMoodSelect={(mood) => {
                        handleAddMood(mood); // Save mood
                        setIsEstimatorOpen(false); // Close modal
                    }}
                    onClose={() => setIsEstimatorOpen(false)}
                />
            )}
        </div>
    );
};

export default MoodTrackerPage;
