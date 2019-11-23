// Função que adiciona o Header responsivo na página.
function addHeader() {
  const menu = document.getElementById('menu')
  menu.style.display = 'none'

  const header = document.getElementById('header')

  const menuButton = document.createElement('div')
  menuButton.id = 'menuButton'
  menuButton.onclick = e => toggleMenu()

  const span = document.createElement('span')
  span.className = 'menu-bars'

  const b1 = document.createElement('hr')
  b1.className = 'bar'
  const b2 = document.createElement('hr')
  b2.className = 'bar'
  const b3 = document.createElement('hr')
  b3.className = 'bar'

  span.appendChild(b1)
  span.appendChild(b2)
  span.appendChild(b3)

  menuButton.appendChild(span)

  header.insertAdjacentElement('beforeend', menuButton)
}

// Função responsável por alternar a exibição do menu.
function toggleMenu() {
  const menu = document.getElementById('menu')
  const menuButton = document.getElementById('menuButton')
  const display = menu.style.display

  if (display === 'block') {
    menuButton.classList.remove('active')
    menu.style.display = 'none'
  } else {
    menuButton.classList.add('active')
    menu.style.display = 'block'
  }
}

// Remove o Header e retorna ao padrão.
function removeHeader() {
  const header = document.getElementById('header')
  const menuButton = document.getElementById('menuButton')

  header.removeChild(menuButton)

  const menu = document.getElementById('menu')
  menu.style.display = 'block'
}

// Realiza as modificações na página de acordo com o tamanho da janela.
function makeChanges() {
  if (window.innerWidth < 768 && !document.getElementById('menuButton')) {
    addHeader()
  } else if (window.innerWidth > 768 && document.getElementById('menuButton')) {
    removeHeader()
  }
}

function setHeader() {
  makeChanges()

  window.onresize = e => makeChanges()
}

export default setHeader
