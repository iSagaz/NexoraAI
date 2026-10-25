/* 
Lógica de Programação

Algoritmo - Receita de BOLO

[x] Saber quando o botão foi clicado
[x] Pegar o texto do TextArea
[x] Enviar para a IA(servidor)
[x] Pegar a resposta da IA
[x] Colocar na tela
    [x] Código
    [x] Resultado do Código     
[ ] Refinar nosso resultado        

    querySelector - pega um elemento que eu escolher
    HTML - document
    JavaScript - script
*/
let endereco = "/api/gerar"

let prompt = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

                    Regras de resposta:
                    - Responda SOMENTE com HTML e CSS puros
                    - Não use crases, markdown ou explicações
                    - Não use tags <img>

                    Identidade visual (capriche e surpreenda):
                    - Invente uma paleta de cores única que combine com a essência do negócio
                    - Escolha uma Google Font marcante via @import
                    - Use emojis grandes no lugar de imagens
                    - Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte

                    Estrutura da página:
                    - Header com nome do negócio e menu
                    - Hero impactante com título, subtítulo e botão CTA
                    - Seção de diferenciais com emojis
                    - Depoimento de cliente
                    - Footer com contato

Todo o conteúdo em português, criativo e específico para o negócio.`


// Clicou no Botão GERAR - Chama essa função

async function gerarCodigo() {

    let textarea = document.querySelector(".texto-pagina").value.trim();

    // Verificar se o usuário escreveu alguma coisa
    if (textarea === "") {
        alert("Por favor, descreva seu negócio!");
        return;
    }

    let espacoCodigo = document.querySelector(".bloco-codigo");
    let espacoSite = document.querySelector(".bloco-site");

    espacoCodigo.textContent = "Gerando seu site...";

    try {
        // Enviar solicitação para a IA
        let resposta = await fetch(endereco, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                descricao: textarea
            })
        });

        // Verificar se a API respondeu corretamente
        if (!resposta.ok) {
            throw new Error("Erro na API: " + resposta.status);
        }

        // Converter a resposta em JSON
        let dados = await resposta.json();

        // Extrair o código gerado pela IA
        let resultado = dados.codigo;

        if (!resultado) {
            throw new Error("A IA não retornou um código válido.");
        }

        // Mostrar o código na tela
        espacoCodigo.textContent = resultado;

        // Mostrar o site gerado
        espacoSite.srcdoc = resultado;

    } catch (erro) {

        console.error("Erro ao gerar site:", erro);

        espacoCodigo.textContent =
            "Não foi possível gerar o site. Verifique a conexão ou a API.";
    }
}


/* 
IA para gerar o que queremos 

1) Qual o modelo de IA vamos usar
2) system - Quem a IA deve ser - Programador / Designer
3) user - mensagem do usuário

*/
