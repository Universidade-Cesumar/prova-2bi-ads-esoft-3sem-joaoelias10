const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const jsCode = fs.readFileSync(path.resolve(__dirname, '../main.js'), 'utf8');

describe('Sprint 2 - Regras de Negócio e Saídas', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    test('Deve conter os IDs e Classes para baixa e exclusão', () => {
        expect(document.getElementById('input-retirada')).not.toBeNull();
        // Verifica se as classes obrigatórias existem pelo menos no CSS ou no JS (já que são injetadas dinamicamente)
        expect(jsCode.includes('btn-baixar') || html.includes('btn-baixar')).toBeTruthy();
        expect(jsCode.includes('btn-excluir') || html.includes('btn-excluir')).toBeTruthy();
    });

    test('A função validarRetirada deve respeitar as regras do estoque', () => {
        // Extrai a função do aluno do main.js usando uma técnica segura para testes isolados
        const script = new Function(`${jsCode}; return typeof validarRetirada === "function" ? validarRetirada : null;`);
        const validarRetirada = script();

        expect(validarRetirada).not.toBeNull();
        if (validarRetirada) {
            expect(validarRetirada(10, 5)).toBe(true);   // Tirar 5 de 10 = OK
            expect(validarRetirada(5, 10)).toBe(false);  // Tirar 10 de 5 = Erro
            expect(validarRetirada(10, -2)).toBe(false); // Tirar negativo = Erro
            expect(validarRetirada(10, 0)).toBe(false);  // Tirar zero = Erro
        }
    });
});