import { minireact } from "../minireact/minireact";

/** @jsx minireact.createElement */
export default function InfoFooter() {
  return (
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>Created by the TodoMVC Team</p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  );
}
