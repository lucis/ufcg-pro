<template>
  <div class="preenchedor">
    <div class="flex flex-row items-center bgb ph3 pa2 br4">
      <div class="w-60 flex flex-row items-center">
        <div class="ph2 flex flex-column items-end">
          <label for="file" class="b">Importe notas a partir de um CSV:</label>
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
          Você deve enviar um arquivo <b>.csv</b> que tenham os cabeçalhos "matricula" ou "nome", para identificar os alunos e, para as notas: "nota1", "nota2", "nota3", ... e
          "final" (não necessariamente todas). Você pode <a href="#" v-on:click="baixarModelo()">baixar um .csv</a> modelo com os alunos dessa turma.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const SEP = ','

const quantasNotas = row => [...row.querySelectorAll('th')].map(th => th.innerText).reduce((count, text) => count + (text.includes('Nota') ? 1 : 0), 0)

const arrayOf = n => [...Array(n).keys()]

const getLinhaAluno = (row, notas) => {
  const tds = row.querySelectorAll('td')
  const it = el => el.innerText
  const extractFromInput = td => `"${td.querySelector('input').value}"`
  const linhaNotas = arrayOf(notas).map((_, i) => extractFromInput(tds[i + 3]))
  return [it(tds[1]), it(tds[2]), ...linhaNotas].join(SEP) + SEP
}

const extrairNotas = csv => {
  const { data, errors } = Papa.parse(csv, { header: true })
  if (errors.length) {
  }
  return data
}

export default {
  name: 'PreencheNotas',
  methods: {
    baixarModelo() {
      const turma = document.querySelector('div.col-sm-10.col-xs-9')
      const filename = turma ? turma.innerText.replace('-', '').replace(/ /g, '') + '.csv' : 'notas.csv'
      const table = document.querySelector('table')
      const trs = table.querySelectorAll('tr')
      const nNotas = quantasNotas(trs[0])
      const header = `matricula${SEP}nome${SEP}${arrayOf(nNotas)
        .map((_, i) => `nota${i + 1}`)
        .join(SEP)}${SEP}final`
      const linhasNotas = [...trs].splice(1).map(tr => getLinhaAluno(tr, nNotas))
      const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...linhasNotas].join('\n')
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
      const SEM_NOTA = 'SEM_NOTA'
      const SUBS = 'SUBS'

      const table = document.querySelector('form table')
      const notas = extrairNotas(this.content)
      const erros = []
      const it = a => a.innerText
      const grouped = notas.reduce((acc, cur) => ({ ...acc, [cur.matricula || cur.nome]: cur }), {})
      const trs = [...table.querySelectorAll('tr')]
      trs.forEach(tr => {
        const matricula = it(tr.children[1])
        const nome = it(tr.children[2])
        const entry = grouped[matricula] || grouped[nome]
        if (!entry) {
          return erros.push({ type: SEM_NOTA, aluno: nome })
        }
        const { nota1 = '', nota2 = '', nota3 = '', final = '' } = entry
        const getIn = a => a.querySelector('input')
        const getFinal = tr => [...tr.querySelectorAll('input')].filter(({ id }) => id && id.includes('f_'))[0]
        const camposNotas = [...tr.children]
          .map(td => td.children[0])
          .filter(Boolean)
          .filter(maybeInput => maybeInput.id && maybeInput.id[0] === 'n')
        const campos = [...camposNotas, getFinal(tr)]
        const preparaNota = nota => (nota ? nota.replace('.', ',') : '')
        campos.forEach((input, i) => {
          if (input.value) {
            erros.push({ type: SUBS, aluno: nome })
          }
          let nomeNota = 'nota'
          try {
            nomeNota += input.id
              .split('_')[0]
              .split('')
              .splice(1)
          } catch (e) {
            nomeNota += i + 1
          }
          if (input.id[0] === 'f') {
            nomeNota = 'final'
          }
          input.value = entry[nomeNota]
        })
      })
      this.erros = erros
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
