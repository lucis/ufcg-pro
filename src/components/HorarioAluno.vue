<template>
  <button v-on:click="alteraTabela" class="btn btn-primary" href="#">Alterar visualização</button>
</template>

<script>
const adicionaHeads = (table, headers) => {
  let thead = table.createTHead()
  let row = thead.insertRow()
  for (let key of headers) {
    let th = document.createElement('th')
    let text = document.createTextNode(key)
    th.appendChild(text)
    row.appendChild(th)
  }
}

const adicionaHorarios = (table, horarios) => {
  for (let index = 0; index < horarios.length; index++) {
    let row = table.insertRow()
    const element = horarios[index]
    let cell = row.insertCell()
    let text = document.createTextNode(element)
    cell.appendChild(text)
  }
}

const adicionarDemaisColunas = (table, disciplinas, config) => {
  let valoresTabela = ufcg.table2json(table, config)

  valoresTabela = valoresTabela.map(a => {
    return { horario: a.horario, seg: '', ter: '', qua: '', qui: '', sex: '' }
  })

  preencheDiasDaSemana(disciplinas)
  atualizaValoresDaTabela(disciplinas, valoresTabela)
  addDisciplinasNaTabela(table, valoresTabela)
}

const preencheDiasDaSemana = disciplinas => {
  const dias = ['seg', 'ter', 'qua', 'qui', 'sex']

  disciplinas = disciplinas.map(d => {
    dias.forEach(dia => {
      if (!d.hasOwnProperty(dia)) d[dia] = ''
    })
    return d
  })

  return disciplinas
}

const atualizaValoresDaTabela = (disciplinas, valoresTabela) => {
  for (let index = 0; index < disciplinas.length; index++) {
    const disciplina = disciplinas[index]
    const index = valoresTabela.findIndex(object => {
      return object.horario === disciplina.horario
    })

    for (let key in disciplina) {
      if (valoresTabela[index][key] != disciplina[key]) {
        valoresTabela[index][key] = disciplina[key]
      }
    }
  }
}

const addDisciplinasNaTabela = (table, valoresTabela) => {
  for (let index = 0; index < valoresTabela.length; index++) {
    let row = table.rows[index + 1]
    const element = valoresTabela[index]
    for (let key in element) {
      if (key != 'horario') {
        let cell = row.insertCell()
        let text = document.createTextNode(element[key])
        cell.appendChild(text)
      }
    }
  }
}

export default {
  name: 'HorarioAluno',
  data() {
    return {
      csvContent: null,
      tabelaMelhorada: null,
      alterarVisualizacao: false
    }
  },
  methods: {
    alteraTabela() {
      this.alterarVisualizacao = !this.alterarVisualizacao
      if (this.alterarVisualizacao) {
        let tbl = document.getElementById('tabela-melhorada')
        tbl.style.display = 'table'

        const tableOriginal = document.querySelectorAll('.table-responsive > table')[1]
        tableOriginal.style.display = 'none'
      } else {
        let tbl = document.getElementById('tabela-melhorada')
        tbl.style.display = 'none'

        const tableOriginal = document.querySelectorAll('.table-responsive > table')[1]
        tableOriginal.style.display = 'table'
      }
    }
  },
  mounted() {
    const mapper = {
      '': 'horario',
      'Segunda-feira': 'seg',
      'Terça-feira': 'ter',
      'Quarta-feira': 'qua',
      'Quinta-feira': 'qui',
      'Sexta-feira': 'sex'
    }

    const config = {
      mapHeader: h => mapper[h]
    }

    const disciplinas = ufcg.table2json(document.querySelectorAll('.table-responsive > table')[1], config)

    const table = document.createElement('table')
    table.setAttribute('id', 'tabela-melhorada')

    table.classList.add('table', 'table-striped', 'table-bordered', 'table-condensed')

    const headers = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']
    const horarios = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00']
    adicionaHorarios(table, horarios)
    adicionaHeads(table, headers)
    adicionarDemaisColunas(table, disciplinas, config)

    table.style.display = 'none'

    const div = document.querySelectorAll('.table-responsive')[1]
    div.appendChild(table)
  }
}
</script>

<style></style>
