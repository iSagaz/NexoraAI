
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname)));

app.post("/api/gerar", async (req, res) => {
    try {
        const { descricao } = req.body;

        if (typeof descricao !== "string" ||
            !descricao.trim() ||
            descricao.length > 2000) {
            return res.status(400).json({
                erro: "Descrição inválida."
            });
        }

        if (!process.env.GROQ_API_KEY) {
            throw new Error("Chave da Groq não configurada.");
        }

        const resposta = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        {
                            role: "system",
                            content: `Você é um designer web e programador.
Crie uma landing page completa e visualmente impressionante.

Regras:
- Retorne apenas HTML e CSS.
- Retorne um documento HTML completo.
- Coloque o CSS dentro da tag style.
- Não use JavaScript.
- Não use markdown.
- Use cores, fontes e layouts modernos.
- Inclua header, hero, diferenciais, depoimento e footer.
- Escreva em português.`
                        },
                        {
                            role: "user",
                            content: descricao
                        }
                    ]
                })
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro da Groq: " + resposta.status);
        }

        const dados = await resposta.json();
        const codigo = dados.choices?.[0]?.message?.content;

        if (!codigo) {
            throw new Error("A IA não retornou conteúdo.");
        }

        res.json({ codigo });

    } catch (erro) {
        console.error(erro.message);

        res.status(502).json({
            erro: "Não foi possível gerar o site."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
