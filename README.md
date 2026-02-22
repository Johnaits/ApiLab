# 🧪 ApiLab

**ApiLab** é uma biblioteca JavaScript *vanilla* (sem dependências) que injeta uma interface estilo Postman diretamente na sua aplicação web. Perfeita para testar endpoints, realizar requisições HTTP e debugar integrações de forma rápida e visual, sem precisar sair da sua tela.

## ✨ Funcionalidades

* 🚫 **Zero Dependências:** Feito com JS puro e CSS nativo.
* 🎨 **Múltiplos Temas:** Suporte para temas Vanilla, Bootstrap e Tailwind, além de Modo Claro/Escuro nativo.
* 💾 **Histórico Local:** Salva suas requisições no LocalStorage do navegador.
* 🛠️ **Suporte Completo:** Métodos GET, POST, PUT, DELETE e PATCH.
* 🔐 **Autenticação e Headers:** Suporte embutido para Bearer Token e Headers customizados.
* 💻 **Body e Preview:** Editor de JSON integrado formatável e renderização automática de iFrame para respostas em HTML.
* 🪟 **Interface Fluida:** Container redimensionável pelo usuário e modo Tela Cheia (Fullscreen).

## 🚀 Instalação e Uso

Baixe ou clone o repositório e importe o CSS e o Módulo JS no seu projeto HTML:

```html
<link rel="stylesheet" href="./src/css/api_lab.css">

<div id="apilab-container"></div>

<script type="module">
    import { ApiLab } from './src/js/api_lab.js';
    
    document.addEventListener('DOMContentLoaded', () => {
        const lab = new ApiLab('#apilab-container', {
            theme: 'vanilla',      // 'vanilla', 'bootstrap' ou 'tailwind'
            defaultMode: 'dark',   // 'dark' ou 'light'
            proxyUrl: ''           // (Opcional) Caminho para o proxy.php para evitar CORS
        });
    });
</script>
```
## 🛡️ Contornando o CORS (Proxy)
Se você tentar acessar APIs externas diretamente do navegador, poderá enfrentar erros de CORS. Para resolver isso, o ApiLab suporta o roteamento via servidor usando um Proxy PHP simples.

Basta hospedar o arquivo proxy.php no seu servidor e apontar na inicialização:
proxyUrl: './proxy.php'

## 📁 Estrutura do Projeto
/src: Contém o código fonte da biblioteca (CSS e JS separados por responsabilidade).

/example: Contém o arquivo index.html de exemplo de uso e o proxy.php.

📄 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.
