import Vue from 'vue'
import BaixaHorario from '../components/BaixaHorario'

Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  const divVue = document.createElement('div')
  divVue.id = 'inject-vue'
  const div = document.createElement('div')
  div.classList.add('flex', 'justify-between', 'flex-column-reverse')

  const h2 = document.querySelector('h2')
  const novoh2 = h2.cloneNode(true)
  novoh2.style.cssText = 'max-width: 300px;margin-top: -40px;'

  div.appendChild(novoh2)
  div.appendChild(divVue)
  h2.insertAdjacentElement('beforebegin', div)
  h2.remove()

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(BaixaHorario)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
