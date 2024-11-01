import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function ToDoListFooter({ onClear, completedCount, taskList }) {
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