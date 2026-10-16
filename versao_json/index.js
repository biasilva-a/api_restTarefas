import express from 'express';
const app = express();
app.use(express.json());

// "Banco de dados" em memória
let tarefas = [
    { id: 1, titulo: 'Aprender Express', concluida: false },
    { id: 2, titulo: 'Criar minha primeira API', concluida: false }
];
let proximoId = 3;

// LISTAR todas as tarefas (com filtro opcional por status)
app.get('/tarefas', (req, res) => {
    const { concluida } = req.query;
    let resultado = tarefas;
    if (concluida !== undefined) {
        resultado = tarefas.filter(t => t.concluida === (concluida === 'true'));
    }
    res.json(resultado);
});

app.get('/tarefas/:id', (req, res) => {
    const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
    res.json(tarefa);
});


app.post('/tarefas', (req, res) => {
    const { titulo } = req.body;
    if (!titulo || typeof titulo !== 'string') {
        return res.status(400).json({ erro: 'O campo "titulo" é obrigatório e deve ser um texto.' });
    }
    const titulointeiro = titulo.trim();
    if (titulointeiro === '') {
        return res.status(400).json({ erro: 'O campo "titulo" não pode ser vazio.' });
    }
    if (titulointeiro.length > 100) {
        return res.status(400).json({ erro: 'O título é muito longo. O tamanho máximo permitido é de 100 caracteres.' });
    }
    const novaTarefa = { id: proximoId++, titulo: titulointeiro, concluida: false };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});


app.put('/tarefas/:id', (req, res) => {
    const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa nao encontrada' });

    const { titulo, concluida } = req.body;
    if (titulo !== undefined) {
        // ele ve se é uma string e valida
        if (typeof titulo !== 'string') {
            return res.status(400).json({ erro: 'O campo "titulo" deve ser um texto.' });
        }
        // Checa se está vazio
        const tituloLimpo = titulo.trim();
        if (tituloLimpo === '') {
            return res.status(400).json({ erro: 'O campo "titulo" não pode ser vazio.' });
        }
        //Checa tamanho do titulo
        if (tituloLimpo.length > 100) {
            return res.status(400).json({ erro: 'O título é muito longo. Máximo de 100 caracteres.' });
        }
        tarefa.titulo = tituloLimpo;
    }
    if (concluida !== undefined) tarefa.concluida = concluida;
    res.json(tarefa);
});


app.delete('/tarefas/:id', (req, res) => {
    const index = tarefas.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ erro: 'Tarefa nao encontrada' });
    tarefas.splice(index, 1);
    res.status(204).send();

});

app.listen(3000, () => console.log('API de tarefas rodando na porta 3000'));

