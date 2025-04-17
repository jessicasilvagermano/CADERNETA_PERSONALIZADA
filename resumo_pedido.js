const products = {
    basica: [
        { name: 'Caderneta Básica A', price: 10.00 },
        { name: 'Caderneta Básica B', price: 12.50 }
    ],
    luxo: [
        { name: 'Caderneta de Luxo A', price: 25.00 },
        { name: 'Caderneta de Luxo B', price: 30.00 }
    ]
};

// Função para exibir produtos por categoria
function selectCategory(category) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpa a lista de produtos antes de adicionar novos

    // Loop para adicionar os produtos na tela
    products[category].forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Preço: R$ ${product.price.toFixed(2)}</p>
            <button class="btn-selecionar" onclick="goToAddressPage()">Selecionar</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Função para redirecionar para a página de cadastro de endereço
function goToAddressPage() {
    window.location.href = 'cadastro_endereco.html';
}

