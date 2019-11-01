const define = lib => {
  lib.ufcg = {}
  lib.ufcg.fetchAndParse = url =>
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('ISO-8859-1')
        return decoder.decode(buffer)
      })
      .then(content => {
        const parser = new DOMParser()
        return parser.parseFromString(content, 'text/html')
      })
  lib.ufcg.table2json = () => {
    // TODO: implementation
  }
}
if (!window.ufcg) {
  define(window)
}
