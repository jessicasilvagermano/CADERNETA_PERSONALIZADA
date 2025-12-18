document.addEventListener("DOMContentLoaded", function () {
    const btnBasica = document.getElementById("btnBasica");
    const btnLuxo = document.getElementById("btnLuxo");
    const cepInput = document.getElementById("cep");

    if (btnBasica && btnLuxo) {
        btnBasica.addEventListener("click", () => escolherCategoria("basica"));
        btnLuxo.addEventListener("click", () => escolherCategoria("luxo"));
    }

    if (cepInput) {
        cepInput.addEventListener("blur", buscarEndereco);
    }

    if (document.getElementById("pedido")) {
        exibirResumoPedido();
    }

    /* ===== CARROSSEL ===== */
    const slides = document.querySelector(".slides");

    if (slides) {
        const totalSlides = slides.children.length;
        let index = 0;

        function updateSlide() {
            slides.style.transform = `translateX(-${index * 100}%)`;
        }

        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                index = (index + 1) % totalSlides;
                updateSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                index = (index - 1 + totalSlides) % totalSlides;
                updateSlide();
            });
        }

        setInterval(function () {
            index = (index + 1) % totalSlides;
            updateSlide();
        }, 10000);
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const notification = document.getElementById("notification");
    const clientName = document.getElementById("client-name");
    const testimonialText = document.getElementById("testimonial-text");
    const clientPhoto = document.getElementById("client-photo");

    if (!notification) return;

    const notifications = [
        {
            name: "Carlos petrolina",
            text: "Minha esposa gostou muito",
            photo: "https://i.pravatar.cc/100?img=12"
        },
        {
            name: "Fernanda piranga",
            text: "Amei, amei. recomendo",
            photo: "https://i.pravatar.cc/100?img=32"
        },
        {
            name: "Paula argemiro.",
            text: "vale a pena demais",
            photo: "https://i.pravatar.cc/100?img=45"
        }
    ];

    let index = 0;

    function showNotification() {
        const item = notifications[index];

        clientName.textContent = item.name;
        testimonialText.textContent = item.text;
        clientPhoto.src = item.photo;

        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 4000);

        index = (index + 1) % notifications.length;
    }

    // primeira após 3s
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 8000);
    }, 3000);
});

/* ===== FRETE FIXO POR BAIRRO ===== */
const FRETES_POR_BAIRRO = {
    "Padre Vicente": 0.00,
    "Centro": 5.00,
    "Piranga": 5.00,
    "Dom José Rodrigues": 5.00,
    "argemiro": 2.00,
    "Nova esperança": 2.00,
    "Piranga 1": 2.00
};



/* ===== CATEGORIAS ===== */
function escolherCategoria(tipo) {
    let categoriaContainer = document.getElementById("categoria");

    if (!categoriaContainer) {
        categoriaContainer = document.createElement("div");
        categoriaContainer.id = "categoria";
        document.body.appendChild(categoriaContainer);
    }

 categoriaContainer.innerHTML = `
    <h2>Clique e veja as capas '${tipo}' disponíveis para:</h2>

    <div class="categoria-botoes">
        <button class="btn-categoria" onclick="showProducts('${tipo}', 'meninas')">
            Meninas
        </button>

        <button class="btn-categoria" onclick="showProducts('${tipo}', 'meninos')">
            Meninos
        </button>
    </div>
`;
}

/* ===== PRODUTOS ===== */
function showProducts(tipo, categoria) {
    const products = {
        basica: Array.from({ length: 72 }, (_, i) => ({
            nome: "Caderneta Básica",
            preco: "R$ 35,00",
            descricao: `MODELO DE CAPA - ${i + 1}`,
            imagem: `${categoria}/CAPA-${i + 1}.webp`
        })),
        luxo: Array.from({ length: 72 }, (_, i) => ({
            nome: "Caderneta de Luxo",
            preco: "R$ 40,00",
            descricao: `MODELO DE CAPA - ${i + 1}`,
            imagem: `${categoria}/CAPA-${i + 1}.webp`
        }))
    };

    let productList = document.getElementById("products");

    if (!productList) {
        productList = document.createElement("div");
        productList.id = "products";
        document.body.appendChild(productList);
    }

    productList.innerHTML = products[tipo]
        .map(produto => `
            <div class="product">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p><strong>${produto.preco}</strong></p>
                <button onclick="selecionarProduto(
                    '${produto.nome}',
                    '${produto.preco}',
                    '${produto.descricao}',
                    '${produto.imagem}'
                )">
                    Selecionar
                </button>
            </div>
        `)
        .join("");
}

/* ===== CEP ===== */
function buscarEndereco() {
    const cepInput = document.getElementById("cep");
    if (!cepInput) return;

    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido! Digite um CEP com 8 dígitos.");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
    if (data.erro) {
        alert("CEP não encontrado!");
        return;
    }

    document.getElementById("rua").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;

const bairro = data.bairro;

if (FRETES_POR_BAIRRO.hasOwnProperty(bairro)) {
    const frete = FRETES_POR_BAIRRO[bairro];

    localStorage.setItem("freteValor", frete);

    const freteTexto = frete === 0
        ? "🚚 Frete grátis"
        : `🚚 Frete: R$ ${frete.toFixed(2)}`;

    const freteEl = document.getElementById("frete");
    if (freteEl) freteEl.textContent = freteTexto;
} else {
    localStorage.removeItem("freteValor");

    alert("❌ Não realizamos entregas para este bairro.");

    const freteEl = document.getElementById("frete");
    if (freteEl) freteEl.textContent = "❌ Não realizamos entregas para este bairro";
}

})
}

/* ===== PRODUTO SELECIONADO ===== */
function selecionarProduto(nome, preco, descricao, imagem) {
    const produto = { nome, preco, descricao, imagem };
    localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
    window.location.href = "cadastro.html";
}

/* ===== ENTREGA ===== */
function calcularDataEntrega() {
    let data = new Date();
    let dias = 0;

    while (dias < 3) {
        data.setDate(data.getDate() + 1);
        const diaSemana = data.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
            dias++;
        }
    }

    return `${String(data.getDate()).padStart(2, "0")}/${String(
        data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`;
}


/* ===== SALVAR ENDEREÇO ===== */
function salvarEndereco() {
    const campos = ["cep", "rua", "numero", "bairro", "cidade", "referencia", "nome", "crianca"];
    const frete = localStorage.getItem("freteValor");

if (!frete) {
    alert("Não realizamos entregas para este bairro.");
    return;
}

    let valido = true;

    campos.forEach(id => {
        const input = document.getElementById(id);
        if (!input || input.value.trim() === "") {
            valido = false;
            if (input) input.style.borderColor = "red";
        } else {
            input.style.borderColor = "";
        }
    });

    if (!valido) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const endereco = {
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        numero: document.getElementById("numero").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        referencia: document.getElementById("referencia").value,
        nome: document.getElementById("nome").value,
        crianca: document.getElementById("crianca").value,
        dataEntrega: calcularDataEntrega()
    };

    localStorage.setItem("enderecoEntrega", JSON.stringify(endereco));

    // redireciona se quiser
    window.location.href = "resumo.html";
}


document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("pedido")) {
        exibirResumoPedido();
    }
});
function exibirResumoPedido() {
    const pedidoDiv = document.getElementById("pedido");
    if (!pedidoDiv) return;

    const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega"));

    if (!produto || !endereco) {
        pedidoDiv.innerHTML = "<p>❌ Pedido incompleto.</p>";
        return;
    }

    // converte preço do produto
    const precoProduto = parseFloat(
        produto.preco.replace("R$", "").replace(",", ".")
    );

    // pega frete salvo
    const frete = parseFloat(localStorage.getItem("freteValor") || 0);

    // calcula total
    const total = (precoProduto + frete).toFixed(2);

    pedidoDiv.innerHTML = `
        <div class="pedido-produto">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p><strong>Produto:</strong> R$ ${precoProduto.toFixed(2)}</p>
            <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
            <p style="font-size:18px; margin-top:10px;"><strong>Total:</strong> R$ ${total}</p>
        </div>

        <div class="pedido-endereco">
            <h3>📍 Endereço de Entrega</h3>
            <p><strong>Seu nome:</strong> ${endereco.nome}</p>
            <p><strong>Nome da Criança:</strong> ${endereco.crianca}</p>
            <p><strong>Rua:</strong> ${endereco.rua}, ${endereco.numero}</p>
            <p><strong>Bairro:</strong> ${endereco.bairro} – ${endereco.cidade}</p>
            <p><strong>Ponto de Referência:</strong> ${endereco.referencia}</p>
            <p><strong>Data da Entrega:</strong> ${endereco.dataEntrega}</p>
        </div>
    `;
}

const precoProduto = parseFloat(produto.preco.replace("R$", "").replace(",", "."));
const total = (precoProduto + parseFloat(frete)).toFixed(2);


/* ===== CONFIRMAR PEDIDO ===== */

function confirmarPedido() {
    const resumo = document.getElementById("pedido");

    if (!resumo) {
        alert("Resumo do pedido não encontrado.");
        return;
    }

    html2canvas(resumo, {
        scale: 2,          // qualidade alta
        backgroundColor: "#ffffff"
    }).then(canvas => {
        // converter em imagem
        const imageData = canvas.toDataURL("image/png");

        // criar download automático
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "resumo-pedido.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // mensagem WhatsApp
        const mensagem = `
📸 A imagem do resumo foi gerada.
👉 Por favor, anexe a imagem do pedido aqui na conversa para finalizar.
        `.trim();

        const telefone = "5574998066693"; // SEU NÚMERO
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    });
}


function desistirCompra() {
    const confirmar = confirm("Tem certeza que deseja desistir do pedido?");

    if (!confirmar) return;

    // limpa dados do pedido
    localStorage.removeItem("produtoSelecionado");
    localStorage.removeItem("enderecoEntrega");
    localStorage.removeItem("freteValor");

    // volta para a página inicial
    window.location.href = "index.html";
}
