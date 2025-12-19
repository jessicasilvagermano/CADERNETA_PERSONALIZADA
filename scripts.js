/* ================= CONFIG ================= */

const TOTAL_CAPAS = 72;

const PRECO_CARTAO_SUS = 10.00;
const PRECO_CARTAO_SUS_PROMO = 5.00;

const FRETES_POR_BAIRRO =

{
    "Alto da Aliança": 5,
    "Antonio Conselheiro": 3,
    "Antonio Guilhermino": 5,
    "Argemiro": 0,
    "Água Bela": 3,
    "Alagadiço": 0,
    "Alto da Maravilha": 0,
    "Alto do Alencar":4,
    "Alto do Cruzeiro": 3,
    "Angary": 3,
    "Centro": 3,
    "Country Club": 3,
    "Cajueiro": 3,
    "Castelo Branco": 3,
    "Centenário": 3,
    "Coréia": 3,
    "Distrito Industrial": 10,
    "Dom José Rodrigues": 5,
    "Dom Tomaz": 5,
    "Expedito de Almeida Nascimento": 3,
    " Itaberaba": 5,
    "Jardim Flórida": 0,
    "Jardim Novo Encontro": 3,
    "Jardim São Paulo": 5,
    "Jardim Vitória": 0,
    "João Paulo II": 8,
    "João XXIII": 3,
    "Lomanto Júnior": 3,
    "Malhada da Areia": 5,
    "Maringá": 0,
    "Matatu": 2,
    "Monte Castelo": 3,
    "Mussambê": 2,
    "Nossa Senhora da Penha": 3,
    "Nossa Senhora das Grotas": 2,
    "Nova esperança": 0,
    "Padre Vicente": 0,
    "Palmares": 3,
    "Parque Centenário": 3,
    "Pedra do Lord": 0,
    "Pedro Raimundo": 4,
    "Piranga": 0,
    "Piranga I": 0,
    "Piranga II": 3,
    "Quidé": 3,
    "Santa Maria Goretti": 0,
    "Santo Antônio": 0,
    "São Geraldo": 3,
    "Tabuleiro": 3,
    "Tancredo Neves": 3,
    "Vila Tiradentes": 5,
    "Gercino Coelho": 5,
    "Vila Mocó": 5,
    "São José": 5
}



/* ================= INICIAL ================= */

document.addEventListener("DOMContentLoaded", () => {

    const btnBasica = document.getElementById("btnBasica");
    const btnLuxo = document.getElementById("btnLuxo");

    if (btnBasica) btnBasica.onclick = () => escolherCategoria("basica");
    if (btnLuxo) btnLuxo.onclick = () => escolherCategoria("luxo");

    if (document.getElementById("pedido")) {
        exibirResumoPedido();
    }
});

/* ================= CATEGORIAS ================= */

function escolherCategoria(tipo) {

    let div = document.getElementById("categoria");

    if (!div) {
        div = document.createElement("div");
        div.id = "categoria";
        document.body.appendChild(div);
    }

    div.innerHTML = `
        <h2>Clique e veja as capas '${tipo}' disponíveis para:</h2>
        <div class="categoria-botoes">
            <button class="btn-categoria" onclick="showProducts('${tipo}','meninas')">Meninas</button>
            <button class="btn-categoria" onclick="showProducts('${tipo}','meninos')">Meninos</button>
        </div>
    `;
}

/* ================= PRODUTOS ================= */
function showProducts(tipo, categoria) {

    const produtos = Array.from({ length: TOTAL_CAPAS }, (_, i) => ({
        nome: tipo === "basica" ? "Caderneta Básica" : "Caderneta de Luxo",
        preco: tipo === "basica" ? "R$ 35,00" : "R$ 40,00",
        descricao: `MODELO DE CAPA - ${i + 1}`,
        imagem: `${tipo}/${categoria}/CAPA-${i + 1}.webp`
    }));

    let div = document.getElementById("products");

    if (!div) {
        div = document.createElement("div");
        div.id = "products";
        document.body.appendChild(div);
    }

    div.innerHTML = produtos.map(p => `
        <div class="product">
            <img 
                src="${p.imagem}" 
                alt="${p.nome}"
                onerror="this.src='placeholder.webp'"
            >
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            <p><strong>${p.preco}</strong></p>
            <button onclick="selecionarProduto(
                '${p.nome}',
                '${p.preco}',
                '${p.descricao}',
                '${p.imagem}'
            )">
                Selecionar
            </button>
        </div>
    `).join("");
}




/* ================= PRODUTO (VAI PARA UPSELL) ================= */

function selecionarProduto(nome, preco, descricao, imagem) {

    localStorage.setItem("produtoSelecionado", JSON.stringify({
        nome, preco, descricao, imagem
    }));

    localStorage.removeItem("cartaoSus");

    window.location.href = "upsell-cartao.html";
}

/* ================= CEP + FRETE ================= */

function buscarEndereco() {

    const cepInput = document.getElementById("cep");
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(data => {

            if (data.erro) {
                alert("CEP não encontrado");
                return;
            }

            document.getElementById("rua").value = data.logradouro;
            document.getElementById("bairro").value = data.bairro;
            document.getElementById("cidade").value = data.localidade;

            if (FRETES_POR_BAIRRO[data.bairro] === undefined) {
                localStorage.removeItem("freteValor");
                document.getElementById("frete").textContent =
                    "❌ Não realizamos entregas para este bairro";
                return;
            }

            const frete = FRETES_POR_BAIRRO[data.bairro];
            localStorage.setItem("freteValor", frete);

            document.getElementById("frete").textContent =
                frete === 0
                    ? "🚚 Frete grátis"
                    : `🚚 Frete: R$ ${frete.toFixed(2)}`;
        });
}

/* ================= ENDEREÇO ================= */

function salvarEndereco() {

    if (!localStorage.getItem("freteValor")) {
        alert("Entrega indisponível para este bairro");
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
    window.location.href = "resumo.html";
}

function calcularDataEntrega() {
    const d = new Date();
    let dias = 0;

    while (dias < 3) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) dias++;
    }

    return d.toLocaleDateString("pt-BR");
}

/* ================= RESUMO ================= */

function exibirResumoPedido() {

    const pedidoDiv = document.getElementById("pedido");
    if (!pedidoDiv) return;

    const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega"));
    const cartaoSus = JSON.parse(localStorage.getItem("cartaoSus"));
    const frete = parseFloat(localStorage.getItem("freteValor") || 0);

    if (!produto || !endereco) {
        pedidoDiv.innerHTML = "<p>❌ Pedido incompleto.</p>";
        return;
    }

    const precoProduto = parseFloat(
        produto.preco.replace("R$", "").replace(",", ".")
    );

    let total = precoProduto + frete;
    if (cartaoSus?.incluso) total += cartaoSus.preco;

    pedidoDiv.innerHTML = `
<div class="pedido-comprovante">

    <h2> Comprovante do Pedido</h2>

    <div class="pedido-produtos">

        <div class="pedido-item">
            <img src="${produto.imagem}">
            <p><strong>${produto.nome}</strong></p>
            <p>${produto.descricao}</p>
            <p>R$ ${precoProduto.toFixed(2)}</p>
        </div>

        ${cartaoSus?.incluso
            ? `
            <div class="pedido-item">
              <img src="${cartaoSus.imagem}"> 
                <p><strong>🪪 Cartão do SUS</strong></p>
                <p>Pacote promocional</p>
                <p>R$ ${cartaoSus.preco.toFixed(2)}</p>
            </div>
            `
            : ""
        }

    </div>

    <div class="pedido-valores">
        <p>🚚 Frete: R$ ${frete.toFixed(2)}</p>
        <h3>💰 TOTAL DO PEDIDO: R$ ${total.toFixed(2)}</h3>
    </div>

    <div class="pedido-endereco">
        <h3>📍 Endereço</h3>
        <p>Cliente: ${endereco.nome}</p>
        <p>Nome da Criança: ${endereco.crianca}</p>
        <p>${endereco.rua}, ${endereco.numero}</p>
        <p>${endereco.bairro} – ${endereco.cidade}</p>
        <p>📅 Entrega: ${endereco.dataEntrega}</p>
    </div>

</div>`;
}

/* ================= WHATSAPP ================= */

function confirmarPedido() {

    const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega"));
    const cartaoSus = JSON.parse(localStorage.getItem("cartaoSus"));
    const frete = parseFloat(localStorage.getItem("freteValor") || 0);

    if (!produto || !endereco) {
        alert("Pedido incompleto");
        return;
    }

    const preco = parseFloat(produto.preco.replace("R$", "").replace(",", "."));
    let total = preco + frete;
    if (cartaoSus?.incluso) total += cartaoSus.preco;

    const texto = `
🛍️ *NOVO PEDIDO*

📘 ${produto.nome}
🖼️ ${produto.descricao}
${cartaoSus?.incluso ? "🪪 Cartão do SUS incluso" : ""}
👤 Nome da Criança :${endereco.crianca}

   *ENDEREÇO DA ENTREGA*

👤Cliente:${endereco.nome}
📍 Endereço: ${endereco.rua}, ${endereco.numero},
📍 Bairro: ${endereco.bairro}, 
📍 Ponto de Referência:${endereco.referencia},
📍 CEP: ${endereco.cep}

💰 *TOTAL Á PAGAR:* R$ ${total.toFixed(2)}

Seu pedido poderá ser pago no *PIX,
CARTÃO DE CRÉDITO - dividido em até 2x,
Dinheiro(Deve estar trocado no valor total do pedido)*


*Envie para o Cartão SUS* : NOME COMPLETO, DATA DE NASCIMENTO, NÚMERO DO CARTÃO

    `.trim();

    window.open(
        `https://wa.me/5574998066693?text=${encodeURIComponent(texto)}`,
        "_blank"
    );
}

/* ================= DESISTIR ================= */

function desistirCompra() {
    if (!confirm("Deseja cancelar o pedido?")) return;
    localStorage.clear();
    window.location.href = "index.html";
}

/* ================= CARTÃO DO SUS ================= */

function selecionarCartao(imagemCartao) {
    localStorage.setItem("cartaoSus", JSON.stringify({
        incluso: true,
        preco: PRECO_CARTAO_SUS_PROMO,
        imagem: imagemCartao
    }));

    window.location.href = "cadastro.html";
}


document.addEventListener("DOMContentLoaded", () => {
    const notification = document.getElementById("notification");
    const clientName = document.getElementById("client-name");
    const testimonialText = document.getElementById("testimonial-text");
    const clientPhoto = document.getElementById("client-photo");

    if (!notification || !clientPhoto) return;

    const notifications = [

        {
            name: "Carlos A. Silva",
            text: "Minha esposa adorou o presente, ficou perfeito",
            photo: "testemonials/a.webp"
        },
        {
            name: "Fernanda M. Rocha",
            text: "Qualidade excelente, chegou rapidinho",
            photo: "testemonials/b.webp"
        },
        {
            name: "Kelly P. Andrade",
            text: "Fiquei muito satisfeita com o resultado",
            photo: "testemonials/c.webp"
        },
        {
            name: "Fernanda Pacheco",
            text: "Produto lindo, superou minhas expectativas",
            photo: "testemonials/d.webp"
        },
        {
            name: "Mariana S. Costa",
            text: "Amei cada detalhe, recomendo demais",
            photo: "testemonials/e.webp"
        },
        {
            name: "Juliana Nogueira",
            text: "Muito bem feito, dá pra ver o capricho",
            photo: "testemonials/f.webp"
        },
        {
            name: "Renata Oliveira",
            text: "Com certeza comprarei novamente",
            photo: "testemonials/g.webp"
        },
        {
            name: "Patrícia Lima",
            text: "Chegou antes do prazo e é maravilhoso",
            photo: "testemonials/h.webp"
        },
        {
            name: "Camila Ferreira",
            text: "Simplesmente perfeito, amei",
            photo: "testemonials/i.webp"
        },
        {
            name: "Vanessa Albuquerque",
            text: "Ótimo acabamento e material de qualidade",
            photo: "testemonials/j.webp"
        },
        {
            name: "Aline Barbosa",
            text: "Atendimento excelente e produto impecável",
            photo: "testemonials/k.webp"
        },
        {
            name: "Bruna Monteiro",
            text: "Vale muito a pena, fiquei encantada",
            photo: "testemonials/l.webp"
        },
        {
            name: "Tatiane R. Lopes",
            text: "Presente perfeito, quem recebeu amou",
            photo: "testemonials/m.webp"
        },
        {
            name: "Daniela Farias",
            text: "Trabalho muito bem feito, recomendo",
            photo: "testemonials/n.webp"
        },
        {
            name: "Luciana Menezes",
            text: "Lindo demais, já quero outro",
            photo: "testemonials/o.webp"
        },
        {
            name: "Roberta Guedes",
            text: "Tudo feito com muito cuidado e carinho",
            photo: "testemonials/p.webp"
        },
        {
            name: "Simone Teixeira",
            text: "Experiência excelente do início ao fim",
            photo: "testemonials/q.webp"
        },
        {
            name: "Carolina P. Reis",
            text: "Produto maravilhoso e atendimento rápido",
            photo: "testemonials/r.webp"
        },
        {
            name: "Érica Santos",
            text: "Amei demais, super recomendo",
            photo: "testemonials/s.webp"
        },
        {
            name: "Paula Rodrigues",
            text: "Muito bonito, dá pra ver o cuidado",
            photo: "testemonials/t.webp"
        }

    ];

    let index = 0;

    function showNotification() {
        const item = notifications[index];

        clientName.textContent = item.name;
        testimonialText.textContent = item.text;

        // força atualização da imagem (evita cache)
        clientPhoto.src = item.photo + "?t=" + Date.now();

        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 4000);

        index = (index + 1) % notifications.length;
    }

    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 8000);
    }, 3000);
});
