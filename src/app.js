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

function ToggleAllContainer({ taskList, onToggleAll, route }) {
  const veiwedList =
    route === "completed"
      ? taskList.filter((task) => task.completed)
      : route === "active"
      ? taskList.filter((task) => !task.completed)
      : taskList;

  if (veiwedList.length === 0) {
    return null;
  }

  return (
    <div className="toggle-all-container">
      <input className="toggle-all">toggle complete</input>
      <label
        className="toggle-all-label"
        htmlfor="toggle-all"
        onClick={onToggleAll}
      >
        Toggle All Input
      </label>
    </div>
  );
}

//toggle all container stuff needs to be redone, also possibly better way than if statement with 3 returns?
function ToDoList({
  taskList,
  onDelete,
  onToggleComplete,
  updateTask,
  route,
  onToggleAll,
}) {
  if (route === "completed") {
    return (
      <main className="main">
        <ToggleAllContainer
          taskList={taskList}
          onToggleAll={onToggleAll}
          route={route}
        ></ToggleAllContainer>
        <ul className="todo-list">
          {taskList
            .filter((task) => task.completed)
            .map((task) => (
              <TodoItem
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                updateTask={updateTask}
              ></TodoItem>
            ))}
        </ul>
      </main>
    );
  }
  if (route === "active") {
    return (
      <main className="main">
        <ToggleAllContainer
          taskList={taskList}
          onToggleAll={onToggleAll}
          route={route}
        ></ToggleAllContainer>
        <ul className="todo-list">
          {taskList
            .filter((task) => !task.completed)
            .map((task) => (
              <TodoItem
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                updateTask={updateTask}
              ></TodoItem>
            ))}
        </ul>
      </main>
    );
  }
  if (route === "all") {
    return (
      <main className="main">
        <ToggleAllContainer
          taskList={taskList}
          onToggleAll={onToggleAll}
          route={route}
        ></ToggleAllContainer>
        <ul className="todo-list">
          {taskList.map((task) => (
            <TodoItem
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              updateTask={updateTask}
            ></TodoItem>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="main">
      <div>unknown route</div>
    </main>
  );
}

function TodoItem({ task, onToggleComplete, onDelete, updateTask }) {
  const [editing, setEditing] = minireact.useState(false);

  const onDblclick = () => {
    setEditing((old) => true);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      updateTask(task.id, e.target.value);
      setEditing((old) => false);
    }
    if (e.key === "Escape") {
      setEditing((old) => false);
    }
  };
  const onBlur = (e) => {
    setEditing((old) => false);
  };

  const viewingItem = (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={task.completed}
        onClick={(event) => {
          onToggleComplete(task.id, event);
        }}
      ></input>
      <label for="" onDblclick={onDblclick} onKeyDown={onKeyDown}>
        {task.task}
      </label>
      <button className="destroy" onClick={() => onDelete(task.id)}></button>
    </div>
  );

  const editingItem = (
    <div>
      <input
        id="todo-edit"
        className="edit"
        onKeyDown={onKeyDown}
        label="Edit Todo Input"
        defaultValue={task.task}
        onBlur={onBlur}
      ></input>
    </div>
  );

  return (
    <li
      className={[editing ? "editing" : "", task.completed ? "completed" : ""].join(
        " "
      )}
    >
      {editing ? editingItem : viewingItem}
    </li>
  );
}

function ToDoListFooter({ onClear, completedCount, taskList }) {
  if (taskList.length === 0) {
    return null;
  }
  return (
    <footer className="footer">
      <span className="todo-count">
        {completedCount} item{taskList.length === 1 ? "" : "s"} left
      </span>
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
      {taskList.some((task) => task.completed) ? (
        <button className="clear-completed" onClick={onClear}>
          Clear Completed
        </button>
      ) : null}
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
