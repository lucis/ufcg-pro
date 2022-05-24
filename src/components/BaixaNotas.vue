<template>
  <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
    <a v-on:click="download" class="btn btn-primary" href="#" title="Download como CSV">Baixar notas <span class="glyphicon glyphicon-circle-arrow-down"></span></a>
  </div>
</template>

<script>
export default {
  name: 'BaixaNotas',
  data() {
    return {
      csvContent: null
    }
  },
  methods: {
    download() {
      ufcg.downloadCsv(this.csvContent, 'UFCG_notas.csv')
    },
    getNotasHeaders() {
      const table = document.querySelector('.table-responsive > table')
      const headers = [...table.querySelectorAll('th')].map(th => th.innerText).filter(h => h.includes('Nota'))

      const mapperNotas = {}
      for (let index = 0; index < headers.length; index++) {
        const header = headers[index]
        mapperNotas[header] = `nota ${index + 1}`
      }

      return mapperNotas
    }
  },
  mounted() {
    const mapperNotas = this.getNotasHeaders()
    const mapper = {
      Ordem: '',
      'M. parc.': 'media parcial',
      'E. final': 'exame final',
      'M. final': 'media final',
      'Obs.': 'obs'
    }

    Object.assign(mapper, mapperNotas)

    const config = {
      mapHeader: h => mapper[h]
    }

    const notas = ufcg.table2json(document.querySelector('.table-responsive > table'), config)

    for (let index = 0; index < notas.length; index++) {
      Object.keys(notas[index]).forEach(key => {
        if (key === 'undefined') delete notas[index][key]
      })
    }

    this.csvContent = ufcg.json2Csv(notas)
  }
}
</script>

<style></style>
