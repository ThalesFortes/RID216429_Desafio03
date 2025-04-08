const tasks = []
const getTasksStorage = () => {
  if (localStorage.getItem('tasks') === "undefined") {
    localStorage.removeItem('tasks');
  }

  const item = window.localStorage.getItem('tasks');
  if (!item || item === "undefined") {
    return [];
  }
  
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error("Erro ao fazer parse do localStorage:", e);
    return [];
  }
}


const setTasksInLocalStorage = (tasks) =>{
  window.localStorage.setItem('tasks',JSON.stringify(tasks))
}

const returnButtonConclude = (event) => {
  const [, taskID] = event.target.id.split('-'); 
  const check = event.target
  const wrapper = check.parentElement;
  const divPendent = wrapper.querySelector('.listText')
 // tasks[taskID-1].conclude = false

  //console.log(list)
  divPendent.id = ''
  const buttonNew = createButtonConclude(taskID)
  wrapper.replaceChild(buttonNew,check)
}


const checkTaskImage = (event) => {
  const [,taskID] = event.target.id.split('-')
  const button = event.target
  const wrapper = button.parentElement;
  const divPendent = wrapper.querySelector('.listText');

  // Troca o estilo
  divPendent.id = 'complete';

  const check = document.createElement('img');
  check.src = '../assets/checkIcon.png';
  check.alt = 'Ícone de tarefa concluída';
  check.className = 'checkImg'
  check.id = `taskID-${taskID}`

  //tasks[taskID-1].conclude = true

  //console.log(list)
  check.addEventListener('click', returnButtonConclude)
  // Substitui o botão pela imagem
  wrapper.replaceChild(check, button);
  
};


const createButtonConclude = (taskID) => {
  const button = document.createElement('button')
  button.className = 'button'
  button.textContent = 'Concluir'
  button.id = `taskID-${taskID}`
  button.addEventListener('click', checkTaskImage)
  
  return button
}

const createTask = (tasks) =>{
  const taskList = document.getElementById('listContents')
  const wrapper = document.createElement('li')
  wrapper.className ='listLine'

  const div = document.createElement('div')
  div.className = 'listText'

  const description = document.createElement('p')
  description.textContent = tasks.task

  const tag = document.createElement('span')
  tag.textContent = tasks.tag
  tag.className = "tag"

  const date = document.createElement('span')
  date.textContent = `Criado em ${tasks.create}`

  const button = createButtonConclude(tasks.id)
  console.log(button.id)

  div.appendChild(description)
  div.appendChild(tag)
  div.appendChild(date)

  wrapper.appendChild(div)
  wrapper.appendChild(button)

  taskList.appendChild(wrapper)

  return wrapper;
}

const newTaskId = () =>{
  const tasks = getTasksStorage();
  const lastID = tasks[tasks.length - 1]?.id
  return lastID ? lastID + 1 : 1
}

const createNewTask = (event) =>{
   event.preventDefault();
   
   const id = newTaskId()
   const task = event.target.task.value
   const tag = event.target.taskTag.value
   const date = new Date().toLocaleString('pt-BR');
   const conclude = false

   const newTask = {
    id:id,
    task:task,
    tag:tag,
    create:date,
    conclude:conclude
   }

   const currentTasks = getTasksStorage();
   currentTasks.push(newTask)
   setTasksInLocalStorage(currentTasks)
   createTask(newTask)
}


const removeTask = () => {
  const removeButton = document.getElementById('remove');
  removeButton.addEventListener('click', () => {
    setTasksInLocalStorage([]); 
    const taskList = document.getElementById('listContents');
    taskList.innerHTML = ''; 
    console.log('CLIQUE');
  });
};



window.onload = function(){
  const tasks = getTasksStorage();
  const form = document.getElementById('form');
  form.addEventListener('submit', createNewTask)


  tasks.forEach((x) =>{ 
    createTask(x)
  }) 

  removeTask();
}