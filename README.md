# UFCGPro

A extensão da Controle Acadêmico da Universidade Federal de Campina Grande.

_Esta extensão foi desenvolvida em um Trabalho de Conclusão de Curso da graduação de Ciência da Computação na Universidade Federal de Campina Grande com orientação do professor [Matheus Gaudencio](https://github.com/matheusgr). Agradeço imensamente a todos os professores e funcionários que mantém este curso no mais alto padrão do ensino brasileiro!_

_Agradeço também ao Dr. José Jailson Nicácio Alves, professor do Departamento de Engenharia Química da UFCG, por auxilar a validação da extensão._

**Para ler o artigo entregue, clique [aqui](./ufcgpro-tcc-lucis.pdf)**

<img src="https://raw.githubusercontent.com/lucis/ufcg-pro/master/media/logo.png?s=10" width="200" />

## Instalação

No momento, esta extensão dá suporte aos seguintes navegadores:

### Google Chrome

1. Baixe e instale a extensão na [Chrome Web Store](https://chrome.google.com/webstore/detail/ufcgpro/niacojggmhhjndikhcdmmijjoepkgjeb)

### Mozila Firefox

Segundo os regulamentos da loja do Firefox para addons, extensões que não focam no público geral devem ser distribuídas pelo próprio desenvolvedor, sendo apenas assinadas digitalmente com a empresa. **O próprio navegador checará updates automaticamente.**

- Para instalar o **UFCGPro** no Firefox acesse [este link](https://ufcgprodist.now.sh/latest.xpi).

## Funcionalidades

- O UFCGPro oferece várias funcionalidades para alunos e professores usuários do Controle Acadêmico da Universidade Federal de Campina Grande. Para saber mais detalhes destas funcionalidades e como usá-las veja [este documento](http://bit.ly/ufcgpro-funcionalidades)

## Contribuir

- Ficarei muito feliz se você puder **melhorar este projeto**, pode ser reportando problemas pela sessão Issues ou enviando um Pull Requests

## Desenvolvendo

1. Você deve ter instalado o `Node.js` e preferencialmente o Google Chrome
2. Clone este repositório e rode `yarn && yarn watch:dev` na sua pasta. (Se você usa `npm` rode `npm install && npm run watch:dev`
3. Siga as mesmas instruções [deste guia](https://github.com/lucis/ufcg-pro/releases/tag/v1.0.5), só que agora selecione a pasta `dist` que foi criada no repositório (se tudo deu certo no passo 2)
4. Olhe o arquivo `background.js` que você vai ter uma boa ideia de como tudo funciona. Eu uso o Vue.js para criar as interfaces, mas não deve ser difícil usar qualquer outra coisa (só configurar o `webpack.config.js`)

## Publicando

1. Após ter aprovado todas as modificações, esteja na branch `master` limpa.
2. Rode `yarn release` e escolha a versão. O `release-it` vai fazer o lançamento da tag no Github.
3. Após isso, o comando rodará a fase de _build_ e gerará **o artefato em zip** na pasta `dist-zip`
4. **Opcional:** Suba o artefato gerado nos _Assets_ da última Release

**Google Chrome Release**

5. Acesse o [Dashboard da Chrome Web Store](https://chrome.google.com/webstore/devconsole) e, em Pacote, suba o artefato atualizado.
6. Após o upload do pacote, **é necessário clicar em Publicar Item** para a alteração ir para revisão.
7. :pray: **Reze** para que o _review_ não dure semanas (ocorreu dias antes da minha apresentação de TCC)

**Firefox Release**

8. Faça login https://addons.mozilla.org/en-US/developres
9. Na página da extensão, clique em **Submit a new version** e marque Firefox e Firefox para Android.
10. Suba o mesmo artefato `(ufcg-pro-v{version}.zip)` e **marque a opção que não usa ofuscadores**
11. **Espere o e-mail** com o artefato assinado (~5 min) e baixe-o
12. Após baixar o artefato (.xpi), **copie-o para o projeto _ufcgpro-dist_** e rode `./configure`
13. **Suba o ufcgpro-dist** para produção (`now --prod`).
