import Vue from 'vue'
import Chamada from '../components/Chamada'

console.log('Nada me consola')

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

const div = document.createElement('div')
div.id = 'inject-vue'

document.querySelector('#conteudo').insertBefore(div, document.querySelector('#conteudo').firstChild)
Vue.config.devtools = process.env.NODE_ENV === 'development'
/* eslint-disable no-new */
const app = new Vue({
  el: '#inject-vue',
  render: h => h(Chamada)
})

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
