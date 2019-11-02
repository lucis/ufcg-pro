<template>
  <table v-html="horario" class="table table-striped table-bordered table-condensed ma4"></table>
</template>

<script>
const getHorario = async () => {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const periodo = hoje.getMonth() > 6 ? 2 : 1
  const doc = await ufcg.fetchAndParse(`/ControleAcademicoOnline/Controlador?command=AlunoHorarioConfirmar&ano=${ano}&periodo=${periodo}`)
  return doc.querySelectorAll('table')[1].innerHTML
}
export default {
  name: 'Home',
  data() {
    return {
      horario: 'Carregando...'
    }
  },
  methods: {
    download() {
      ufcg.downloadCsv(this.csvContent, 'UFCG_historico.csv')
    }
  },
  mounted() {
    getHorario().then(html => {
      console.log(html)
      this.horario = html
    })
  }
}
</script>

<style></style>
