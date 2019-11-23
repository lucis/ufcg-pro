import Vue from 'vue'
import Home from '../components/Home'
import setHeader from './header'

Vue.prototype.$browser = global.browser

const isHome = !!document.querySelector('div.col-sm-3')
if (!document.querySelector('#login') && isHome) {
  setHeader()

  const conteudo = document.querySelector('#conteudo')
  const div = document.createElement('div')
  div.id = 'inject-vue'
  conteudo.appendChild(div)

  Vue.config.devtools = process.env.NODE_ENV === 'development'

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#inject-vue',
    render: h => h(Home)
  })

  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
