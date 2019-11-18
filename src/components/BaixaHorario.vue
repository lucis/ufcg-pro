<template>
  <button class="btn btn-primary" v-on:click="exportarHorario()" v-bind:disabled="!this.tableTurmas">
    Exportar Horário
    <span class="glyphicon glyphicon-circle-arrow-down"></span>
  </button>
</template>

<script>
// Extraído de https://stackoverflow.com/a/54437356/6732300
const getProximoDiaDaSemana = (dayNumber, excludeToday = true, refDate = new Date()) => {
  const dayMap = {
    2: 'Mon',
    3: 'Tue',
    4: 'Wed',
    5: 'Thu',
    6: 'Fri'
  }
  const dayName = dayMap[dayNumber]
  if (!dayName) return
  const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(dayName.slice(0, 3).toLowerCase())
  if (dayOfWeek < 0) return
  refDate.setHours(0, 0, 0, 0)
  refDate.setDate(refDate.getDate() + !!excludeToday + ((dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7))
  return refDate
}

const getFimPeriodo = () => {
  // TODO: Receber isso do componente ou ver uma maneira mais inteligente de fazer isso.
  const { periodo, ano } = ufcg.hoje
  const date = new Date()
  date.setFullYear(ano)
  date.setDate('15') // just because
  date.setMonth(periodo == '1' ? 5 : 11)
  return date
}

const getTableTurmas = async () => {
  const doc = await ufcg.getPaginaHorario()
  return doc && doc.querySelectorAll('table')[0]
}

const getNomeDisciplina = tr => {
  const text = tr.children[1].innerText
  if (ufcg.professor) return text
  return text.split(' - ')[1]
}
// Lembrar que essa não é a tabela Turmas em Curso, mas sim a tabela de horário
const getTurmas = ref => {
  return [...ref.querySelectorAll('tbody tr')].map(tr => {
    return {
      cadeira: getNomeDisciplina(tr),
      horario: tr.children[ufcg.professor ? 3 : 4].innerText
        .split('\n')
        .filter(Boolean)
        .map(entry => {
          const [dia, slot, sala] = entry.split(' ')
          return {
            dia: dia.trim(),
            slot: slot.trim(),
            sala: sala
              .trim()
              .replace(')', '')
              .replace('(', '')
          }
        })
        .reduce((acc, { dia, ...rest }) => {
          if (!acc[dia]) acc[dia] = []
          acc[dia].push(rest)
          return acc
        }, {})
    }
  })
}
const montaICS = table => {
  const cadeiras = getTurmas(table)
  const cal = ics()
  const fimPeriodo = getFimPeriodo()
  cadeiras.forEach(({ horario, cadeira }) => {
    Object.keys(horario).forEach(dia => {
      const slots = horario[dia]
      slots.forEach(({ slot, sala }) => {
        const [inicio, fim] = slot.split('-')
        const proximaData = getProximoDiaDaSemana(dia).toLocaleDateString('en-US')
        const begin = `${proximaData} ${inicio}`
        const end = `${proximaData} ${fim}`
        cal.addEvent(cadeira, 'Aula', sala, begin, end, { freq: 'WEEKLY', until: fimPeriodo })
      })
    })
  })
  cal.download('horario.csv')
}

const irParaAjuda = () => {
  const win = window.open('https://gist.github.com/luciannojunior/1243ac0bd195647141c7d7f5d3f2691a', '_blank')
  win.focus()
}
export default {
  name: 'BaixaHorario',
  props: ['table'],
  data() {
    return {
      turmas: [],
      tableTurmas: null
    }
  },
  methods: {
    exportarHorario() {
      montaICS(this.tableTurmas)
      irParaAjuda()
    }
  },
  mounted() {
    if (this.table) {
      this.tableTurmas = this.table
    } else {
      const table = document.querySelector('table')
      const ths = table && table.querySelectorAll('th')
      const temTabela = ths && [...ths].some(th => th.innerText.includes('Disciplina'))
      if (temTabela) {
        this.tableTurmas = table
      } else {
        // TODO: Não funciona pra professores (não sei se precisa)
        getTableTurmas().then(table => {
          this.tableTurmas = table
        })
      }
    }
  }
}
</script>

<style></style>
