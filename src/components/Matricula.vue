<template>
  <div v-if="shouldDisplay" class="flex items-center flex-row justify-around bgb ph3 pa2 br4" style="min-height: 260px">
    <div class="w-50">
      <h3 class="text-center">Disciplinas Planejadas</h3>
      <p>Clique no botão ao lado para preencher as respectivas disciplinas. <b>Você ainda precisará enviar o formulário!</b></p>
      <ul>
        <li v-for="disciplina in planejadas">
          {{ getLabel(disciplina) }}
        </li>
      </ul>
    </div>
    <div class="w-50 flex items-center justify-center">
      <button class="btn btn-success mt3" v-on:click="marcar()">Preencher Disciplinas</button>
    </div>
  </div>
</template>

<script>
const ITEM_NAME = 'matricula'
const marcarMatricula = disciplinas => {
  ;[...document.querySelectorAll('tbody tr')].forEach(tr => {
    const id = tr.children[1]
    if (!id || !id.innerText) return
    const codigo = id.innerText
    disciplinas.forEach(disciplina => {
      if (disciplina.codigo.trim() === codigo.trim()) {
        const check = tr.querySelector('input[type=checkbox]')
        if (!check) return
        check.click()
        disciplina.marcada = true
      }
    })
  })
  return disciplinas.filter(({ marcada }) => !marcada)
}

export default {
  name: 'Matricula',
  methods: {
    marcar() {
      const erros = marcarMatricula(this.planejadas)
      if (erros.length) {
        alert(`Erro: Não foi possível marcar: ${erros.map(({ nome }) => nome).join(',')}`)
      }
    },
    getLabel({ codigo, nome }) {
      return `${codigo} - ${nome}`
    }
  },
  data: function() {
    return {
      planejadas: null,
      shouldDisplay: false
    }
  },
  mounted() {
    this.planejadas = JSON.parse(localStorage.getItem(ITEM_NAME)) || []
    this.shouldDisplay = !!this.planejadas.length
  }
}
</script>

<style scoped></style>
