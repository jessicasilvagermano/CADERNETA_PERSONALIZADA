document.addEventListener("DOMContentLoaded", function () {
    const btnBasica = document.getElementById("btnBasica");
    const btnLuxo = document.getElementById("btnLuxo");

    if (btnBasica && btnLuxo) {
        btnBasica.addEventListener("click", () => escolherCategoria("basica"));
        btnLuxo.addEventListener("click", () => escolherCategoria("luxo"));
    }
});

function escolherCategoria(tipo) {
    let categoriaContainer = document.getElementById("categoria");
    if (!categoriaContainer) {
        categoriaContainer = document.createElement("div");
        categoriaContainer.id = "categoria";
        document.body.appendChild(categoriaContainer);
    }

    categoriaContainer.innerHTML = `
        <h2>Click e veja as capas '${tipo}' disponíveis para:</h2>
        <button onclick="showProducts('${tipo}', 'meninas')">Meninas</button>
        <button onclick="showProducts('${tipo}', 'meninos')">Meninos</button>
    `;
}

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

    productList.innerHTML = products[tipo].map(produto => `
        <div class="product">
            <img src="${produto.imagem}" alt="${produto.nome}" />
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <p><strong>${produto.preco}</strong></p>
            <button onclick="selecionarProduto('${produto.nome}', '${produto.preco}', '${produto.descricao}', '${produto.imagem}')">
                Selecionar
            </button>
        </div>
    `).join('');
}

function buscarEndereco() {
    
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    

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
        .catch(error => console.error("Erro ao buscar CEP:", error));
}

function selecionarProduto(nome, preco, descricao, imagem) {
    const produto = { nome, preco, descricao, imagem };
    localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
    window.location.href = "cadastro.html";
}

const testimonials = [
    { name: "Aninha -Juá", text: "Entrega rápida e só paga quando recebe. Amei a minha  ", photo: "testemonials/a.webp" },
    { name: "Carlos Massangano", text: "Super perfeita, eu amei 😍", photo: "testemonials/b.webp" },
    { name: "Mariana st Antônio", text: "Atendimento excelente, vale muito a pena! Facil de comprar e só paga na entrega", photo: "testemonials/c.webp" },
    { name: "jb Santos- bairro coreia", text: "Entrega rápida e vendedora sempre disponível!", photo: "testemonials/d.webp" },
    { name: "Nanda -malhada da areia", text: "Preço justo e de qualidade !", photo: "testemonials/e.webp" },
    { name: "Jonas- petrolina", text: "Chegou perfeita 😍", photo: "testemonials/f.webp" },
    { name: "Zé Mª- Alto da maravilha", text: "Amei. Veio com o nome do meu bebê e igual fiz o pedido", photo: "testemonials/g.webp" },
    { name: "Luana- centro", text: "Fácil e seguro de comprar. Gostei demais", photo: "testemonials/h.webp" },
    { name: "Rúbia", text: "maravilhosoooo .Por ser personalizada eu achava que ia demorar muito, mais foi rápido.Amei", photo: "testemonials/i.webp" },
    { name: "crislaine", text: "Entrega rápida e de qualidade e personalizada, amei", photo: "testemonials/j.webp" },
    { name: "Pyetra", text: "Muito bom, achei a loja pelo instagram!", photo: "testemonials/k.webp" },
    { name: "Alice", text: "É só fazer o pedido e aguardar chegar. Adorei! Caderneta linda", photo: "testemonials/l.webp" },
    { name: "Glaucia- ", text: "Foi presente, minha tia adorou", photo: "testemonials/m.webp" },
    { name: "Cleber", text: "Amei a entrega é muito rápida", photo: "testemonials/n.webp" },
    { name: "Patricia", text: "Gostei demais, agora é só esperar meu bebe chegar", photo: "testemonials/o.webp" },
    { name: "Lucinha", text: "ADOREI,AMEI", photo: "testemonials/p.webp" },
    { name: "João Lucas", text: "Adorei a compra e já indiquei", photo: "testemonials/q.webp" },
    { name: "VERA", text: "Entrega rápida e caderneta personalizada, muito bom", photo: "testemonials/r.webp" },
    { name: "Claudia", text: "Gostei de tudo. Achei facil de comprar", photo: "testemonials/s.webp" },
    { name: "Lana", text: "é linda minha cadernetinha", photo: "testemonials/t.webp" }
]

let index = 0;
function showNotification() {
    const notification = document.getElementById('notification');
    const clientPhoto = document.getElementById('client-photo');
    const clientName = document.getElementById('client-name');
    const testimonialText = document.getElementById('testimonial-text');
    
    clientPhoto.src = testimonials[index].photo;
    clientName.textContent = testimonials[index].name;
    testimonialText.textContent = testimonials[index].text;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
    
    index = (index + 1) % testimonials.length;
}

setInterval(showNotification, 5000);




function exibirResumoPedido() {
    const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
    const endereco = JSON.parse(localStorage.getItem("endereco"));

    if (produto && endereco) {
        const dataEntrega = calcularDataEntrega();  // agora calcula dias úteis!

        document.getElementById("pedido").innerHTML = 
            `<img src="${produto.imagem}" alt="${produto.nome}">
            <p><strong>Cliente (Seu Nome aqui):</strong> ${endereco.nome}</p>
            <p><strong>Produto:</strong> ${produto.nome}</p>
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Nome para personalizar:</strong> ${endereco.crianca}</p>
            <p><strong>Preço:</strong> ${produto.preco}</p>
            <p><strong>Frete:</strong> ${endereco.frete || "Não calculado"}</p>
            <p><strong>Previsão de Entrega:</strong> ${dataEntrega}</p>


            <h2>Endereço para Entrega:</h2>
            <p><strong>CEP:</strong> ${endereco.cep}</p>
            <p><strong>Rua:</strong> ${endereco.rua}</p>
            <p><strong>Número da casa:</strong> ${endereco.numero}</p>
            <p><strong>Bairro:</strong> ${endereco.bairro}</p>
            <p><strong>Cidade:</strong> ${endereco.cidade}</p>
            <p><strong>Ponto de Referência:</strong> ${endereco.referencia}</p>
        `;
    }
}


function calcularFrete() {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido! Digite um CEP com 8 dígitos.");
        return;
    }

    const faixasDeFrete = [
        { faixaInicio:  48900000, faixaFim: 48904999, valor: 0.00 }, // centro, e bairros adjacentes
        { faixaInicio:  48916000, faixaFim: 48917000, valor: 0.00 }, // codevasf, malhada, etc
        { faixaInicio: 56300001, faixaFim: 56334999, valor: 5.00 } // Petrolina
    ];

    let valorFrete = 0.00;
    const cepNumero = parseInt(cep, 10);

    for (const faixa of faixasDeFrete) {
        if (cepNumero >= faixa.faixaInicio && cepNumero <= faixa.faixaFim) {
            valorFrete = faixa.valor;
            break;
        }
    }

    // Verifica se o elemento existe antes de definir o innerText
    const freteElement = document.getElementById("frete");
    if (freteElement) {
        freteElement.innerText = `Frete: R$ ${valorFrete.toFixed(2)}`;
    }

    let endereco = JSON.parse(localStorage.getItem("endereco")) || {};
    endereco.frete = `R$ ${valorFrete.toFixed(2)}`;
    localStorage.setItem("endereco", JSON.stringify(endereco));
}


function salvarEndereco() {
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const referencia = document.getElementById("referencia").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const crianca = document.getElementById("crianca").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

   


    if (!cep || cep.length !== 8 || isNaN(cep)) {
        alert("CEP inválido! Digite um CEP com 8 dígitos.");
        return;
    }

    if (!rua || !bairro || !referencia || !numero || !nome || !frete || !crianca || !cidade) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    calcularFrete();
    
    setTimeout(() => {
        const frete = document.getElementById("frete").innerText.replace("Frete: ", "").trim();
        const endereco = { cep, rua, bairro, referencia, numero, nome, frete, crianca, cidade };
        localStorage.setItem("endereco", JSON.stringify(endereco));
        window.location.href = "resumo.html";
    }, 500);
}








function confirmarPedido() {
    const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
    const endereco = JSON.parse(localStorage.getItem("endereco"));
    const dataEntrega = calcularDataEntrega();  // agora calcula dias úteis!

    if (!produto || !endereco) {
        alert("Erro: Não foi possível recuperar os dados do pedido.");
        return;
    }

    // Número de WhatsApp da empresa (coloque o correto)
    const numeroEmpresa = "5574998066693"; 

    // Montar a mensagem para o WhatsApp
    const mensagem = 
    `*Resumo do Pedido* - ${produto.nome}
    
    
    
-> *Cliente:* ${endereco.nome}
-> *Capa escolhida:* ${produto.descricao}
-> *Nome da Criança:* ${endereco.crianca}
-> *Preço:* ${produto.preco}
-> *Frete:* ${endereco.frete || "Não calculado"}
-> *Previsão de entrega:* ${dataEntrega}


---------------------------------------------------------------

  *Endereço de Entrega:*

-> *CEP:* ${endereco.cep}
-> *Rua:* ${endereco.rua}, Nº ${endereco.numero}
-> *Bairro:* ${endereco.bairro}
-> *Cidade:* ${endereco.cidade}
-> *Ponto de Referência:* ${endereco.referencia}


*Olá! Estou enviando MEU PEDIDO! Aguardo sua confirmação.`;

    // Codificar a mensagem para a URL do WhatsApp
    const mensagemEncoded = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/${numeroEmpresa}?text=${mensagemEncoded}`;

    // Redirecionar para o WhatsApp
    window.open(whatsappUrl, "_blank");
}

function desistirCompra() {
    alert("Obrigado por visitar nossa loja!😊");

    // URL do Instagram da empresa
    const instagramUrl = "https://www.instagram.com/leaoestampariajua";

    // Redirecionar para o Instagram
    window.location.href = instagramUrl;
}

document.addEventListener("DOMContentLoaded", function () {
    const btnBasica = document.getElementById("btnBasica");
    const btnLuxo = document.getElementById("btnLuxo");
    const cepInput = document.getElementById("cep");

  
    if (cepInput) {
        cepInput.addEventListener("blur", buscarEndereco);
    }

    if (document.getElementById("pedido")) {
        exibirResumoPedido();
    }
});



function calcularDataEntrega() {
    let data = new Date();
    let diasAdicionados = 0;

    while (diasAdicionados < 3) {
        data.setDate(data.getDate() + 1);
        const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado

        if (diaSemana !== 0 && diaSemana !== 6) {
            diasAdicionados++;
        }
    }

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}
