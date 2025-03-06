import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getTasks, createTask, deleteTask } from "./api/taskApi";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import ToDoPage from "./components/ToDoPage/ToDoPage";
import Calendar from "./components/Calendar/Calendar";
import "./App.css";
import MoodTrackerPage from "./components/MoodTrackerPage/MoodTrackerPage";
import StickyNotesPage from "./components/StickyNotesPage/StickyNotesPage";
import ProductivityPage from "./components/Pages/ProductivityPage";

const App: React.FC = () => {
    const [todos, setTodos] = useState<{ _id: string; title: string; date?: string; time?: string }[]>([]);
    const [task, setTask] = useState<string>("");
    const [date, setDate] = useState<string>(""); // Added state for date
    const [time, setTime] = useState<string>(""); // Added state for time

    // Fetch tasks from the backend on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasks();
                setTodos(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // Handle adding a task
    const handleAddTask = async () => {
        if (task.trim() === "" || date.trim() === "" || time.trim() === "") {
            alert("Please fill in all fields (task, date, and time).");
            return;
        }

        try {
            const newTask = await createTask({
                title: task,
                date,
                time,
                priority: "",
                status: "",
            });
            setTodos([...todos, newTask]);
            setTask(""); // Reset task input
            setDate(""); // Reset date input
            setTime(""); // Reset time input
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // Handle deleting a task
    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <Router>
            <div className="app-container">
                <NavigationBar />
                <div className="content-container">
                    <Routes>
                        {/* Default route for To-Do list */}
                        <Route
                            path="/"
                            element={
                                <>
                                    <header className="header">
                                        <h1>PlanPal</h1>
                                    </header>
                                    <main className="main-content">
                                        <div className="task-input">
                                            <input
                                                type="text"
                                                value={task}
                                                onChange={(e) => setTask(e.target.value)}
                                                placeholder="Enter a task"
                                                className="task-input-field"
                                            />
                                            <button onClick={handleAddTask} className="add-task-button">
                                                Add Task
                                            </button>
                                        </div>
                                        <ul className="task-list">
                                            {todos.map((todo) => (
                                                <li key={todo._id} className="task-item">
                                                    {todo.title}
                                                    <button
                                                        onClick={() => handleDeleteTask(todo._id)}
                                                        className="delete-task-button"
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </main>
                                </>
                            }
                        />

                        {/* Route for To-Do List */}
                        <Route path="/Tasks" element={<ToDoPage todos={todos} setTodos={setTodos} />} />
                        
                        {/* Route for Sticky Notes */}
                        <Route path="/sticky-notes" element={<StickyNotesPage />} />
                        <Route path="/productivity" element={<ProductivityPage />} />
                        
                        {/* Route for Calendar */}
                        <Route path="/calendar" element={<Calendar events={todos} />} />
                        
                        {/* Route for Mood Tracker */}
                        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
