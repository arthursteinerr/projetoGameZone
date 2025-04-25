// ==================== Variáveis Globais ====================
let carrinhoVisivel = false;
let carrinho = [];

// ==================== Funções de Carrinho ====================
function toggleCarrinho() {
  const carrinhoElemento = document.getElementById("corpocarrinho");
  carrinhoElemento.style.display = carrinhoVisivel ? "none" : "block";
  carrinhoVisivel = !carrinhoVisivel;
}

function adicionarAoCarrinho(produto, preco) {
  const produtoExistente = carrinho.find((item) => item.produto === produto);

  if (produtoExistente) {
    const confirmarRemocao = confirm(
      `O produto "${produto}" já está no carrinho. Deseja removê-lo?`
    );
    if (confirmarRemocao) {
      carrinho = carrinho.filter((item) => item.produto !== produto);
      exibirMensagem(
        `O produto "${produto}" foi removido do carrinho.`,
        "info"
      );
    }
  } else {
    if (confirm(`Deseja adicionar o produto "${produto}" ao carrinho?`)) {
      carrinho.push({ produto, preco });
      alert(`O produto "${produto}" foi adicionado ao carrinho com sucesso!`);
      document.querySelector("footer").style.display = "none"; // Oculta o footer
    }
  }

  exibirOrcamento();
  toggleCarrinho();

  const carrinhoElemento = document.getElementById("corpocarrinho");
  if (carrinhoVisivel) {
    document.body.style.overflow = "hidden"; // Desabilita o scroll
    carrinhoElemento.scrollIntoView({ behavior: "smooth" });
  } else {
    document.body.style.overflow = ""; // Habilita o scroll novamente
  }
}

// ==================== Funções de Exibição ====================
function exibirMensagem(mensagem, tipo) {
  const mensagemDiv = document.createElement("div");
  mensagemDiv.className = `mensagem ${tipo}`;
  mensagemDiv.textContent = mensagem;

  document.body.appendChild(mensagemDiv);
  setTimeout(() => mensagemDiv.remove(), 3000);
}

function exibirOrcamento() {
  console.clear();

  const subtotal = calcularSubtotal();
  const desconto = calcularDesconto(subtotal);
  const frete = calcularFrete();
  const total = calcularTotal(subtotal, desconto, frete);
  const tempoEntrega = calcularTempoEntrega();

  console.log("==== Orçamento ====");
  console.log("Produtos no carrinho:");
  carrinho.forEach(({ produto, preco }) =>
    console.log(`${produto}: R$ ${preco.toFixed(2)}`)
  );
  console.log(`Subtotal: R$ ${formatarNumero(subtotal)}`);
  console.log(`Desconto: R$ ${formatarNumero(desconto)}`);
  console.log(`Frete: R$ ${formatarNumero(frete)}`);
  console.log(`Tempo de entrega: ${tempoEntrega} dias úteis`);

  atualizarElementoHTML("totalDinheiro", `R$ ${formatarNumero(total)}`);
  atualizarElementoHTML("totalFrete", `R$ ${formatarNumero(frete)}`);
  atualizarElementoHTML("totalSub", `R$ ${formatarNumero(subtotal)}`);
  atualizarElementoHTML("totalDesc", `R$ ${formatarNumero(desconto)}`);
}

// ==================== Funções de Cálculo ====================
function calcularSubtotal() {
  return carrinho.reduce((subtotal, { preco }) => subtotal + preco, 0);
}

function calcularDesconto(subtotal) {
  return Math.random() * (100 - 5) + 5;
}

function calcularFrete() {
  return Math.random() * (20 - 5) + 5;
}

function calcularTempoEntrega() {
  return Math.floor(Math.random() * (7 - 3 + 1)) + 3;
}

function calcularTotal(subtotal, desconto, frete) {
  return subtotal - desconto + frete;
}

// ==================== Funções Auxiliares ====================
function atualizarElementoHTML(idElemento, conteudo) {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.textContent = conteudo;
}

function formatarNumero(numero) {
  return numero.toFixed(2);
}

// ==================== Validação de Campos ====================
function permitirApenasNumeros(event) {
  const input = event.target;
  input.value = input.value.replace(/\D/g, ""); // Remove qualquer caractere que não seja número
}

function formatarCPF(input) {
  let cpf = input.value.replace(/\D/g, "");
  cpf = cpf.slice(0, 11);
  if (cpf.length === 11) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  input.value = cpf;
}

function formatarCEP(input) {
  let cep = input.value.replace(/\D/g, ""); // Remove qualquer caractere que não seja número
  if (cep.length > 8) {
    cep = cep.slice(0, 8); // Limita o CEP a 8 caracteres
  }
  if (cep.length >= 5) {
    cep = cep.replace(/(\d{5})(\d{1,3})/, "$1-$2"); // Adiciona o hífen no formato 00000-000
  }
  input.value = cep; // Atualiza o valor do campo com o formato correto
}

// Adicionar evento de formatação ao campo de CEP
document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");
  if (cepInput) {
    cepInput.addEventListener("input", () => formatarCEP(cepInput));
  }
});

// ==================== Eventos de DOM ====================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar carrinho invisível
  document.getElementById("corpocarrinho").style.display = "none";

  // Adicionar eventos aos produtos
  document.querySelectorAll(".produto-item").forEach((produto) => {
    produto.addEventListener("click", () => {
      const produtoNome = produto.getAttribute("data-nome");
      const preco = parseFloat(produto.getAttribute("data-preco"));
      adicionarAoCarrinho(produtoNome, preco);
    });
  });

  // Evento para finalizar compra
  document.querySelector(".finalizar").addEventListener("click", () => {
    const cpf = document.getElementById("tamcpf").value;
    const cep = document.getElementById("cep").value;
    const numeroCasa = document.getElementById("houseNumber").value;

    // Validação do CPF
    if (!cpf) {
      alert("Por favor, digite seu CPF para prosseguir com a compra na GameZone!");
      return;
    } else if (cpf.length !== 14) {
      alert("Digite um CPF válido para concluir sua compra na GameZone!");
      return;
    }

    // Validação do CEP
    if (!cep) {
      alert("Por favor, digite seu CEP para prosseguir com a compra na GameZone!");
      return;
    } else if (cep.length !== 8) {
      alert("Digite um CEP válido no formato 00000-000 para continuar!");
      return;
    }

    // Validação do número da casa
    if (!numeroCasa) {
      alert("Por favor, informe o número da sua casa para finalizar a compra!");
      return;
    }

    // Confirmação final
    const confirmarCompra = confirm(
      "Deseja realmente finalizar a compra? Verifique se todos os dados estão corretos."
    );

    if (confirmarCompra) {
      alert("A compra foi finalizada com sucesso! Obrigado por confiar na GameZone!");
      
      // Limpar o carrinho
      carrinho = [];
      exibirOrcamento();

      // Ocultar o carrinho e habilitar o scroll
      document.getElementById("corpocarrinho").style.display = "none";
      carrinhoVisivel = false;
      document.body.style.overflow = ""; // Habilita o scroll novamente

      // Scroll para o topo da página
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Reexibir o footer após 1 segundo
      setTimeout(() => {
        document.querySelector("footer").style.display = "block";
      }, 1000);
    } else {
      alert("A compra foi cancelada. Continue navegando na GameZone!");
    }
  });

  // Aplicar validação de números nos campos específicos
  ["cep", "houseNumber", "tamcpf"].forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) campo.addEventListener("input", permitirApenasNumeros);
  });

  // Formatar CPF dinamicamente
  const cpfInput = document.getElementById("tamcpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", () => formatarCPF(cpfInput));
  }
});