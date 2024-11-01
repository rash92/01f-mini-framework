import TodoItem from "./TodoItem";
import ToggleAllContainer from "./ToggleAllContainer"
import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function ToDoList({
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