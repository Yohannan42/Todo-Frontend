import React, { useEffect, useState } from "react";
import { getTasks } from "../../api/taskApi";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import "./StickyNotesPage.css";

const StickyNotesPage = () => {
  const [tasks, setTasks] = useState<{ _id: string; title: string; date?: string; priority?: string; status?: string }[]>([]);

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Handle drag-and-drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; // If dropped outside the list, do nothing

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1); // Remove task from its original position
    reorderedTasks.splice(result.destination.index, 0, movedTask); // Insert task at the new position

    setTasks(reorderedTasks); // Update the state with reordered tasks
    console.log("Drag result:", result); // Debug
  if (!result.destination) return;
  console.log("Valid drag result");
  };

  return (
    <div className="sticky-notes-container">
      <header className="header">
        <h1>Sticky Notes</h1>
        <p>Organize your tasks visually!</p>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sticky-notes-grid">
          {(provided) => (
            <div
              className="sticky-notes-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      className="sticky-note"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h3>{task.title}</h3>
                      {task.date && <p>Due: {task.date}</p>}
                      {task.priority && <p>Priority: {task.priority}</p>}
                      {task.status && <p>Status: {task.status}</p>}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default StickyNotesPage;