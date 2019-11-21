# UFCGPro

A extensão da Controle Acadêmico da Universidade Federal de Campina Grande.

<img src="https://raw.githubusercontent.com/luciannojunior/ufcg-pro/master/media/logo.png?s=10" width="200" />

## Instalação

Você pode instalar a extensão de duas maneiras:

1. **[WIP]** ~Baixando e instalando a extensão na [Chrome Web Store]()~
2. Seguindo os passos da última [release](https://github.com/luciannojunior/ufcg-pro/releases) para a instalação manual.
3. Para o Firefox, acesse [este link](https://ufcgprodist.now.sh/ufcgpro-1.0.4-an+fx.xpi) - arquivo assinado junto com a Mozilla.

_Obs:_ O processo de review da loja de extensões do Chrome pode demorar semanas, e **esta extensão ainda não foi aprovada.**

## Funcionalidades

- O UFCGPro oferece várias funcionalidades para alunos e professores usuários do Controle Acadêmico da Universidade Federal de Campina Grande. Para saber mais detalhes destas funcionalidades e como usá-las veja [este documento](https://gist.github.com/luciannojunior/65d8743fb9a5759de932861a6bb5b781)

## Contribuir

- Ficarei muito feliz se você puder **melhorar este projeto**, pode ser reportando problemas pela sessão Issues ou enviando um Pull Requests

## Desenvolvendo

1. Você deve ter instalado o `Node.js` e preferencialmente o Google Chrome
2. Clone este repositório e rode `yarn && yarn watch:dev` na sua pasta. (Se você usa `npm` rode `npm install && npm run watch:dev`
3. Siga as mesmas instruções [deste guia](https://github.com/luciannojunior/ufcg-pro/releases), só que agora selecione a pasta `dist` que foi criada no repositório (se tudo deu certo no passo 2)
4. Olhe o arquivo `background.js` que você vai ter uma boa ideia de como tudo funciona. Eu uso o Vue.js para criar as interfaces, mas não deve ser difícil usar qualquer outra coisa (só configurar o `webpack.config.js`)
