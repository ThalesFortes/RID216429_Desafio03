// Recupera tarefas do localStorage
const getTasksStorage = () => {
  const data = window.localStorage.getItem('tasks');
  if (!data || data === "undefined") return [];
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao fazer parse do localStorage:", e);
    return [];
  }
};

// Salva tarefas no localStorage
const setTasksInLocalStorage = (tasks) => {
  window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Atualiza o status (concluída ou não) de uma tarefa
const updateStatus = (taskID, status) => {
  const tasks = getTasksStorage();
  const updatedTasks = tasks.map((task) =>
    Number(task.id) === Number(taskID) ? { ...task, conclude: status } : task
  );
  setTasksInLocalStorage(updatedTasks);
  renderAllTasks(); // atualiza interface
};


//Contabiliza tarefas concluidas e pendentes
const countTasks = () => {
  const task = getTasksStorage()
  const complete = task.filter((task) => task.conclude === true)
  const pendent = task.filter((x) => x.conclude === false)
  return {complete, pendent}
}


//Cria contador de tarefas concluidas e pendentes
const createCount = () =>{
  const count = document.getElementById('counterAndRemove')
  count.innerHTML = "";

  const span = document.createElement('span')
  const {complete,pendent} = countTasks()
  span.textContent = `${complete.length} / ${pendent.length}`
  count.appendChild(span)

  return count
}

// Cria o botão de tarefa pendente
const createButtonConclude = (id) => {
  const button = document.createElement('button');
  button.className = 'button';
  button.textContent = 'Concluir';
  button.id = `taskID-${id}`;
  button.addEventListener('click', () => updateStatus(id, true));
  return button;
};

// Cria o ícone de tarefa concluída
const createCheckImage = (id) => {
  const img = document.createElement('img');
  img.src = '../assets/checkIcon.png';
  img.alt = 'Ícone de tarefa concluída';
  img.className = 'checkImg';
  img.id = `taskID-${id}`;
  img.addEventListener('click', () => updateStatus(id, false));
  return img;
};

// Cria a <li> da tarefa
const createTask = (task) => {
  const li = document.createElement('li');
  li.className = 'listLine';
  li.setAttribute("draggable", "true");
  li.setAttribute('data-id', task.id);
  li.setAttribute('data-conclude', task.conclude);
  li.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", task.id);
    li.classList.add("dragging")
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });

  const div = document.createElement('div');
  div.className = 'listText';
  if (task.conclude) div.id = "complete";

  const p = document.createElement('p');
  p.textContent = task.task;

  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = task.tag;

  const date = document.createElement('span');
  date.textContent = `Criado em ${task.create}`;

  const action = task.conclude ? createCheckImage(task.id) : createButtonConclude(task.id);

  div.appendChild(p);
  div.appendChild(tag);
  div.appendChild(date);

  li.appendChild(div);
  li.appendChild(action);

  return li;
};

// Gera um novo ID baseado no último
const newTaskId = () => {
  const tasks = getTasksStorage();
  const lastID = tasks[tasks.length - 1]?.id;
  return lastID ? lastID + 1 : 1;
};

// Cria nova tarefa e salva no localStorage
const createNewTask = (event) => {
  event.preventDefault();

  const id = newTaskId();
  const task = event.target.task.value;
  const tag = event.target.taskTag.value;
  const date = new Date().toLocaleString('pt-BR');
  const conclude = false;

  const newTask = { id, task, tag, create: date, conclude };

  const tasks = getTasksStorage();
  tasks.push(newTask);
  setTasksInLocalStorage(tasks);
  renderAllTasks();
  event.target.task.value = ""
  event.target.taskTag.value = ""
};

// Remove apenas as tarefas concluídas
const deleteTasks = () => {
  const tasks = getTasksStorage().filter((t) => !t.conclude);
  setTasksInLocalStorage(tasks);
  renderAllTasks();
};

// Quando uma tarefa é solta em uma das listas (drop)
const handleDrop = (event, targetStatus) => {
  event.preventDefault();
  const id = Number(event.dataTransfer.getData("text/plain"));

  const tasks = getTasksStorage();
  const task = tasks.find((t) => t.id === id);
  if (!task || task.conclude === targetStatus) return;

  task.conclude = targetStatus;
  setTasksInLocalStorage(tasks);
  renderAllTasks();
};

// Renderiza todas as tarefas divididas por listas
const renderAllTasks = () => {
  const pendents = document.getElementById("listPendents");
  const concludes = document.getElementById("listConcludes");

  pendents.innerHTML = "";
  concludes.innerHTML = "";

  const tasks = getTasksStorage();
  tasks.forEach((task) => {
    const element = createTask(task);
    if (task.conclude){
      concludes.appendChild(element)
    } else{
       pendents.appendChild(element);
    }    
  });
  createCount();
};


// Inicializa
window.onload = () => {
  document.getElementById("form").addEventListener("submit", createNewTask);
  document.getElementById("remove").addEventListener("click", deleteTasks);
  renderAllTasks();
};


