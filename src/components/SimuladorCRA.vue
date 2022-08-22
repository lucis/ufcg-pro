<template>
  <div class="bgb ph3 pa2 br4 flex flex-column items-center">
    <div class="w-40 pt2">
      <p class="f4">
        Para fazer uma simulação do seu <b>cra</b> você deve inserir no(s) input(s) abaixo sua possível média final. Em seguida, clique em <b>calcular</b>, então você poderá
        visualizar quanto será seu <b>cra</b> caso você tire as médias estimadas.
      </p>
    </div>

    <h3 class="text-center">Simule seu CRA</h3>

    <ul class="flex flex-column">
      <div v-for="(d, index) in this.disciplinas" v-bind:key="d.nome">
        <li class="flex flex-column">
          <div class="flex items-center justify-between">
            <span class="col">{{ d.nome }}</span>
            <input v-model="disciplinas[index].nota" class="col form-control w-20 mr3" placeholder="8.0" />
          </div>
        </li>
      </div>
      <button class="btn btn-primary mr3 self-end mt3 w-20-ns" v-on:click="simularCRA()">Calcular</button>
    </ul>

    <div class="mr1 mt1">
      <p class="f3 fw9">CRA atual: {{ (totalNotasXCreditos / totalCreditos).toFixed(2) }}</p>
      <p class="f3 fw9">CRA simulado: {{ craSimulado.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>
const getNotasECreditos = async () => {
  const doc = await ufcg.fetchAndParse('/ControleAcademicoOnline/Controlador?command=AlunoHistorico')
  const mapper = {
    'Carga horária': 'ch',
    Créditos: 'cr',
    Código: 'id',
    Disciplina: 'nome',
    Período: 'periodo',
    Situação: 'situacao',
    Tipo: 'tipo',
    Média: 'nota'
  }

  const config = {
    mapHeader: h => mapper[h]
  }
  const table = ufcg.table2json(doc.querySelector('table'), config)
  return table
}

export default {
  name: 'SimuladorCRA',
  data() {
    return {
      exibirSimulador: false,
      craSimulado: 0,
      totalCreditos: null,
      totalNotasXCreditos: null,
      disciplinas: []
    }
  },
  methods: {
    simularCRA() {
      const totalCreditos = this.disciplinas.map(d => d.cr).reduce((acc, c) => acc + c)
      const notasXCreditos = this.disciplinas.map(d => parseInt(d.nota) * d.cr)

      const totalNotasXCreditos = notasXCreditos.reduce((acc, v) => acc + v)
      this.craSimulado = (this.totalNotasXCreditos + totalNotasXCreditos) / (this.totalCreditos + totalCreditos)
    },

    setExibirSimulador() {
      this.exibirSimulador = !this.exibirSimulador
    }
  },
  mounted() {
    getNotasECreditos().then(cadeiras => {
      const cursadas = cadeiras.filter(c => c.situacao != 'Em Curso')
      this.disciplinas = cadeiras
        .filter(c => c.situacao == 'Em Curso')
        .map(c => {
          return { nome: c.nome.split('\n')[1].trim(), cr: parseInt(c.cr), nota: 0 }
        })

      const creditos = cursadas.map(c => parseInt(c.cr))
      const notas = cursadas.map(c => {
        const nota = c.nota.split('\n')[0]
        return parseFloat(nota.replace(',', '.'))
      })
      const notasXCreditos = notas.map((n, i) => n * creditos[i])

      this.totalCreditos = creditos.reduce((acc, v) => acc + v)
      this.totalNotasXCreditos = notasXCreditos.reduce((acc, v) => acc + v)
    })
  }
}
</script>

<style></style>
