
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:3000/api";

  const getTodos = async () => {
    try {
      const res = await axios.get(`${API}/get-todos`);

      const data = typeof res.data === "string"
        ? JSON.parse(res.data)
        : res.data;

      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Add or Update todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/update-todo/${editId}`, {
          name,
          text,
        });
      } else {
        await axios.post(`${API}/add-todo`, {
          name,
          text,
        });
      }

      setName("");
      setText("");
      setEditId(null);

      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit todo
  const handleEdit = (todo) => {
    setName(todo.name);
    setText(todo.text);
    setEditId(todo._id || todo.id);
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete-todo/${id}`);
      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>

      <h2>Todo App</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", width: "95%", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Enter todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ padding: "10px", width: "95%", marginBottom: "10px" }}
        />

        <button type="submit" style={{ padding: "10px 20px" }}>
          {editId ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      <hr />

      <h3>All Todos</h3>

      {todos.map((todo) => (
        <div
          key={todo._id || todo.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}
        >
          <h4>{todo.name || todo.title}</h4>
          <p>{todo.text || todo.description}</p>

          <button onClick={() => handleEdit(todo)}>
            Edit
          </button>

          <button
            onClick={() => handleDelete(todo._id || todo.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}

export default App;
