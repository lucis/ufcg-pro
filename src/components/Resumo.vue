<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-center">Resumo das Turmas</h3>
      <button v-on:click="switchMostrar()" class="btn btn-primary btn-sm">{{ mostrar ? 'Esconder' : 'Mostrar' }}</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered table-condensed">
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Notas</th>
            <th>Faltas/Limite</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="turma in turmas" v-bind:key="turma.cadeira">
            <td>{{ turma.cadeira }}</td>
            <td class="text-nowrap" style="min-width: 130px;">
              {{ mostrar ? turma.notas : '' }}
              <div v-if="!mostrar" style="width:108px; height: 20px; background-color: #ddd;"></div>
            </td>
            <td class="text-nowrap" style="min-width: 150px;">
              {{ mostrar ? turma.faltas : '' }}
              <div v-if="!mostrar" style="width:108px; height: 20px; background-color: #ddd;"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const getParams = url => {
  const query = url.split('?').pop()
  const params = new URLSearchParams(query)
  return {
    periodo: params.get('periodo'),
    turma: params.get('turma'),
    codigo: params.get('codigo')
  }
}

const getHorasAula = horario => {
  return horario.split('\n').length
  //TODO
}

const faltasPath = (codigo, turma) =>
  `https://pre.ufcg.edu.br:8443/ControleAcademicoOnline/Controlador?command=AlunoTurmaFrequencia&codigo=${codigo}&turma=${turma}&periodo=${ufcg.hoje.ano}.${ufcg.hoje.periodo}`

const getDisciplinas = table => {
  return [...table.querySelectorAll('tbody tr')].map(row => {
    const linkNotas = row.querySelector('a').href
    const cadeira = row.children[2].innerText
    const horasAula = getHorasAula(row.children[4].innerText)
    return {
      ...getParams(linkNotas),
      cadeira,
      linkNotas,
      horasAula
    }
  })
}

const getNotas = async disciplina => {
  const { cadeira, linkNotas } = disciplina
  const doc = await ufcg.fetchAndParse(linkNotas)
  const head = [...doc.querySelectorAll('table th')]
  const row = [...doc.querySelectorAll('tbody td')]
  const notas =
    head
      .map(th => th && th.innerText && th.innerText.includes('Nota'))
      .map((isNota, i) => isNota && row[i].innerText)
      .filter(Boolean)
      .join(' - ') || ''
  return { notas, ...disciplina }
}

const getFaltas = async disciplina => {
  const { codigo, turma } = disciplina
  const doc = await ufcg.fetchAndParse(faltasPath(codigo, turma))
  const head = [...doc.querySelectorAll('table th')]
  const row = [...doc.querySelectorAll('tbody td')]
  const { th, i } = head.reduce((acc, th, i) => {
    if (th && th.innerText && th.innerText.includes('Total')) {
      return {
        th,
        i
      }
    }
    return acc
  }, {})
  if (!th) return { disciplina }
  const faltas = row[i].innerText
  const limite = th.title && th.title.split(' ')[1]
  return { faltas, limite, ...disciplina }
}
const getNotasFaltas = async disciplinas => {
  const comNotas = await Promise.all(disciplinas.map(getNotas))
  return await Promise.all(comNotas.map(getFaltas))
}

export default {
  name: 'Resumo',
  methods: {
    switchMostrar() {
      this.mostrar = !this.mostrar
    }
  },
  mounted() {
    ;(async () => {
      const doc = await ufcg.fetchAndParse('/ControleAcademicoOnline/Controlador?command=AlunoTurmasListar')
      const disciplinas = getDisciplinas(doc.querySelector('table'))
      const turmasProcessadas = await getNotasFaltas(disciplinas)
      this.turmas = turmasProcessadas.map(turma => {
        return {
          ...turma,
          notas: turma.notas || 'Sem notas',
          faltas: `${turma.faltas} de ${turma.limite} permitidas`
        }
      })
    })()
  },
  data: function() {
    return {
      mostrar: false,
      loaded: false,
      turmas: [
        {
          cadeira: 'FUNDAMENTOS MATEMATICOS DE CIENCIA DA COMPUTAÇÃO',
          notas: '9,0 - 10,0 - 7,5',
          faltas: '5 de 7 permitidas'
        }
      ]
    }
  }
}
</script>

<style scoped>
.horario {
  width: 100%;
}
</style>
