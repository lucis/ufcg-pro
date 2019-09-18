<template>
  <div id="app">
    <h1>Chamada{{ finalizada ? ' finalizada' : '' }}</h1>
    <span v-if="!finalizada">
      Aluno atual:
      <b>{{ nomesAlunos[alunoAtual] }}</b>
    </span>
    <p v-if="!finalizada">Digite ESPA&cedil;O para marcar falta ou D/Seta Direita para passar</p>
  </div>
</template>

<script>
const ESPACO = 32
const SETA_DIREITA = 39
const TECLA_D = 68

const getAbreviacao = nome => {
  const nomes = nome
    .toUpperCase()
    .split(' ')
    .filter(part => part.length > 2)
  const final = [nomes[0]]
  if (nomes.length >= 3) final.push(nomes[1][0] + '.')
  final.push(nomes.pop())
  return final.join(' ')
}
const table2json = (table, config) => {
  const ths = table.querySelectorAll('th')
  if (!ths || (!ths.length && !config.headers)) {
    throw new Error('Please provide header values if not in the table')
  }
  const preheaders = ths ? [...table.querySelectorAll('th')].map(th => th.innerText) : config.headers
  const headers = config.firstHeader ? [config.firstHeader, ...preheaders.splice(1)] : preheaders
  const trs = table.querySelectorAll('tr')
  const entries = [...trs].splice(1)
  return entries.reduce((acc, current) => {
    if (!current.children) return acc
    return [...acc, [...current.children].reduce((acc, current, index) => ({ ...acc, [headers[index]]: current.innerText }), {})]
  }, [])
}
export default {
  name: 'Chamada',
  computed: {
    alunos: function() {
      // MOCK
      const tabelaAlunos = document.querySelector('table')
      const config = {
        headers: undefined,
        mapHeader: a => a,
        filterLine: a => true
      }
      return table2json(tabelaAlunos, config).map(({ Disciplina }) => ({ nome: Disciplina }))
    },
    finalizada: function() {
      return this.alunoAtual === this.nomesAlunos.length - 1
    },
    nomesAlunos: function() {
      const nomes = this.alunos && this.alunos.map(({ nome }) => nome.toUpperCase())
      const nomeAcc = nomes.reduce((acc, nome) => {
        const primeiroNome = nome.split(' ')[0]
        if (!acc[primeiroNome]) {
          acc[primeiroNome] = 0
        }
        acc[primeiroNome]++
        return acc
      }, {})
      return nomes.map(nome => {
        const primeiroNome = nome.split(' ')[0]
        if (nomeAcc[primeiroNome] === 1) {
          return primeiroNome
        } else {
          return getAbreviacao(nome)
        }
      })
    }
  },
  data() {
    return {
      alunoAtual: 0
    }
  },
  mounted() {
    let self = this

    // TODO: Please come up with a one-listener-only solution, Mr.
    window.addEventListener('keydown', function(ev) {
      self.handleBtn(ev)
    })

    window.addEventListener('keypress', ev => {
      if (ev.keyCode === ESPACO) {
        ev.stopPropagation()
        ev.preventDefault()
      }
    })
  },
  methods: {
    handleBtn(e) {
      switch (e.keyCode) {
        case ESPACO:
          // MOCK
          console.log('Faltou: ', this.alunos[this.alunoAtual])
          this.alunoAtual++
          break
        case SETA_DIREITA:
        case TECLA_D:
          this.alunoAtual++
          break
        default:
          break
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  border: 2px solid #069;
}
</style>
