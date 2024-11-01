import { minireact } from "./minireact/minireact.js";
import InputHeader from "./components/InputHeader.js";
import ToDoList from "./components/TodoList.js";
import ToDoListFooter from "./components/TodoListFooter.js";
import InfoFooter from "./components/InfoFooter.js";

/** @jsx minireact.createElement */
function App() {
  const [taskList, setTasklist] = minireact.useState([]);
  const [route, setRoute] = minireact.useState("all");

  const completedCount = taskList.filter((task) => !task.completed).length;

  // after url, will add detection for #/all, #/completed and #/active routes. Nothing after the url is treated as all by default.
  //routes is passed into tasklist which will decide which tasks to show based on this.
  const routes = {
    all: () => setRoute(() => "all"),
    completed: () => setRoute(() => "completed"),
    active: () => setRoute(() => "active"),
    "": () => setRoute(() => "all"),
  };

  window.onhashchange = () => minireact.routeHandler(routes);

  const toggleComplete = (id, event) => {
    event.preventDefault()
    setTasklist((taskList) =>
      taskList.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const updateTask = (id, text) => {
    setTasklist((taskList) =>
      taskList.map((task) => (task.id === id ? { ...task, task: text } : task))
    );
  };

  //route all is default for if unknown route
  const toggleAllComplete = () => {
    setTasklist((taskList) =>
      route === "active"
        ? taskList.map((task) => {
            return { ...task, completed: true };
          })
        : route === "completed"
        ? taskList.map((task) => {
            return { ...task, completed: false };
          })
        : taskList.some((task) => !task.completed)
        ? taskList.map((task) => {
            return { ...task, completed: true };
          })
        : taskList.map((task) => {
            return { ...task, completed: false };
          })
    );
  };

  const clearCompleted = () => {
    setTasklist((taskList) => [...taskList.filter((task) => !task.completed)]);
  };
  const deleteTask = (id) => {
    setTasklist((taskList) => [...taskList.filter((task) => task.id !== id)]);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      const newTask = {
        task: e.target.value,
        id: crypto.randomUUID(),
        completed: false,
      };
      setTasklist((oldArr) => [...oldArr, newTask]);
      e.target.value = "";
    }
  };

  return [
    <section id="root" className="todoapp">
      <InputHeader onEnter={handleEnter}></InputHeader>
      <ToDoList
        taskList={taskList}
        onDelete={deleteTask}
        onToggleComplete={toggleComplete}
        onToggleAll={toggleAllComplete}
        updateTask={updateTask}
        route={route}
      ></ToDoList>
      <ToDoListFooter
        taskList={taskList}
        onClear={clearCompleted}
        completedCount={completedCount}
      ></ToDoListFooter>
    </section>,
    <InfoFooter></InfoFooter>,
  ];
}

const app = <App></App>;

let container = document.body;

minireact.render(app, container);
