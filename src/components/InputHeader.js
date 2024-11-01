import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function InputHeader({ onEnter }) {
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