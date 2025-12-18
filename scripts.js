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
        }, 5000);
    }
});

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
        <button onclick="showProducts('${tipo}', 'meninas')">Meninas</button>
        <button onclick="showProducts('${tipo}', 'meninos')">Meninos</button>
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
        })
        .catch(() => {
            alert("Erro ao buscar o CEP.");
        });
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
