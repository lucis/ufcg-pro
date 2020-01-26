import Vue from 'vue'
import Matricula from '../components/Matricula'

Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  const div = document.createElement('div')
  div.id = 'inject-vue'

  document.querySelector('#conteudo').insertBefore(div, document.querySelector('#conteudo').firstChild)
  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(Matricula)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
