<template>
  <div>
    <div class="flex justify-center mv3">
      <div class="bgb br4 brb ph4 pv2">
        <span class="alert-info">Você está utilizando o <b>UFCGPro</b>. Veja todas as <a href="#">funcionalidades</a>.</span>
      </div>
    </div>
    <div class="flex justify-center">
      <span class="text-center f3 b">Ocorrendo agora: <span class="normal">INTERCONEXÃO DE REDES</span></span>
    </div>
    <h3>Horário</h3>
    <table v-html="horario" class="table table-striped table-condensed" style="border: 1px solid rgb(221, 221, 221);"></table>
    <div>
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
  </div>
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
