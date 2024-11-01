import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function ToggleAllContainer({ taskList, onToggleAll, route }) {
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