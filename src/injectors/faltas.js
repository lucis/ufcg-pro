import Vue from 'vue'
import Faltas from '../components/Faltas'

Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  const div = document.createElement('div')
  div.id = 'inject-vue'
  const table = document.querySelector('.table-responsive')
  table.parentElement.insertBefore(div, table)

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(Faltas)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
