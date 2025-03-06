import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTasks, createTask, deleteTask } from "../../api/taskApi";
import "./ToDoPage.css";
import axios from "axios";
import gsap from "gsap";

interface Task {
  _id: string;
  title: string;
  date?: string;
  priority?: string;
  status?: string;
}

interface ToDoPageProps {
  todos: Task[];
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
}

const ToDoPage: React.FC<ToDoPageProps> = ({ todos, setTodos }) => {
  
  const [task, setTask] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<string>("Medium");
  const [status, setStatus] = useState<string>("Pending");
  const [filterParams, setFilterParams] = useState({
    dueDateRange: "", // ✅ Ensures it's never undefined
    priority: "",
    status: "",
    search: "",
  });
  
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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
  

  
  const handleAddTask = async () => {
    if (!task.trim() || !date) {
        alert("Please fill in all fields (task and date).");
        return;
    }

    try {
        const formattedDate = date.toISOString().split("T")[0];
        const newTask = await createTask({ 
            title: task, 
            date: formattedDate, 
            time: "", 
            priority,  // Ensure priority is sent
            status     // Ensure status is sent
        });

        setTodos([...todos, newTask]);
        setTask("");
        setDate(null);
        setPriority("Medium"); // Reset to default
        setStatus("Pending");  // Reset to default
        setShowModal(false);
    } catch (error) {
        console.error("Error creating task:", error);
    }
};

const handleDeleteTask = async (id: string | null) => {
  if (!id) return;

  try {
      await deleteTask(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      console.log("Task deleted successfully:", id);
  } catch (error) {
      console.error("Error deleting task:", error);
  }
};

  const handleEditTask = (taskId: string) => {
    const taskToEdit = todos.find((todo) => todo._id === taskId);
    if (taskToEdit) {
        console.log("Editing task:", taskToEdit); // Debugging log

        setTask(taskToEdit.title);
        setDate(taskToEdit.date ? new Date(taskToEdit.date) : null);
        setPriority(taskToEdit.priority || "Medium");
        setStatus(taskToEdit.status || "Pending");
        setEditTaskId(taskId);
        setShowEditModal(true);
    }
};


  const handleSaveEditTask = async () => {
    if (!task.trim() || !date || !editTaskId) {
        alert("Please fill in all fields (task and date).");
        return;
    }

    try {
        const formattedDate = date.toISOString().split("T")[0]; // Format date
        const updatedTask = { title: task, date: formattedDate, priority, status };

        console.log("Sending update request:", updatedTask); // Debugging log

        const response = await axios.put(`http://localhost:5002/api/tasks/${editTaskId}`, updatedTask);

        console.log("Update response:", response.data); // Debugging log

        // ✅ Update the UI state with the edited task
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo._id === editTaskId ? { ...todo, ...updatedTask } : todo
            )
        );

        // ✅ Reset fields after saving
        setTask("");
        setDate(null);
        setPriority("Medium");
        setStatus("Pending");
        setEditTaskId(null);
        setShowEditModal(false);
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to save changes. Please check the console for more details.");
    }
};


const handleFilterTasks = async () => {
  console.log("Filter Params Before Sending:", filterParams); // Debugging log

  if (filterParams.dueDateRange) {
      const dates = filterParams.dueDateRange.split(",");
      console.log("Start Date:", dates[0], "End Date:", dates[1]);
  }

  try {
      const response = await axios.get("http://localhost:5002/api/tasks/filters", {
          params: {
              priority: filterParams.priority || "",
              status: filterParams.status || "",
              search: filterParams.search || "",
              dueDateRange: filterParams.dueDateRange || "",
          },
      });

      console.log("Filtered Tasks Response:", response.data);
      setTodos(response.data);
  } catch (error) {
      console.error("Error filtering tasks:", error);
      alert("Failed to apply filters. Check the console for details.");
  }
};




  return (
    <div className="todo-container">
      <header className="header">
        <h1>PlanPal</h1>
      </header>

      <div className="task-input">
        <input
          type="text"
          value={task}
          onClick={() => setShowModal(true)}
          placeholder="Enter a task"
          className="task-input-field"
          readOnly
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Task</h2>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter a task"
              className="modal-input"
            />
            <DatePicker
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="modal-input"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="modal-input"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="modal-input"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleAddTask} className="add-task-button">
                Add Task
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Edit task title"
              className="modal-input"
            />
          <DatePicker
  selected={date}
  onChange={(date: Date | null) => setDate(date)}
  dateFormat="yyyy-MM-dd"
  placeholderText="Select a date"
  className="modal-input"
/>


            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="modal-input"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="modal-input"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleSaveEditTask} className="add-task-button">
                Save Changes
              </button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filter-button-container">
        <button
          className="toggle-filter-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filter-section">
          <h3>Filter Tasks</h3>
          <div className="filter-controls">
            <label>Due Date Range:</label>
            <div>
            <DatePicker
  selected={
    filterParams.dueDateRange &&
    filterParams.dueDateRange.split(",")[0] &&
    !isNaN(new Date(filterParams.dueDateRange.split(",")[0]).getTime())
      ? new Date(filterParams.dueDateRange.split(",")[0])
      : null
  }
  onChange={(date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setFilterParams((prev) => ({
        ...prev,
        dueDateRange: `${date.toISOString().split("T")[0]},${prev.dueDateRange.split(",")[1] || ""}`,
      }));
    }
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="Start Date"
/>
<DatePicker
  selected={
    filterParams.dueDateRange &&
    filterParams.dueDateRange.split(",")[1] &&
    !isNaN(new Date(filterParams.dueDateRange.split(",")[1]).getTime())
      ? new Date(filterParams.dueDateRange.split(",")[1])
      : null
  }
  onChange={(date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setFilterParams((prev) => ({
        ...prev,
        dueDateRange: `${prev.dueDateRange.split(",")[0] || ""},${date.toISOString().split("T")[0]}`,
      }));
    }
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="End Date"
/>
            </div>

            <label>Priority:</label>
            <select
              value={filterParams.priority}
              onChange={(e) => setFilterParams((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label>Status:</label>
            <select
              value={filterParams.status}
              onChange={(e) => setFilterParams((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>

            <label>Search:</label>
            <input
              type="text"
              value={filterParams.search}
              onChange={(e) => setFilterParams((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search tasks"
            />

            <button onClick={handleFilterTasks} className="filter-button">
              Apply Filters
            </button>
          </div>
        </div>
      )}

<ul className="task-list">
  {todos.map((todo) => (
    <li key={todo._id} className="task-item">
      <div>
        <strong>{todo.title}</strong>
        <p>Due Date: {todo.date}</p>
        <p>Priority: {todo.priority}</p>
        <p>Status: {todo.status}</p>
      </div>
      <div className="task-actions">
        <button onClick={() => handleEditTask(todo._id)} className="edit-task-button">
          Edit
        </button>
        <button
  onClick={() => {
    setTaskToDelete(todo._id);
    setShowDeleteModal(true);
  }}
  className="delete-task-button"
>
  Delete
</button>
      </div>
    </li>
  ))}
</ul>
{showDeleteModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this task?</p>
          <div className="modal-buttons">
            <button
              onClick={() => {
                handleDeleteTask(taskToDelete);
                setShowDeleteModal(false);
              }}
              className="delete-task-button"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );

  {}
  
};

export default ToDoPage;
