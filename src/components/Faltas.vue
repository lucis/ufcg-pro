<template>
  <div class="flex justify-end">
    <div class="br4 bgb pv2 ph4 flex items-center mb3">
      <span>Horas por aula: </span>
      <input class="w3 ml2 mr4" v-on:change="recalculaHoras($event)" type="text" value="2" />
      <span v-html="label"></span>
    </div>
  </div>
</template>

<script>
const getDadosFaltas = (ref = document) => {
  const [head, aluno] = [...ref.querySelectorAll('tr')]
  const { th, index } = [...head.querySelectorAll('th')].reduce((acc, cur, i) => (cur.innerText.includes('Total') ? { th: cur, index: i } : acc), { th: null, index: null })
  return { faltas: aluno.children[index].innerText, limite: th.title.split(' ')[1] }
}

export default {
  name: 'Faltas',
  data() {
    return {
      label: 'Você ainda pode faltar <b>3 aulas</b>',
      dados: null
    }
  },
  methods: {
    recalculaHoras(e) {
      const horas = parseInt(e.target.value)
      const faltas = parseInt(this.dados.faltas)
      const limite = parseInt(this.dados.limite)
      const sobra = Math.floor((limite - faltas) / horas)
      if (sobra > 0) {
        this.label = `Você ainda pode faltar <b>${sobra} ${sobra > 1 ? 'aulas' : 'aula'}</b>`
      } else if (sobra === 0) {
        this.label = `Você não pode mais faltar <b>nenhuma aula</b>`
      } else {
        this.label = `Você faltou mais que o limite`
      }
    }
  },
  mounted() {
    this.dados = getDadosFaltas()
    this.recalculaHoras({ target: { value: '2' } })
  }
}
</script>

<style></style>
