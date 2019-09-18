import Vue from 'vue'
import App from './App'
import store from '../store'
global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

const div = document.createElement('div')
div.id = 'inject-vue'

document.querySelector('#conteudo').insertBefore(div, document.querySelector('#conteudo').firstChild)

/* eslint-disable no-new */
new Vue({
  el: '#inject-vue',
  store,
  render: h => h(App)
})
