const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const path = require('path');
const mysql = require('mysql2'); // Adiciona o pacote mysql2
const { cadastrarUsuario } = require('./cadastro'); // Certifique-se que o caminho está correto

const stripe = Stripe('sk_test_51QDOmoHkxHLashFy55RFxo2mL2rtoerTwmNlEAHlXzgIKnqkL27DzQjH2Wg9B4gDcGtUixjhV1PjV6wvkWlPposO00BxUtGmP3'); // Substitua pela sua chave secreta de teste

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve arquivos estáticos do diretório atual
app.use('/css', express.static(path.join(__dirname, 'css'))); // Serve a pasta css

// Rota para cadastrar usuários
app.post('/cadastrar', async (req, res) => {
    const { nome, email } = req.body;
    try {
        await cadastrarUsuario(nome, email);

        // Redirecionamento com base no domínio do e-mail
        if (email.endsWith('@adm.com')) {
            res.redirect('/views/dashboardAdmin.html'); // Página de administradores
        } else if (email.endsWith('@usuario.com')) {
            res.redirect('/views/dashboardUsuario.html.html'); // Página de usuários
        } else {
            res.redirect('/views/index.html'); // Página genérica para outros domínios
        }
    } catch (error) {
        res.status(500).send('Erro ao cadastrar usuário: ' + error.message);
    }
});

// Rota para criar a sessão de checkout
app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body;

    // Valida se os itens foram recebidos e têm o formato correto
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ error: 'Itens inválidos' });
    }

    // Mapeia os itens do carrinho para o formato necessário para o Stripe
    const line_items = items.map(item => ({
        price_data: {
            currency: 'brl', // Define a moeda
            product_data: {
                name: item.name,
            },
            unit_amount: item.price, // O preço deve estar em centavos
        },
        quantity: item.quantity,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items, // Envia os itens para o Stripe
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });
        console.log('Sessão de checkout criada:', session);
        res.status(200).json({ url: session.url }); // Retorna a URL da sessão
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        res.status(500).send({ error: error.message });
    }
});

// Rota de busca de produtos
app.get('/buscar-produtos', (req, res) => {
    const termo = req.query.termo; // Termo de pesquisa enviado pelo frontend

    // Consulta SQL para buscar produtos que correspondem ao termo de pesquisa
    const query = `SELECT * FROM produtos WHERE nome LIKE ? OR categoria LIKE ?`;
    db.query(query, [`%${termo}%`, `%${termo}%`], (error, results) => {
        if (error) {
            return res.status(500).send('Erro ao buscar produtos: ' + error.message);
        }
        res.json(results); // Retorna os resultados em JSON
    });
});

// Rota para servir a página principal (produtos)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para servir a página de produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
});

// Rota para servir o formulário de cadastro
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Rota de sucesso
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// Rota de cancelamento
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cancel.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
