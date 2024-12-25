import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask } from "./api/taskApi";
import "./App.css";

const App = () => {
    const [todos, setTodos] = useState<{ _id: string; title: string; completed: boolean }[]>([]);
    const [task, setTask] = useState<string>("");

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
        if (task.trim() === "") return;

        try {
            const newTask = await createTask(task);
            setTodos([...todos, newTask]);
            setTask("");
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
        <div>
            <h1>To-Do App</h1>
            <div>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter a task"
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {todo.title}
                        <button onClick={() => handleDeleteTask(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
