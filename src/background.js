global.browser = require('webextension-polyfill')

const injectScript = (path, tabId, external) =>
  browser.tabs.executeScript(tabId, {
    code: `if(![...document.querySelectorAll('script')].map(el => el.src).includes('${chrome.extension.getURL(
      path
    )}')) { var sc = document.body.appendChild(document.createElement('script')); sc.charset="utf-8"; sc.src='${external ? path : chrome.extension.getURL(path)}';}`
  })

const injectCSS = (path, tabId) =>
  browser.tabs.executeScript(tabId, {
    code: `if(![...document.querySelectorAll('link')].map(el => el.href).includes('${chrome.extension.getURL(
      path
    )}')) {const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = '${chrome.extension.getURL(
      path
    )}'; document.head.appendChild(link);}`
  })
const getCurrentPage = (url = '') => {
  const slots = url.split('?')
  if (url.includes('notas')) return PAGES.NOTAS
  if (url.includes('frequencia')) return PAGES.FREQUENCIA
  if (slots.length === 1) return PAGES.HOME
  const query = url.split('?').pop()
  const params = new URLSearchParams(query)
  return ('' + params.get('command')).replace('#', '') || PAGES.HOME
}

const PAGES = {
  FREQUENCIA: 'ProfessorTurmaFrequenciaEditar',
  NOTAS: 'ProfessorTurmaNotasEditar',
  OFERTADAS: 'AlunoDisciplinasOfertadas',
  HISTORICO: 'AlunoHistorico',
  HOME: 'Home',
  FALTAS: 'AlunoTurmaFrequencia',
  CURSO: 'AlunoTurmasListar',
  TURMAS: 'ProfessorTurmasListar'
}

const injectorsMap = {
  [PAGES.FREQUENCIA]: 'injectors/frequencia.js',
  [PAGES.NOTAS]: 'injectors/notas.js',
  [PAGES.OFERTADAS]: 'injectors/ofertadas.js',
  [PAGES.HISTORICO]: 'injectors/historico.js',
  [PAGES.HOME]: 'injectors/home.js',
  [PAGES.FALTAS]: 'injectors/faltas.js',
  [PAGES.CURSO]: 'injectors/curso.js',
  [PAGES.TURMAS]: 'injectors/curso.js'
}

const WHITELIST = ['localhost', 'ufcgexamples', 'pre.ufcg.edu.br:8443/ControleAcademicoOnline/']
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  const { url } = tab
  const shouldAct = WHITELIST.reduce((acc, cur) => acc || url.includes(cur), false)
  if (!shouldAct) return
  chrome.pageAction.show(tabId)

  injectCSS('ufcg_tachyons.css')
  injectScript('util.js')
  injectScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.1.0/papaparse.min.js', tabId, true)
  injectScript('https://cdn.jsdelivr.net/gh/nwcell/ics.js@0.2.0/ics.deps.min.js', tabId, true)

  const page = getCurrentPage(url)
  console.log(page)
  const shouldInject = injectorsMap[page]
  shouldInject && injectScript(shouldInject)
})
