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

  const taskElement = document.querySelector(`[data-id="${taskID}"]`);
  if (!taskElement) return;

  const targetList = status
    ? document.getElementById("listConcludes")
    : document.getElementById("listPendents");

  const updatedTask = updatedTasks.find((t) => Number(t.id) === Number(taskID));
  const newElement = createTask(updatedTask);

  taskElement.parentElement.removeChild(taskElement);
  targetList.appendChild(newElement);

  createCount();
};


//Contabiliza tarefas concluidas e pendentes
const countTasks = () => {
  const task = getTasksStorage()
  const complete = task.filter((task) => task.conclude === true)
  const pendent = task
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

// Simula envio para banco de dados (retorna uma promise)
const sendTaskToDatabase = (task) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Tarefa enviada ao banco:", task);
      resolve({ status: 200, data: task }); 
    }, 3000); 
  });
};

// Cria nova tarefa e salva no localStorage (de forma assíncrona)
const createNewTask = async (event) => {
  event.preventDefault();

  const taskInput = event.target.task;
  const tagInput = event.target.taskTag;

  const id = newTaskId();
  const task = taskInput.value;
  const tag = tagInput.value;
  const date = new Date().toLocaleString('pt-BR');
  const conclude = false;

  const newTask = { id, task, tag, create: date, conclude };

  try {
    document.getElementById('save-button').setAttribute('disabled',true)
    const response = await sendTaskToDatabase(newTask);

    if (response.status === 200) {
      const tasks = getTasksStorage();
      tasks.push(response.data);
      setTasksInLocalStorage(tasks);

      const newElement = createTask(response.data);
      document.getElementById("listPendents").appendChild(newElement);
      createCount();
      clearInputs(taskInput, tagInput);
    }
  } catch (error) {
    console.error("Erro ao enviar tarefa:", error);
    alert("Erro ao salvar tarefa. Tente novamente.");
  }
  document.getElementById('save-button').removeAttribute('disabled')
};

//Limpa os inputs
const clearInputs = (...inputs) => {
  inputs.forEach(input => input.value = "");
};


// Remove apenas as tarefas concluídas
const deleteTasks = () => {
  const tasks = getTasksStorage();

  const tasksToRemove = tasks
    .filter(task => task.conclude)
    .map(task => task.id);

  const updatedTasks = tasks.filter(task => !task.conclude);
  setTasksInLocalStorage(updatedTasks);

  tasksToRemove.forEach(id => {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.parentElement.removeChild(li);
    }
  });
  createCount();
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
  
  const oldElement = document.querySelector(`[data-id="${id}"]`);
  const newElement = createTask(task);

  if (oldElement) oldElement.parentElement.removeChild(oldElement);
  const targetList = targetStatus
    ? document.getElementById("listConcludes")
    : document.getElementById("listPendents");
  targetList.appendChild(newElement);

  createCount();
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


