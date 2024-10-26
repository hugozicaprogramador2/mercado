const stripe = Stripe('pk_test_51QDOmoHkxHLashFyHhYUHKoQg6rHPE2hG4cDrRsnh2GusmQYIBfXBDccDuqOhhWbUxIvt9MlsNCFxD2fK0pZcHzX00RLCw7IeK'); // Coloque sua chave pública aqui
const elements = stripe.elements();

// Estilo do elemento do cartão
const style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        lineHeight: '24px',
        padding: '10px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Criar um elemento do cartão
const cardElement = elements.create('card', {style: style});
cardElement.mount('#card-element');

// Obter o valor do parâmetro 'amount' da URL
const urlParams = new URLSearchParams(window.location.search);
const amount = urlParams.get('amount');

// Processar o pagamento quando o formulário é enviado
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { clientSecret } = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount }) // Passar o valor em centavos
    }).then((r) => r.json());

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
        }
    });

    if (error) {
        // Mostra erro no formulário
        document.getElementById('card-errors').textContent = error.message;
    } else {
        // O pagamento foi processado com sucesso
        document.getElementById('payment-result').textContent = 'Pagamento realizado com sucesso!';
    }
});
