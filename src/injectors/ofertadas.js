import Vue from 'vue'
import Planner from '../components/Planner'
const montarCheckboxes = (ref = document) => {
  // O componente deve preencher isso para comunicação com os checkboxes
  const turmas = JSON.parse(localStorage.getItem('matricula')) || []
  const hasTurma = id => turmas.map(({ codigo }) => codigo).includes(id)
  const th = document.createElement('th')
  th.classList.add('text-center')
  th.innerText = 'Interesse'
  ref.querySelector('thead tr').appendChild(th)
  ;[...ref.querySelectorAll('tbody tr')].forEach(tr => {
    const td = document.createElement('td')
    td.classList.add('flex')
    td.classList.add('justify-center')
    const check = document.createElement('input')
    check.type = 'checkbox'
    check.id = tr.children[1].innerText.trim()
    check.classList.add('interesse')
    check.checked = hasTurma(check.id)
    td.appendChild(check)
    check.addEventListener('change', ({ srcElement: { checked } }) => {
      document.dispatchEvent(
        new CustomEvent('selectCadeira', {
          detail: {
            checked,
            codigo: tr.children[1].innerText.trim(),
            nome: tr.children[2].innerText.trim(),
            horario: tr.children[3].innerText.trim()
          }
        })
      )
    })
    tr.appendChild(td)
  })
}
Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  montarCheckboxes()
  const div = document.createElement('div')
  div.id = 'inject-vue'

  document.querySelector('#conteudo').insertBefore(div, document.querySelector('#conteudo').firstChild)
  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(Planner)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
