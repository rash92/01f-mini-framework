import { minireact } from "./minireact/minireact.js";

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

  const toggleComplete = (id) => {
    setTasklist((taskList) =>
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  //function needs to be redone, this is not what other examples are actually doing.
  const toggleAllComplete = () => {
    setTasklist((taskList) =>
      taskList.map((task) => {
        return { ...task, completed: !task.completed };
      })
    );
  };

  const clearCompleted = () => {
    const completedTasks = taskList.filter((task) => task.completed);
    console.log(
      "before full task list: ",
      taskList,
      "completed tasklist: ",
      completedTasks
    );
    setTasklist((taskList) => [...taskList.filter((task) => !task.completed)]);
    console.log(
      "after full task list: ",
      taskList,
      "completed tasklist: ",
      completedTasks
    );
  };
  const deleteTask = (id) => {
    setTasklist((taskList) => [...taskList.filter((task) => task.id !== id)]);
  };

  //redo to handle counting total completed with callback function passed in?
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
        route={route}
      ></ToDoList>
      <ToDoListFooter
        onClear={clearCompleted}
        completedCount={completedCount}
      ></ToDoListFooter>
    </section>,
    infoFooter,
  ];
}

function InputHeader({ onEnter }) {
  return (
    <header className="header">
      <h1>todos</h1>
      <div className="input-container">
        <input
          id="todo-input"
          className="new-todo"
          type="text"
          placeholder="What needs to be done?"
          value=""
          onKeyDown={onEnter}
          autofocus
        ></input>
      </div>
    </header>
  );
}

//toggle all container stuff needs to be redone, also possibly better way than if statement with 3 returns?
function ToDoList({
  taskList,
  onDelete,
  onToggleComplete,
  onEsc,
  route,
  onToggleAll,
}) {
  if (route === "all") {
    return (
      <main className="main">
        <div className="toggle-all-container">
          <input className="toggle-all">
            toggle complete
          </input>
          <label className="toggle-all-label" htmlfor="toggle-all" onClick={onToggleAll}>Toggle All Input</label>
        </div>
        <ul className="todo-list">
          {taskList.map((item, index) => (
            <TodoItem
              completed={item.completed}
              id={item.id}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              text={item.task}
            ></TodoItem>
          ))}
        </ul>
      </main>
    );
  }
  if (route == "completed") {
    return (
      <main className="main">
        <div className="toggle-all-container">
          <input className="toggle-all">
            toggle complete
          </input>
          <label className="toggle-all-label" htmlfor="toggle-all" onClick={onToggleAll}>Toggle All Input</label>
        </div>
        <ul className="todo-list">
          {taskList
            .filter((task) => task.completed)
            .map((item, index) => (
              <TodoItem
                completed={item.completed}
                id={item.id}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                text={item.task}
              ></TodoItem>
            ))}
        </ul>
      </main>
    );
  }
  if (route === "active") {
    return (
      <main className="main">
        <div className="toggle-all-container">
          <input className="toggle-all">
            toggle complete
          </input>
          <label className="toggle-all-label" htmlfor="toggle-all" onClick={onToggleAll}>Toggle All Input</label>
        </div>
        <ul className="todo-list">
          {taskList
            .filter((task) => !task.completed)
            .map((item, index) => (
              <TodoItem
                completed={item.completed}
                id={item.id}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                text={item.task}
              ></TodoItem>
            ))}
        </ul>
      </main>
    );
  }
}

function TodoItem({ text, id, onToggleComplete, onDelete, completed }) {
  const [editing, setEditing] = minireact.useState(false);
  const onDblclick = () => {
    console.log("double click detected on item with id: ", id);
    setEditing((old) => true);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("enter key detected in: ", id);
      setEditing((old) => false);
    }
    if (e.key === "Escape") {
      console.log("esc key detected on item with id: ", id);
    }
  };

  const viewingItem = (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        onClick={() => {
          onToggleComplete(id);
        }}
        checked={completed}
      ></input>
      <label for="" onDblclick={onDblclick} onKeyDown={onKeyDown}>
        To do item id: {id}: {text},{" "}
      </label>
      <button className="destroy" onClick={() => onDelete(id)}></button>
    </div>
  );

  const editingItem = (
    <div className="view">
      <input
        onKeyDown={onKeyDown}
        label="Edit Todo Input"
        defaultValue={text}
      ></input>
    </div>
  );

  return <li>{editing ? editingItem : viewingItem}</li>;
}

function ToDoListFooter({ onClear, completedCount }) {
  return (
    <footer className="footer">
      <span className="todo-count">{completedCount} items left</span>
      <ul className="filters">
        <li>
          <a href="#/all">all</a>
        </li>
        <li>
          <a href="#/active">active</a>
        </li>
        <li>
          <a href="#/completed">completed</a>
        </li>
      </ul>
      <button className="clear-completed" onClick={onClear}>
        Clear Completed
      </button>
    </footer>
  );
}
const infoFooter = (
  <footer className="info">
    <p>Double-click to edit a todo</p>
    <p>Created by the TodoMVC Team</p>
    <p>
      Part of <a href="http://todomvc.com">TodoMVC</a>
    </p>
  </footer>
);

const app = <App></App>;

let container = document.body;

minireact.render(app, container);
