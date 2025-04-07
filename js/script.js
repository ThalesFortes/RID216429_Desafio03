const list = [
  {id:1 , task:"Implementar tela de listagem de tarefas" , tag:"frontend", create:new Date(), conclude: false},
  {id:2 , task:"Implementar protótipo da listagem de tarefas" , tag:"ux", create:new Date(), conclude: false}
]

const createButtonConclude = (lists) => {
  
  const button = document.createElement('button')
  button.className = 'button'
  button.textContent = 'Concluir'
  
  return button
}

const createTask = (list) =>{
  const taskList = document.getElementById('listContents')
  const wrapper = document.createElement('li')
  wrapper.className ='listLine'

  const div = document.createElement('div')
  div.className = 'listText'

  const description = document.createElement('p')
  description.textContent = list.task

  const tag = document.createElement('span')
  tag.textContent = list.tag
  tag.className = "tag"

  const date = document.createElement('span')
  tag.textContent = list.tag
  date.textContent = `Criado em ${dateFormat}`

  const dateFormat = list.create.toLocaleString('pt-BR');

  div.appendChild(description)
  div.appendChild(tag)
  div.appendChild(date)

  wrapper.appendChild(div)
  wrapper.appendChild(button)

  taskList .appendChild(wrapper)

  return wrapper;
}

window.onload = function(){

  list.forEach((x) =>{ 
    createTask(x)
  }) 
}