// App.js (final ready version)
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState({ taskId: null, commentId: null });

  const fetchTasks = () => {
    fetch("http://127.0.0.1:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = () => {
    if (!taskTitle.trim()) return;
    if (editingTaskId) {
      fetch(`http://127.0.0.1:5000/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle }),
      }).then(() => { fetchTasks(); setTaskTitle(""); setEditingTaskId(null); });
    } else {
      fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle }),
      }).then(() => { fetchTasks(); setTaskTitle(""); });
    }
  };

  const deleteTask = (id) => { fetch(`http://127.0.0.1:5000/tasks/${id}`, { method: "DELETE" }).then(() => fetchTasks()); };
  const startEditTask = (task) => { setTaskTitle(task.title); setEditingTaskId(task.id); };

  const addComment = (taskId) => {
    if (!commentText.trim()) return;
    if (editingComment.commentId) {
      fetch(`http://127.0.0.1:5000/tasks/${editingComment.taskId}/comments/${editingComment.commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      }).then(() => { fetchTasks(); setCommentText(""); setEditingComment({ taskId: null, commentId: null }); });
    } else {
      fetch(`http://127.0.0.1:5000/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      }).then(() => { fetchTasks(); setCommentText(""); });
    }
  };

  const deleteComment = (taskId, commentId) => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}/comments/${commentId}`, { method: "DELETE" }).then(() => fetchTasks());
  };

  const startEditComment = (taskId, comment) => {
    setCommentText(comment.text);
    setEditingComment({ taskId: taskId, commentId: comment.id });
  };

  return (
    <div className="container">
      <h1>🌟 Task & Comment Management 🌟</h1>

      <div className="task-input">
        <input type="text" placeholder="Enter task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <button onClick={addTask}>{editingTaskId ? "Update Task" : "Add Task"}</button>
      </div>

      {tasks.length === 0 && <p className="empty">No tasks added yet!</p>}

      <div className="tasks">
        {tasks.map((task, index) => (
          <div key={task.id} className="card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <small>Task ID: {task.id}</small>
            </div>
            <div className="task-buttons">
              <button className="edit-btn" onClick={() => startEditTask(task)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>

            <div className="comments">
              <h4>Comments:</h4>
              {task.comments.length === 0 && <small>No comments</small>}
              {task.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <span>{comment.text} <small>(ID: {comment.id})</small></span>
                  <div>
                    <button className="edit-btn" onClick={() => startEditComment(task.id, comment)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteComment(task.id, comment.id)}>Delete</button>
                  </div>
                </div>
              ))}
              <div className="comment-input">
                <input type="text" placeholder="Add comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <button onClick={() => addComment(task.id)}>
                  {editingComment.commentId && editingComment.taskId === task.id ? "Update Comment" : "Add Comment"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
