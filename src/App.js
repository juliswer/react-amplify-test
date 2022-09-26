import { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTask } from "./graphql/mutations";
import { listTasks } from "./graphql/queries";
import "./App.css";

function App() {
  const initialState = {
    name: "",
    description: "",
  };

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await API.graphql(
        graphqlOperation(createTask, { input: task })
      );
      if(result.data.createTask) {
        alert("Created")
      }
      setTask(initialState);
    } catch (error) {
      alert("Not Created")
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await API.graphql(graphqlOperation(listTasks));
        setTasks(result.data.listTasks.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [tasks]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        ></textarea>
        <button>Submit</button>
      </form>
      {tasks.map((task) => {
        return (
          <div key={task.id}>
            <h2>{task.name}</h2>
            <p>{task.description}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
