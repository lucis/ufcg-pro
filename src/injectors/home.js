import Vue from 'vue'
import Home from '../components/Home'

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

if (!document.querySelector('#login')) {
  const div = document.createElement('div')
  div.id = 'inject-vue'
  document.querySelector('#conteudo').appendChild(div)

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(Home)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
