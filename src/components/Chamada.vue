<template>
  <div class="flex flex-column items-center br4 bgb pv4">
    <h1 class="mb2 mt0">Chamada{{ finalizada ? ' finalizada' : ' interativa' }}</h1>
    <div v-if="finalizada" class="flex flex-row justify-center">
      <button v-on:click="recomecar()" v-bind:disabled="alunoAtual === 0">
        Recomeçar
      </button>
    </div>
    <div class="black-60 f4 pv2 ph3 flex justify-between" style="width: 50vw" v-if="!finalizada">
      <div class="di" v-if="!finalizada">
        <span>Aula: </span>
        <select v-model="aulaSelecionada">
          <option v-for="aulita in aulas" v-bind:value="aulita.aula" v-bind:key="aulita.aula">
            {{ aulita.dia }}
          </option>
        </select>
      </div>
      <div class="di">
        <span
          >Aluno <b>{{ alunoAtual + 1 }}</b> de <b>{{ alunos.length }}</b></span
        >
      </div>
      <div class="di">
        <button v-on:click="recomecar()" v-bind:disabled="alunoAtual === 0">
          Recomeçar
        </button>
      </div>
      <div class="di w-50 text-center">
        <div v-if="ultimaAcao" class="di">
          <span>
            <b>Última Ação:</b>
            {{ ultimaAcao.acao }} em {{ ultimaAcao.nome.split(' ')[0] }}
          </span>
        </div>
        <div v-if="!ultimaAcao" class="di">
          Nenhuma ação realizada
        </div>
      </div>
    </div>
    <div style="width: 40vw" class="flex">
      <span v-if="!finalizada" class="f1 mr3">
        Aluno atual:
      </span>
      <b class="f1"> {{ nomesAlunos[alunoAtual] }}</b>
    </div>
    <p class="black-60 pa0 ma0" v-if="!finalizada"><b>Dica: </b> Utilize os atalhos de teclado descritos abaixo!</p>
    <div v-if="!finalizada">
      <table class="table table-bordered ma0">
        <tbody>
          <tr>
            <th scope="row">
              Ação:
            </th>
            <td>
              <div class="flex justify-center">
                <button v-bind:disabled="alunoAtual <= 0" v-on:click="reduce('VOLTAR')" class="btn btn-sm btn-primary">
                  Voltar
                </button>
              </div>
            </td>
            <td class="justify-center">
              <div class="flex justify-center">
                <button v-on:click="reduce('FALTA')" class="btn btn-sm btn-danger">
                  Marcar Falta
                </button>
              </div>
            </td>
            <td class="justify-center">
              <div class="flex justify-center">
                <button v-on:click="reduce('JUSTIFICATIVA')" class="btn btn-sm btn-warning">
                  Justificativa
                </button>
              </div>
            </td>
            <td class="justify-center">
              <div class="flex justify-center">
                <button v-on:click="reduce('PRESENÇA')" class="btn btn-sm btn-success">
                  Presente
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">Atalho:</th>
            <td class="text-center">Seta Esquerda/B</td>
            <td class="text-center">F</td>
            <td class="text-center">J</td>
            <td class="text-center">Espaço/Seta Direita</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const ESPACO = 32
const SETA_DIREITA = 39
const SETA_ESQUERDA = 37
const TECLA_F = 70
const TECLA_f = TECLA_F + 32
const TECLA_J = 74
const TECLA_j = TECLA_J + 32
const TECLA_B = 66
const TECLA_b = TECLA_B + 32

const getAulas = ths =>
  [...ths]
    .map(th => (th.innerText || '').split('\n'))
    .filter(texts => texts.length === 2)
    .map(([aula, dia]) => ({ aula, dia }))

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

const getAlunos = table => {
  const trs = table.querySelectorAll('tr')
  const it = a => a.innerText
  return [...trs].splice(1).map(tr => {
    const matricula = it(tr.children[1])
    const nome = it(tr.children[2])
    return {
      nome,
      matricula
    }
  })
}
function removeAcentos(strAccents) {
  var strAccents = strAccents.split('')
  var strAccentsOut = new Array()
  var strAccentsLen = strAccents.length
  var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
  var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'
  for (var y = 0; y < strAccentsLen; y++) {
    if (accents.indexOf(strAccents[y]) != -1) {
      strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1)
    } else {
      strAccentsOut[y] = strAccents[y]
    }
  }
  strAccentsOut = strAccentsOut.join('')
  return strAccentsOut
}

const HOMOFONOS = {
  anna: 'ana',
  cayo: 'caio',
  kaio: 'caio',
  kayo: 'caio',
  mateus: 'matheus',
  tiago: 'thiago',
  vitor: 'victor',
  artur: 'arthur',
  davi: 'david',
  elena: 'helena',
  sophia: 'sofia',
  deborah: 'debora',
  isabella: 'isabela',
  lukas: 'lucas',
  camilla: 'camila',
  kamila: 'camila',
  kamyla: 'camila',
  camyla: 'camila',
  laurah: 'laura',
  jonata: 'jonatas',
  jhonata: 'jonatas',
  johnatan: 'jonatas',
  jonathan: 'jonatas',
  jonathas: 'jonatas',
  isabelly: 'isabele',
  isabely: 'isabele'
}

/**
 * Trata nomes homófonos. Deve ser chamado apenas com o primeiro nome do aluno.
 */
const normalizarNome = (nome = '') => {
  const minusculo = nome.trim().toLowerCase()
  const nomeFinal = removeAcentos(minusculo)
  return HOMOFONOS[nomeFinal] || nomeFinal
}

export default {
  name: 'Chamada',
  computed: {
    alunos: function() {
      return getAlunos(document.querySelector('table'))
    },
    finalizada: function() {
      return this.alunoAtual === this.nomesAlunos.length
    },
    nomesAlunos: function() {
      const nomes = this.alunos && this.alunos.map(({ nome }) => nome.toUpperCase())
      const nomeAcc = nomes.reduce((acc, nome) => {
        const primeiroNome = nome.split(' ')[0]
        const nomeNormal = normalizarNome(primeiroNome)
        if (!acc[nomeNormal]) {
          acc[nomeNormal] = 0
        }
        acc[nomeNormal]++
        return acc
      }, {})
      return nomes.map(nome => {
        const primeiroNome = nome.split(' ')[0]
        const nomeNormal = normalizarNome(primeiroNome)
        if (nomeAcc[nomeNormal] === 1) {
          return primeiroNome
        } else {
          return getAbreviacao(nome)
        }
      })
    }
  },
  data() {
    return {
      alunoAtual: 0,
      aulaSelecionada: '',
      aulas: [],
      ultimaAcao: null
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

    this.aulas = getAulas(document.querySelectorAll('table th'))
    this.aulaSelecionada = this.aulas[this.aulas.length - 1].aula
  },
  methods: {
    recomecar() {
      this.alunoAtual = 0
      this.ultimaAcao = null
    },
    reduce(action) {
      const active = document.activeElement
      if (active.nodeName === 'INPUT') {
        return
      }
      if (active.nodeName !== 'BODY') {
        active.blur()
      }
      if (this.finalizada) {
        return
      }
      const matricula = this.alunos[this.alunoAtual].matricula
      const nome = this.alunos[this.alunoAtual].nome
      const input = document.querySelector(`input[name=f${this.aulaSelecionada}_${matricula}]`)
      if (!input) {
        this.alunoAtual++
        return console.log(`Não encontrado input do aluno com matrícula ` + matricula)
      }
      switch (action) {
        case 'VOLTAR':
          this.alunoAtual > 0 && this.alunoAtual--
          break
        case 'PRESENÇA':
          input.value = ''
          this.ultimaAcao = {
            acao: action,
            nome
          }
          this.alunoAtual++
          break
        case 'JUSTIFICATIVA':
          input.value = 'J'
          this.ultimaAcao = {
            acao: action,
            nome
          }
          this.alunoAtual++
          break
        case 'FALTA':
          input.value = 'F'
          this.ultimaAcao = {
            acao: action,
            nome
          }
          this.alunoAtual++
          break
        default:
          break
      }
    },
    handleBtn(e) {
      switch (e.keyCode) {
        case TECLA_F:
        case TECLA_f:
          this.reduce('FALTA')
          break
        case TECLA_J:
        case TECLA_j:
          this.reduce('JUSTIFICATIVA')
          break
        case SETA_DIREITA:
        case ESPACO:
          this.reduce('PRESENÇA')
          break
        case SETA_ESQUERDA:
        case TECLA_B:
        case TECLA_b:
          this.reduce('VOLTAR')
          break
        default:
          break
      }
    }
  }
}
</script>

<style></style>
