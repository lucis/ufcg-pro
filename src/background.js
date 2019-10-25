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
const getCurrentPage = url => {
  if (!url || !url.split('?')) return null
  const query = url.split('?').pop()
  const params = new URLSearchParams(query)
  return params.get('command')
}

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (~tab.url.indexOf('localhost') || ~tab.url.indexOf('pre.ufcg.edu.br:8443/ControleAcademicoOnline/')) {
    chrome.pageAction.show(tabId)

    injectCSS('ufcg_tachyons.css')
    injectScript('util.js')
    injectScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.1.0/papaparse.min.js', tabId, true)
    // injectScript('popup/popup.js')

    //TESTES
    if (tab.url.includes('frequencia')) {
      console.log('Injetor de frequência')
      injectScript('injectors/frequencia.js')
      // injectScript('home.js')
    } else if (tab.url.includes('notas')) {
      console.log('Injetor de notas')
      injectScript('injectors/notas.js')
    }
    //ENDTESTES
    // switch (getCurrentPage(tab.url)) {
    //   case 'Home':
    //   case '':
    //   case null:
    //     injectScript('home.js')
    //     break
    //   default:
    //     break
    // }
  }
})