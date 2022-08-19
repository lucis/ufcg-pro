import Vue from 'vue'
import HorarioAluno from '../components/HorarioAluno'

Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  const div = document.createElement('div')
  div.id = 'inject-vue'
  const divBtn = document.querySelectorAll('.hidden-print')[5]
  divBtn.appendChild(div)

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(HorarioAluno)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
