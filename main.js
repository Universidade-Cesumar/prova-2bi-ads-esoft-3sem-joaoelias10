// CONSTANTES GLOBAIS - Sua URL oficial do MockAPI configurada
const API_URL = 'https://6a29e4bff59cb8f65f1db7c4.mockapi.io/api-almoxarifado/materiais';

// CAPTURA DOS ELEMENTOS DO DOM (Respeitando rigorosamente o Contrato Técnico)
const inputNome = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar = document.getElementById('btn-cadastrar');
const listaMateriais = document.getElementById('lista-materiais');

//Buscar e Listar Materiais
async function carregarMateriais() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const materiais = await response.json();

        // Limpa a tabela antes de renderizar para não duplicar
        listaMateriais.innerHTML = '';

        // Preenche a tabela dinamicamente
        materiais.forEach(material => {
            const linha = document.createElement('tr');

            // Tenta pegar o ID padrão
            const idMaterial = material.id || material.material || material.Id || material.ID;

            linha.innerHTML = `
                <td>${idMaterial}</td>
                <td>${material.nome}</td>
                <td>${material.quantidade} unidades</td>
            `;
            listaMateriais.appendChild(linha);
        });s

    } catch (error) {
        console.error('Erro no GET:', error);
        listaMateriais.innerHTML = `<tr><td colspan="3" style="color: red; text-align: center;">Erro ao carregar materiais. Verifique a API.</td></tr>`;
    }
}
//Cadastrar Novo Material
async function cadastrarMaterial() {
    const nome = inputNome.value.trim();
    const quantidade = parseInt(inputQuantidade.value);

    // Validação básica de segurança antes do envio
    if (!nome || isNaN(quantidade) || quantidade < 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Desabilita o botão para evitar cliques duplos (Boa prática de UX)
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Cadastrando...';

    const novoMaterial = {
        nome: nome,
        quantidade: quantidade
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoMaterial)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar material');
        }

        // Limpa os campos do formulário após o sucesso
        inputNome.value = '';
        inputQuantidade.value = '';

        // Atualiza a listagem na tela imediatamente para a Camila ver o resultado
        await carregarMateriais();
        alert('Material cadastrado com sucesso!');

    } catch (error) {
        console.error('Erro no POST:', error);
        alert('Falha ao salvar o material. Tente novamente.');
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