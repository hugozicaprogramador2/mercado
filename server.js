const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const path = require('path');
const stripe = Stripe('sk_test_51QDOmoHkxHLashFy55RFxo2mL2rtoerTwmNlEAHlXzgIKnqkL27DzQjH2Wg9B4gDcGtUixjhV1PjV6wvkWlPposO00BxUtGmP3'); // Substitua pela sua chave secreta de teste

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

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

// Rota para servir a página principal (produtos)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // Atualizado para incluir a pasta views
});

// Rota para servir a página de produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produtos.html')); // Atualizado para incluir a pasta views
});

// Rota de sucesso
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html')); // Atualizado para incluir a pasta views
});

// Rota de cancelamento
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cancel.html')); // Atualizado para incluir a pasta views
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
