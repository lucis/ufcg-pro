# UFCGPro
A extensão da Controle Acadêmico da Universidade Federal de Campina Grande.

_Esta extensão foi desenvolvida em um Trabalho de Conclusão de Curso da graduação de Ciência da Computação na Universidade Federal de Campina Grande com orientação do professor [Matheus Gaudencio](https://github.com/matheusgr). Agradeço imensamente a todos os professores e funcionários que mantém este curso no mais alto padrão do ensino brasileiro!_

<img src="https://raw.githubusercontent.com/luciannojunior/ufcg-pro/master/media/logo.png?s=10" width="200" />

## Instalação

No momento, esta extensão dá suporte aos seguintes navegadores: 

### Google Chrome
Você pode instalar a extensão de duas maneiras:

1. Baixando e instalando a extensão na [Chrome Web Store](https://chrome.google.com/webstore/detail/ufcgpro/niacojggmhhjndikhcdmmijjoepkgjeb)
2. Seguindo os passos da última [release](https://github.com/luciannojunior/ufcg-pro/releases) para a instalação manual.

### Mozila Firefox
Segundo os regulamentos da loja do Firefox para addons, extensões que não focam no público geral devem ser distribuídas pelo próprio desenvolvedor, sendo apenas assinadas digitalmente com a empresa. O próprio navegador checará updates automaticamente.

- Para instalar o **UFCGPro** no Firefox acesse [este link](https://ufcgprodist.now.sh/ufcgpro-1.0.5-an+fx.xpi).

## Funcionalidades

- O UFCGPro oferece várias funcionalidades para alunos e professores usuários do Controle Acadêmico da Universidade Federal de Campina Grande. Para saber mais detalhes destas funcionalidades e como usá-las veja [este documento](https://gist.github.com/luciannojunior/65d8743fb9a5759de932861a6bb5b781)

## Contribuir

- Ficarei muito feliz se você puder **melhorar este projeto**, pode ser reportando problemas pela sessão Issues ou enviando um Pull Requests

## Desenvolvendo

1. Você deve ter instalado o `Node.js` e preferencialmente o Google Chrome
2. Clone este repositório e rode `yarn && yarn watch:dev` na sua pasta. (Se você usa `npm` rode `npm install && npm run watch:dev`
3. Siga as mesmas instruções [deste guia](https://github.com/luciannojunior/ufcg-pro/releases), só que agora selecione a pasta `dist` que foi criada no repositório (se tudo deu certo no passo 2)
4. Olhe o arquivo `background.js` que você vai ter uma boa ideia de como tudo funciona. Eu uso o Vue.js para criar as interfaces, mas não deve ser difícil usar qualquer outra coisa (só configurar o `webpack.config.js`)
