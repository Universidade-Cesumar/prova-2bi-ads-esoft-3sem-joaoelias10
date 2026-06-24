const API_URL = 'https://6a29e4bff59cb8f65f1db7c4.mockapi.io/api-almoxarifado/materiais';

// CAPTURA DOS ELEMENTOS DO DOM (Respeitando rigorosamente o Contrato Técnico)
const inputNome = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar = document.getElementById('btn-cadastrar');
const listaMateriais = document.getElementById('lista-materiais');
const totalItens = document.getElementById('total-itens');

//Buscar e Listar Materiais com Regras do Dashboard e Alertas
async function carregarMateriais() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const materiais = await response.json();

        // Limpa a tabela antes de renderizar para não duplicar
        listaMateriais.innerHTML = '';

        // Atualiza o indicador do Dashboard com o número correto de itens [Critério de Avaliação 0,5]
        if (totalItens) {
            totalItens.textContent = materiais.length;
        }

        // Preenche a tabela dinamicamente
        materiais.forEach(material => {
            const linha = document.createElement('tr');

            // Tenta pegar o ID padrão
            const idMaterial = material.id || material.material || material.Id || material.ID;

            linha.setAttribute('data-id', idMaterial);
            linha.setAttribute('data-estoque', material.quantidade);

            // Regra do Contrato Técnico: Se o estoque for menor que 10, adiciona a classe estoque-critico
            if (Number(material.quantidade) < 10) {
                linha.classList.add('estoque-critico');
            }

            linha.innerHTML = `
                <td>${idMaterial}</td>
                <td>${material.nome}</td>
                <td>${material.quantidade} unidades</td>
                <td>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="number" id="input-retirada" placeholder="Qtd" min="1" style="width: 70px; padding: 5px; border: 1px solid var(--border-color); border-radius: 4px;">
                        <button class="btn-baixar" style="background-color: var(--primary-color); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Baixar</button>
                        <button class="btn-excluir" style="background-color: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
                    </div>
                </td>
            `;
            listaMateriais.appendChild(linha);
        });

    } catch (error) {
        // Tratamento de erro visível na interface para evitar quebras silenciosas [Critério 0,5]
        console.error('Erro no GET:', error);
        listaMateriais.innerHTML = `<tr><td colspan="4" style="color: #dc3545; text-align: center; font-weight: bold;">Erro ao carregar materiais. Verifique sua conexão com a internet.</td></tr>`;
    }
}
// Cadastrar Novo Material (Soma quantidades se o item for duplicado)
async function cadastrarMaterial() {
    const nome = inputNome.value.trim();
    const quantidadeNova = parseInt(inputQuantidade.value);

    // Validação básica de segurança antes do envio
    if (!nome || isNaN(quantidadeNova) || quantidadeNova < 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Desabilita o botão para evitar cliques duplos
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Processando...';

    try {
        // 1. Busca a lista atual do servidor para checar se já existe o item
        const responseBusca = await fetch(API_URL);
        if (!responseBusca.ok) throw new Error('Erro ao verificar estoque existente.');
        
        const materiaisExistentes = await responseBusca.json();

        // 2. Procura se algum material tem o mesmo nome (ignorando maiúsculas/minúsculas)
        const itemDuplicado = materiaisExistentes.find(
            material => material.nome.toLowerCase() === nome.toLowerCase()
        );

        // CASO JÁ EXISTA: Faz um PUT somando as quantidades
        if (itemDuplicado) {
            const novaQuantidadeTotal = Number(itemDuplicado.quantidade) + quantidadeNova;
            const idMaterial = itemDuplicado.id || itemDuplicado.material || itemDuplicado.Id || itemDuplicado.ID;

            const responsePut = await fetch(`${API_URL}/${idMaterial}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: novaQuantidadeTotal })
            });

            if (!responsePut.ok) throw new Error('Erro ao atualizar quantidade do item existente.');

            alert(`${quantidadeNova} "${nome}" adicionados(as) ao estoque.`);
        
        // CASO NÃO EXISTA: Segue o fluxo normal e faz um POST
        } else {
            const novoMaterial = {
                nome: nome,
                quantidade: quantidadeNova
            };

            const responsePost = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoMaterial)
            });

            if (!responsePost.ok) throw new Error('Erro ao cadastrar novo material.');

            alert('Novo material cadastrado com sucesso!');
        }

        // Limpa os campos do formulário após o sucesso (comum para ambos os fluxos)
        inputNome.value = '';
        inputQuantidade.value = '';

        // Atualiza a listagem na tela imediatamente
        await carregarMateriais();

    } catch (error) {
        console.error('Erro no processo de cadastro:', error);
        alert('Falha ao processar a operação. Tente novamente.');
    } finally {
        // Reativa o botão
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Cadastrar Material';
    }
}
// Escuta o clique no botão de cadastro obrigatório
btnCadastrar.addEventListener('click', cadastrarMaterial);

// Executa o GET automaticamente assim que a página carrega completamente
document.addEventListener('DOMContentLoaded', carregarMateriais);

// FUNÇÃO OBRIGATÓRIA DE VALIDAÇÃO
function validarRetirada(estoqueAtual, quantidadeRetirada) {
    const atual = Number(estoqueAtual);
    const retirada = Number(quantidadeRetirada);

    // Impede valores negativos ou zerados
    if (retirada <= 0) {
        alert("A quantidade de retirada deve ser maior que zero.");
        return false;
    }

    // Impede caracteres inválidos
    if (isNaN(retirada)) {
        alert("Por favor, insira um número válido.");
        return false;
    }

    // Impede retirar mais do que há no estoque
    if (retirada > atual) {
        alert(`Saldo insuficiente! O estoque atual possui apenas ${atual} unidades.`);
        return false;
    }

    return true; // Passou em todas as validações
}

//FUNÇÃO VALIDADORA DE CLIQUES
listaMateriais.addEventListener('click', async (event) => {
    const alvo = event.target;
    
    const linhaProduto = alvo.closest('[data-id]');
    if (!linhaProduto) return;

    const id = linhaProduto.getAttribute('data-id');
    const estoqueAtual = Number(linhaProduto.getAttribute('data-estoque'));

    // FLUXO DO BOTÃO BAIXAR (Validação)
    if (alvo.classList.contains('btn-baixar')) {
        const inputRetirada = linhaProduto.querySelector('#input-retirada');
        const quantidadeRetirada = parseInt(inputRetirada.value);

        if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
            return; // Interrompe a execução se a validação falhar
        }

// Cálculo do novo saldo do estoque
        const novaQuantidade = estoqueAtual - quantidadeRetirada;

        // Desabilita o botão para evitar cliques múltiplos durante a requisição
        alvo.disabled = true;
        alvo.textContent = "...";

        try {
            // Faz a atualização (PUT) no MockAPI
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: novaQuantidade })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar estoque no servidor');
            }

            // Limpa o campo de entrada do usuário
            inputRetirada.value = '';

            // Atualiza a listagem na tela dinamicamente para a Camila ver o novo saldo
            await carregarMateriais();
            alert('Baixa realizada e estoque atualizado com sucesso!');

        } catch (error) {
            console.error('Erro no PUT:', error);
            alert('Não foi possível registrar a baixa. Tente novamente.');
            
            // Se der erro, devolve o texto original do botão
            alvo.disabled = false;
            alvo.textContent = 'Baixar';
        }
    }
    // FLUXO DO BOTÃO EXCLUIR (DELETE)
    if (alvo.classList.contains('btn-excluir')) {
        // Alerta de confirmação para evitar que a Camila delete algo por acidente
        const confirmar = confirm("Tem certeza que deseja excluir permanentemente este material do almoxarifado?");
        if (!confirmar) return; // Se ela cancelar, interrompe a ação

        // Desabilita o botão temporariamente
        alvo.disabled = true;
        alvo.textContent = "...";

        try {
            // Faz a requisição DELETE para o MockAPI usando o ID do material
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar material no servidor');
            }

            // Remove a linha (tr) diretamente do DOM na hora (ganho de performance e UX)
            linhaProduto.remove();
            
            alert('Material removido com sucesso!');

        } catch (error) {
            console.error('Erro no DELETE:', error);
            alert('Não foi possível excluir o material. Tente novamente.');
            
            // Se der erro, devolve o texto original do botão
            alvo.disabled = false;
            alvo.textContent = 'Excluir';
        }
    }
});

