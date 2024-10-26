const payButtons = document.querySelectorAll('.pay-button');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');

let cart = [];

// Adiciona item ao carrinho
payButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const product = event.target.closest('.product');
        const name = product.dataset.name;
        const price = parseInt(product.dataset.price);

        // Verifica se o item já está no carrinho
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1; // Incrementa a quantidade
        } else {
            cart.push({ name, price, quantity: 1 }); // Adiciona novo item
        }
        updateCartCount();
    });
});

// Atualiza o contador de itens no carrinho
function updateCartCount() {
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

// Mostra o modal do carrinho
cartIcon.addEventListener('click', () => {
    displayCartItems();
    cartModal.style.display = "block";
});

// Fecha o modal do carrinho
closeModal.addEventListener('click', () => {
    cartModal.style.display = "none";
});

// Exibe itens do carrinho no modal
function displayCartItems() {
    cartItemsContainer.innerHTML = ''; // Limpa itens antigos
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `${item.name} - R$ ${(item.price / 100).toFixed(2)} (Quantidade: ${item.quantity}) <button class="remove-button" data-name="${item.name}">Remover</button>`;
        cartItemsContainer.appendChild(div);
    });

    // Adiciona funcionalidade de remover item
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemName = event.target.dataset.name;
            cart = cart.filter(item => item.name !== itemName);
            updateCartCount();
            displayCartItems(); // Atualiza itens exibidos
        });
    });
}

// Função para ir ao checkout
checkoutButton.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    // Envia a solicitação para criar a sessão de checkout
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();

    // Redireciona para o checkout do Stripe
    if (session.url) {
        window.location.href = session.url;
    } else {
        console.error('Erro ao redirecionar para o checkout:', session.error);
    }
});
