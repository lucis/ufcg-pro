<template>
  <a v-on:click="download" class="btn btn-primary" href="#" title="Download como CSV"> <span class="glyphicon glyphicon-circle-arrow-down"></span></a>
</template>

<script>
export default {
  name: 'BaixaHistorico',
  data() {
    return {
      csvContent: null
    }
  },
  methods: {
    download() {
      ufcg.downloadCsv(this.csvContent, 'UFCG_historico.csv')
    }
  },
  mounted() {
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

    const disciplinas = ufcg.table2json(document.querySelector('#disciplinas > table'), config)

    this.csvContent = ufcg.json2Csv(disciplinas)
  }
}
</script>

<style></style>
