<template>
  <div>
    <div class="flex justify-center mv3">
      <div class="bgb br4 brb ph4 pv2 flex flex-column items-center">
        <span style="background-image: none;" class="alert-info"
          >Você está utilizando o <b>UFCGPro</b>. Veja todas as
          <a target="_blank" class="underline" href="https://gist.github.com/luciannojunior/65d8743fb9a5759de932861a6bb5b781">funcionalidades</a>.</span
        >
        <span class="text-center f2 b mt4" v-if="!temTurmas">Parece que você está sem turmas!</span>
        <span class="text-center f2 b mt4" v-if="temTurmas" v-html="aulaAtual"></span>
      </div>
    </div>
    <div class="flex justify-between items-center" v-if="temTurmas">
      <h3>{{ horario ? 'Horário' : '' }}</h3>
      <BaixaHorario :table="tableTurmas" />
    </div>
    <table v-if="!professor && temTurmas" v-html="horario" class="table table-striped table-condensed" style="border: 1px solid rgb(221, 221, 221);"></table>
    <div class="flex justify-between">
      <div class="w-50">
        <h3>Links úteis</h3>
        <ul>
          <li>
            <a target="_blank" href="http://prefeitura.ufcg.edu.br/mapas-dos-campi">Mapas da UFCG</a>
          </li>
          <li>
            <a target="_blank" href="https://sei.ufcg.edu.br/sei/controlador_externo.php?acao=usuario_externo_logar&id_orgao_acesso_externo=0">
              SEI - Sistema de Protocolos
            </a>
          </li>
          <li>
            <a target="_blank" href="http://analytics.lsd.ufcg.edu.br/cursosufcg/#/">
              Cursos UFCG - Consulte as grades curriculares e planeje sua graduação
            </a>
          </li>
        </ul>
      </div>
      <Resumo v-if="!!tableTurmas && !professor && temTurmas" :table="tableTurmas" />
    </div>
  </div>
</template>

<script>
import BaixaHorario from './BaixaHorario'
import Resumo from './Resumo.vue'

const getNomeCadeira = tr => (ufcg.professor ? tr.children[ufcg.professor ? 1 : 2].innerText : tr.children[1].innerText.split('-')[1].trim())

const extraiCadeiras = table => {
  return [...table.querySelectorAll('tbody tr')].map(tr => {
    return {
      cadeira: getNomeCadeira(tr),
      horario: tr.children[ufcg.professor ? 3 : 4].innerText
        .split('\n')
        .filter(Boolean)
        .map(entry => {
          const [dia, slot, sala] = entry.split(' ')
          return { dia, slot, sala: sala.replace(')', '').replace('(', '') }
        })
        .reduce((acc, { dia, ...rest }) => ({ ...acc, [dia]: rest }), {})
    }
  })
}

const getAulaProxima = (table, hoje = new Date()) => {
  const cadeiras = extraiCadeiras(table)
  const dia = hoje.getDay() + 1
  const hora = hoje.getHours()
  const aulasDeHoje = cadeiras.filter(({ horario }) => horario[dia])
  if (!aulasDeHoje.length) return null
  return aulasDeHoje.reduce((acc, { cadeira, horario }) => {
    const { slot, sala } = horario[dia]
    const [inicio, fim] = slot
      .split('-')
      .map(hora => hora.slice(0, 2))
      .map(hora => parseInt(hora))
    const maisCedo = acc ? acc.inicio : 100000
    if (hora >= fim || maisCedo < inicio) return acc
    if (hora >= inicio && hora < fim) return { cadeira, sala, inicio, agora: true }
    return { cadeira, sala, inicio }
  }, null)
}

export default {
  name: 'Home',
  data() {
    return {
      horario: 'Carregando...',
      tableTurmas: null,
      aulaAtual: '',
      professor: ufcg.professor,
      temTurmas: false
    }
  },
  methods: {
    calcularAulaAtual() {
      const dataTeste = new Date()
      const aula = getAulaProxima(this.tableTurmas, dataTeste)
      if (!aula) {
        this.aulaAtual = 'Sem aulas por hoje'
      } else {
        let label = ''
        const { inicio, cadeira, sala, agora } = aula
        label += agora ? 'Ocorrendo agora: ' : `Próxima aula (${inicio}:00) : `
        label += `<span class="normal">${cadeira} - ${sala}</span>`
        this.aulaAtual = label
      }
    }
  },
  mounted() {
    ufcg.getPaginaHorario().then(doc => {
      if (!doc || !doc.querySelectorAll('table').length) {
        console.log(
          'UFCGPro: Não foi possível buscar a página de lista de turmas. Caso você tenha turmas em curso atualmente (e viu isso), abra umaissue em https://github.com/luciannojunior/ufcg-pro'
        )
        this.temTurmas = false
        return
      }
      const [turmas, horario] = doc.querySelectorAll('table')
      this.horario = ufcg.professor ? null : horario.innerHTML
      this.tableTurmas = turmas
      this.calcularAulaAtual()
    })

    setInterval(() => {
      this.calcularAulaAtual()
    }, 50000)
  },
  components: {
    BaixaHorario,
    Resumo
  }
}
</script>

<style></style>
