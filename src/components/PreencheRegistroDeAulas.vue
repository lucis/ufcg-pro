<template>
  <div class="preenchedor">
    <div class="flex flex-row items-center bgb ph3 pa2 br4">
      <div class="w-60 flex flex-row items-center">
        <div class="ph2 flex flex-column items-end">
          <label for="file" class="b">Importe o registro de aulas a partir de um CSV:</label>
          <a href="#" class="black-60" v-on:click="baixarModelo()">(baixe um modelo)</a>
        </div>
        <div>
          <input type="file" id="file" v-bind:disabled="!!file" ref="file" v-on:change="handleFileUpload()" accept=".csv" />
        </div>
        <div>
          <button v-bind:disabled="!file" v-on:click="preencher()" class="btn btn-primary">Prencher</button>
        </div>
      </div>
      <div class="w-40 pt2">
        <p class="f4">
          Você deve enviar um arquivo <b>.csv</b> que tenham os cabeçalhos "data", "horas-aula" e "assunto". Você pode
          <a href="#" v-on:click="baixarModelo()">baixar um .csv</a> modelo com os registros dessa turma.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const SEP = ','

const extrairRegistros = csv => {
  const { data, errors } = Papa.parse(csv, { header: true })
  if (errors.length) {
  }
  return data
}

export default {
  name: 'PreencheRegistroDeAulas',
  methods: {
    baixarModelo() {
      const turma = document.querySelector('div.col-sm-10.col-xs-9')
      const filename = turma ? turma.innerText.replace('-', '').replace(/ /g, '') + '.csv' : 'notas.csv'

      const header = `data${SEP}horas-aula${SEP}assunto`
      const linhas = [['02/05/2022', '2', 'assunto da aula'], ['04/05/2022', '2', 'assunto da aula']]
      const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...linhas].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
    },
    handleFileUpload() {
      const self = this
      this.file = this.$refs.file.files[0]
      const reader = new FileReader()
      reader.onload = function() {
        self.content = reader.result
      }
      reader.readAsBinaryString(this.file)
    },
    preencher() {
      if (!this.content) return
      const nomesCampos = { d: 'data', h: 'horas-aula', a: 'assunto' }

      const table = document.querySelector('form table')
      const registros = extrairRegistros(this.content)

      const it = a => a.innerText
      const grouped = registros.reduce((acc, cur) => ({ ...acc, [cur.aula]: cur }), {})

      let trs = [...table.querySelectorAll('tr')]

      const tbody = table.getElementsByTagName('tbody')[0]
      const primeiraLinha = table.rows[1]
      const ultimaLinha = table.rows[table.rows.length - 1]

      table.deleteRow(table.rows.length - 1)
      let cell = table.rows.length

      while ([...table.querySelectorAll('tr')].length - 1 < registros.length) {
        const novaLinha = primeiraLinha.cloneNode(true)
        novaLinha.cells[0].innerText = cell
        tbody.appendChild(novaLinha)
        cell++
      }

      trs = [...table.querySelectorAll('tr')]

      const novaUltinhaLinha = ultimaLinha.cloneNode(true)
      tbody.appendChild(novaUltinhaLinha)

      let count = 0
      trs.forEach(tr => {
        if (count > registros.length) return
        const aula = it(tr.children[0])
        const entry = grouped[aula]

        const campos = [...tr.children].map(td => td.children[0]).filter(Boolean)

        campos.forEach((input, i) => {
          let nomeCampo = nomesCampos[input.name[0]]
          input.value = entry[nomeCampo]
        })
        count++
      })
    }
  },
  data: function() {
    return {
      file: null,
      content: null
    }
  }
}
</script>

<style scoped>
.preenchedor {
  border: 2px solid aquamarine;
  width: 800px;
  padding: 10px;
}
</style>
