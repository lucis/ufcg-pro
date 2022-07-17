<template>
  <div class="flex flex-row justify-around bgb ph3 pa2 br4" style="min-height: 260px;">
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
          <input type="checkbox" id="nao-cursadas" v-on:change="getDisciplinasNaoCursadas($event)" />
          <label for="nao-cursadas" class="normal">
            Filtrar turmas não cursadas
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
const getCadeirasCursadas = async () => {
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
  return ufcg.table2json(doc.querySelector('table'), config)
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
          if (parseInt(tr.children[4].innerText.split('/')[0]) !== 0) {
            tr.style.display = checked ? 'none' : ''
          }
        })
      } else {
        const cods = this.cursadas.map(({ id }) => id)
        document.querySelectorAll('tbody tr').forEach(tr => {
          if (!tr.children[4]) return
          const cod = tr.children[1].innerText.split('-')[0].trim()
          if (!cods.includes(cod)) {
            tr.style.display = checked ? 'none' : ''
          }
        })
      }
    },
    getDisciplinasNaoCursadas(event) {
      const { checked } = event.target
      const cods = this.cursadas.map(({ id }) => id)
      document.querySelectorAll('tbody tr').forEach(tr => {
        if (!tr.children[4]) return
        const cod = tr.children[1].innerText.split('-')[0].trim()
        if (cods.includes(cod)) {
          tr.style.display = checked ? 'none' : ''
        }
      })
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
    },
    verificarProblema(cadeiras, cadeira) {
      if (
        this.cursadas
          .filter(({ situacao }) => ['Aprovado', 'Dispensa'].includes(situacao))
          .map(({ id }) => id)
          .includes(cadeira.codigo.split('-')[0].trim())
      ) {
        return 'Você já cursou essa cadeira'
      }
      const slots = cadeira.horario.split('\n').map(word => word.slice(0, 4))
      const [match] = cadeiras.filter(({ horario }) => {
        return slots.some(slot => horario.includes(slot))
      })
      if (match) {
        return `Essa cadeira tem conflito de horário com ${match.nome}`
      }
    }
  },
  data: function() {
    return {
      disciplinasMarcadas: null,
      cursadas: null
    }
  },
  mounted() {
    getCadeirasCursadas().then(cadeiras => {
      this.cursadas = cadeiras
    })
    this.atualizarState()
    document.addEventListener('selectCadeira', ({ detail }) => {
      const { checked, ...cadeira } = detail
      const cadeirasDB = JSON.parse(localStorage.getItem(ITEM_NAME)) || []
      const updated = checked ? [...cadeirasDB, cadeira] : cadeirasDB.filter(({ codigo }) => codigo !== cadeira.codigo)
      const problema = this.verificarProblema(cadeirasDB, cadeira)
      checked && problema && alert(problema)
      localStorage.setItem(ITEM_NAME, JSON.stringify(updated))
      this.atualizarState()
    })
  }
}
</script>

<style scoped></style>
