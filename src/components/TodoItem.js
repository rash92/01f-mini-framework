import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function TodoItem({ task, onToggleComplete, onDelete, updateTask }) {
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