(()=>{"use strict";const e=e=>e.startsWith("on"),t=t=>"children"!==t&&!e(t),l=(e,t)=>l=>e[l]!==t[l],o=e=>e.toLowerCase().substring(2);function n(n,a,s){var r;s?(Object.keys(a).filter(e).filter((e=>!(e in s)||l(a,s)(e))).forEach((e=>n.customRemoveEventListener(o(e),a[e]))),Object.keys(a).filter(t).filter((r=s,e=>!(e in r))).forEach((e=>{n[e]=""})),Object.keys(s).filter(t).filter(l(a,s)).forEach((e=>{n[e]=s[e]})),Object.keys(s).filter(e).filter(l(a,s)).forEach((e=>n.customAddEventListener(o(e),s[e])))):console.log("unable to update dom, nextProps passed in is: ",s)}function a(e,t){e.dom?t.removeChild(e.dom):a(e.firstChild,t)}function s(e){if(!e)return;let t=e.parent;for(;!t.dom;)t=t.parent;const l=t.dom;if("APPEND"===e.effectTag&&null!=e.dom)l.appendChild(e.dom);else if("UPDATE"===e.effectTag&&null!=e.dom)n(e.dom,e.alternate.props,e.props);else if("DELETE"===e.effectTag)return void a(e,l);s(e.firstChild),s(e.sibling)}let r=null,c=null,u=null,d=null;requestIdleCallback((function e(t){let l=!1;for(;r&&!l;)r=f(r),l=t.timeRemaining()<1;!r&&c&&(d.forEach(s),s(c.firstChild),u=c,c=null),requestIdleCallback(e)}));let p=null,m=null;function f(e){if(e&&e.type||console.log("issue performing unit of work for fiber: ",e),e.type instanceof Function?function(e){p=e,m=0,p.hooks=[];const t=[e.type(e.props)];g(e,t.flat())}(e):function(e){e.dom||(e.dom=function(e){const t="TEXT_ELEMENT"==e.type?document.createTextNode(""):document.createElement(e.type);return t.customAddEventListener=(e,l)=>{switch(e){case"click":t.onclick=l;break;case"dblclick":t.ondblclick=l;break;case"keydown":t.onkeydown=l;break;case"blur":t.onblur=l;break;case"mouseover":t.onmouseover=l;break;case"input":t.oninput=l;break;default:console.log("can't add event to listner: unknown event type")}},t.customRemoveEventListener=(e,l)=>{switch(e){case"click":t.onclick=null;break;case"dblclick":t.ondblclick=null;break;case"keydown":t.onkeydown=null;break;case"mouseover":t.onmouseover=null;break;case"input":t.oninput=null;break;default:console.log("can't remove event from listener: unknown event type to remove")}},n(t,{},e.props),t}(e)),e.props||console.log("fiber.props missing, fiber is: ",e),g(e,e.props.children.flat())}(e),e.firstChild)return e.firstChild;let t=e;for(;t;){if(t.sibling)return t.sibling;t=t.parent}}function g(e,t){let l=null,o=0,n=e.alternate&&e.alternate.firstChild;for(;o<t.length||null!=n;){const a=t[o];let s=null;const r=n&&a&&a.type==n.type;r&&(s={type:n.type,props:a.props,dom:n.dom,parent:e,alternate:n,effectTag:"UPDATE"}),a&&!r&&(s={type:a.type,props:a.props,dom:null,parent:e,alternate:null,effectTag:"APPEND"}),n&&!r&&(n.effectTag="DELETE",d.push(n)),n&&(n=n.sibling),0===o?e.firstChild=s:a&&(l.sibling=s),l=s,o++}}const k=function(e,t){for(var l=arguments.length,o=new Array(l>2?l-2:0),n=2;n<l;n++)o[n-2]=arguments[n];return{type:e,props:{...t,children:o.map((e=>"object"==typeof e?e:{type:"TEXT_ELEMENT",props:{nodeValue:e,children:[]}}))}}},h=function(e,t){c={dom:t,props:{children:[e]},alternate:u},d=[],r=c},b=function(e){const t=p.alternate&&p.alternate.hooks&&p.alternate.hooks[m],l={state:t?t.state:e,queue:[]};return(t?t.queue:[]).forEach((e=>{l.state=e(l.state)})),p.hooks.push(l),m++,[l.state,e=>{l.queue.push(e),c={dom:u.dom,props:u.props,alternate:u},r=c,d=[]}]},T=function(e){let t=window.location.hash.slice(2),l=!1;for(let o in e)t===o&&(e[o](),l=!0);l||console.log("route not found")};function v(e){let{onEnter:t}=e;return k("header",{className:"header"},k("h1",null,"todos"),k("div",{className:"input-container"},k("input",{id:"todo-input",className:"new-todo",type:"text",placeholder:"What needs to be done?",value:"",onKeyDown:t,autofocus:!0})))}function y(e){let{taskList:t,onToggleAll:l,route:o}=e;const n="completed"===o?t.filter((e=>e.completed)):"active"===o?t.filter((e=>!e.completed)):t;return 0===n.length?(console.log("detecting zero length list: ",n,"current route: ",o),null):(console.log("detected nonzero length list: ",n,"on route: ",o),k("div",{className:"toggle-all-container"},k("input",{className:"toggle-all"},"toggle complete"),k("label",{className:"toggle-all-label",htmlfor:"toggle-all",onClick:l},"Toggle All Input")))}function E(e){let{taskList:t,onDelete:l,onToggleComplete:o,updateTask:n,route:a,onToggleAll:s}=e;return console.log("tasklist: ",t,"route: ",a),"completed"===a?k("main",{className:"main"},k(y,{taskList:t,onToggleAll:s,route:a}),k("ul",{className:"todo-list"},t.filter((e=>e.completed)).map(((e,t)=>k(C,{task:e,onToggleComplete:o,onDelete:l,updateTask:n}))))):"active"===a?k("main",null,k(y,{taskList:t,onToggleAll:s,route:a}),k("ul",{className:"todo-list"},t.filter((e=>!e.completed)).map(((e,t)=>k(C,{task:e,onToggleComplete:o,onDelete:l,updateTask:n}))))):"all"===a?k("main",null,k(y,{taskList:t,onToggleAll:s,route:a}),k("ul",{className:"todo-list"},t.map(((e,t)=>k(C,{task:e,onToggleComplete:o,onDelete:l,updateTask:n}))))):k("main",{className:"main"},k("div",null,"unknown route"))}function C(e){let{task:t,onToggleComplete:l,onDelete:o,updateTask:n}=e;const[a,s]=b(!1),r=t.task,c=t.id,i=t.completed,u=e=>{"Enter"===e.key&&(n(c,e.target.value),s((e=>!1))),"Escape"===e.key&&s((e=>!1))},d=k("div",{className:"view"},k("input",{className:"toggle",type:"checkbox",onClick:()=>{l(c)},checked:i}),k("label",{for:"",onDblclick:()=>{s((e=>!0))},onKeyDown:u},r),k("button",{className:"destroy",onClick:()=>o(c)})),p=k("div",null,k("input",{id:"todo-edit",className:"edit",onKeyDown:u,label:"Edit Todo Input",defaultValue:r,onBlur:e=>{s((e=>!1))}}));return k("li",{className:[a?"editing":"",i?"completed":""].join(" ")},a?p:d)}function N(e){let{onClear:t,completedCount:l,taskList:o}=e;return 0===o.length?null:k("footer",{className:"footer"},k("span",{className:"todo-count"},l," item",1===o.length?"":"s"," left"),k("ul",{className:"filters"},k("li",null,k("a",{href:"#/all"},"all")),k("li",null,k("a",{href:"#/active"},"active")),k("li",null,k("a",{href:"#/completed"},"completed"))),o.some((e=>e.completed))?k("button",{className:"clear-completed",onClick:t},"Clear Completed"):null)}const w=k("footer",{className:"info"},k("p",null,"Double-click to edit a todo"),k("p",null,"Created by the TodoMVC Team"),k("p",null,"Part of ",k("a",{href:"http://todomvc.com"},"TodoMVC")));h(k((function(){const[e,t]=b([]),[l,o]=b("all"),n=e.filter((e=>!e.completed)).length,a={all:()=>o((()=>"all")),completed:()=>o((()=>"completed")),active:()=>o((()=>"active")),"":()=>o((()=>"all"))};return window.onhashchange=()=>T(a),[k("section",{id:"root",className:"todoapp"},k(v,{onEnter:e=>{if("Enter"===e.key){const l={task:e.target.value,id:crypto.randomUUID(),completed:!1};t((e=>[...e,l])),e.target.value=""}}}),k(E,{taskList:e,onDelete:e=>{t((t=>[...t.filter((t=>t.id!==e))]))},onToggleComplete:e=>{t((t=>t.map((t=>t.id===e?{...t,completed:!t.completed}:t))))},onToggleAll:()=>{t((e=>e.some((e=>!e.completed))?e.map((e=>({...e,completed:!0}))):e.map((e=>({...e,completed:!1})))))},updateTask:(e,l)=>{t((e=>e.map((e=>e.id===i?{...e,task:l}:e))))},route:l}),k(N,{taskList:e,onClear:()=>{e.filter((e=>e.completed)),t((e=>[...e.filter((e=>!e.completed))]))},completedCount:n})),w]}),null),document.body)})();