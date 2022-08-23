global.browser = require('webextension-polyfill')

const injectScript = (path, tabId, external) => {
  const src = external ? path : browser.extension.getURL(path)
  browser.tabs.executeScript(tabId, {
    code: `if(![...document.querySelectorAll('script')].map(el => el.src).includes('${src}')) {
              var sc = document.body.appendChild(document.createElement('script')); sc.charset="utf-8"; sc.src='${src}';}`
  })
}

const injectCSS = (path, tabId) => {
  const src = browser.extension.getURL(path)
  browser.tabs.executeScript(tabId, {
    code: `if(![...document.querySelectorAll('link')].map(el => el.href).includes('${src}')) {const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = '${src}'; document.head.appendChild(link);}`
  })
}

const getCurrentPage = (url = '') => {
  const slots = url.split('?')
  if (url.includes('notas')) return PAGES.NOTAS
  if (url.includes('frequencia')) return PAGES.FREQUENCIA
  if (url.includes('Matricula')) return PAGES.MATRICULA
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
  TURMAS: 'ProfessorTurmasListar',
  MATRICULA: 'TODO-PaginaDeMatricula',
  NOTAS_ALUNO: 'AlunoTurmaNotas',
  REGISTRO_AULAS: 'ProfessorTurmaAulasEditar',
  HORARIO_ALUNO: 'AlunoHorarioConfirmar'
}

const injectorsMap = {
  [PAGES.FREQUENCIA]: 'injectors/frequencia.js',
  [PAGES.NOTAS]: 'injectors/notas.js',
  [PAGES.OFERTADAS]: 'injectors/ofertadas.js',
  [PAGES.HISTORICO]: 'injectors/historico.js',
  [PAGES.HOME]: 'injectors/home.js',
  [PAGES.FALTAS]: 'injectors/faltas.js',
  [PAGES.CURSO]: 'injectors/curso.js',
  [PAGES.TURMAS]: 'injectors/curso.js',
  [PAGES.MATRICULA]: 'injectors/matricula.js',
  [PAGES.NOTAS_ALUNO]: 'injectors/notas_aluno.js',
  [PAGES.REGISTRO_AULAS]: 'injectors/registro_aulas.js',
  [PAGES.HORARIO_ALUNO]: 'injectors/horario_aluno.js'
}

const cssMap = {
  [PAGES.HOME]: 'styles/home.css'
}

const WHITELIST = ['ufcgexamples', 'pre.ufcg.edu.br:8443/ControleAcademicoOnline/']
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  const { url } = tab
  const shouldAct = url && WHITELIST.some(allowed => url.includes(allowed)) && changeInfo.status === 'complete'
  if (!shouldAct) return

  injectCSS('ufcg_tachyons.css')
  injectScript('util.js')
  // Inject external dependencies: papaparse for CSV parsing and ics.js for .ics files generation
  injectScript('papaparse.js')
  injectScript('ics.js')

  const page = getCurrentPage(url)

  const shouldInject = injectorsMap[page]
  const shouldInjectCss = cssMap[page]

  shouldInject && injectScript(shouldInject)
  shouldInjectCss && injectCSS(shouldInjectCss)
})
