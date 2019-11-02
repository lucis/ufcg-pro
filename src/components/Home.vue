<template>
  <div>
    <div class="flex justify-center mv3">
      <div class="bgb br4 brb ph4 pv2">
        <span class="alert-info">Você está utilizando o <b>UFCGPro</b>. Veja todas as <a href="#">funcionalidades</a>.</span>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <span class="text-center f3 b">Ocorrendo agora: <span class="normal">INTERCONEXÃO DE REDES</span></span>
    </div>
    <div class="flex justify-between items-center">
      <h3>Horário</h3>
      <BaixaHorario :table="tableTurmas" />
    </div>
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
import BaixaHorario from './BaixaHorario'

export default {
  name: 'Home',
  data() {
    return {
      horario: 'Carregando...',
      tableTurmas: null
    }
  },
  mounted() {
    ufcg.getPaginaHorario().then(doc => {
      const [turmas, horario] = doc.querySelectorAll('table')
      this.horario = horario.innerHTML
      this.tableTurmas = turmas
    })
  },
  components: {
    BaixaHorario
  }
}
</script>

<style></style>
