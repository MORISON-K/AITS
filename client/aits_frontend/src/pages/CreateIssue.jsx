import React, { useState } from "react";

const CreateIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [error, setError] = useState("");

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation (ensure title and description are not empty)
    if (!title || !description) {
      setError("Title and Description are required!");
      return;
    }

    // Here you would typically send the issue data to your backend
    const newIssue = {
      title,
      description,
      priority,
    };

    console.log("New Issue Created:", newIssue);

    // Reset form after submission
    setTitle("");
    setDescription("");
    setPriority("Low");
    setError(""); // Clear error message if any
  };

  return (
    <div className="create-issue-container">
      <h1>Create New Issue</h1>
      {error && <div className="error-message">{error}</div>} {/* Error handling */}

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Create Issue</button>
      </form>
    </div>
  );
};

export default CreateIssue;
