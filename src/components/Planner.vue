<template>
  <div class="flex flex-row justify-around bgb ph3 pa2 br4" style="height: 260px">
    <div class="w-50">
      <h3 class="text-center">Planeje sua matrícula</h3>
      <p>Selecione na tabela as disciplinas que você planeja se matricular. Quando a matrícula for liberada, <b>você poderá selecionar as disciplinas com apenas um clique.</b></p>
      <div v-if="disciplinasMarcadas">
        <span class="f2 dark-red">Disciplinas Selecionadas</span>
        <ul>
          <li v-for="disciplina in disciplinasMarcadas">
            {{ getLabel(disciplina) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="w-50">
      <h3 class="text-center">Opções</h3>
      <ul class="list">
        <li>
          <input type="checkbox" id="cheias" v-on:change="mudou(true, $event)" />
          <label for="cheias" class="normal">
            Filtrar turmas sem vagas
          </label>
        </li>
        <li>
          <input type="checkbox" id="cursadas" v-on:change="mudou(false, $event)" />
          <label for="cursadas" class="normal">
            Filtrar turmas já cursadas
          </label>
        </li>
        <li>
          <button class="btn btn-danger btn-sm mt3" v-on:click="limpar()">
            Limpar planejamento atual
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// TODO
const verificarProblema = (cadeiras, cadeira) => {
  return null
}

const ITEM_NAME = 'matricula'
export default {
  name: 'Planner',
  methods: {
    mudou(cheias, event) {
      const { checked } = event.target
      if (cheias) {
        document.querySelectorAll('tbody tr').forEach(tr => {
          if (!tr.children[4]) return
          if (parseInt(tr.children[4].innerText.split('/')[0]) === 0) {
            tr.style.display = checked ? 'none' : ''
          }
        })
      } else {
        // TODO
        cods = []
        document.querySelectorAll('tbody tr').forEach(tr => {
          if (!tr.children[4]) return
          const cod = tr.children[1].innerText.split('-')[0].trim()
          if (cods.includes(cod)) {
            tr.style.display = checked ? 'none' : ''
          }
        })
      }
    },
    limpar() {
      localStorage.setItem(ITEM_NAME, null)
      ;[...document.querySelectorAll('.interesse')].forEach(check => {
        check.checked = false
      })
      this.atualizarState()
    },
    getLabel({ codigo, nome }) {
      return `${codigo} - ${nome}`
    },
    atualizarState() {
      const disciplinas = JSON.parse(localStorage.getItem(ITEM_NAME))
      if (!disciplinas || !disciplinas.length) {
        this.disciplinasMarcadas = null
        return
      }

      this.disciplinasMarcadas = disciplinas.sort(({ nome: a }, { nome: b }) => {
        if (a > b) {
          return 1
        }
        if (b > a) {
          return -1
        }
        return 0
      })
    }
  },
  data: function() {
    return {
      disciplinasMarcadas: null
    }
  },
  mounted() {
    this.atualizarState()
    document.addEventListener('selectCadeira', ({ detail }) => {
      const { checked, ...cadeira } = detail
      const cadeirasDB = JSON.parse(localStorage.getItem(ITEM_NAME)) || []
      const updated = checked ? [...cadeirasDB, cadeira] : cadeirasDB.filter(({ codigo }) => codigo !== cadeira.codigo)
      const problema = verificarProblema(cadeirasDB, cadeira)
      problema && alert(problema)
      localStorage.setItem(ITEM_NAME, JSON.stringify(updated))
      this.atualizarState()
    })
  }
}
</script>

<style scoped></style>
