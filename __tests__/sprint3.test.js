const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const jsCode = fs.readFileSync(path.resolve(__dirname, '../main.js'), 'utf8');

describe('Sprint 3 - Dashboard e Polimento', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    test('Deve conter os IDs da barra de pesquisa e do Dashboard', () => {
        expect(document.getElementById('input-busca')).not.toBeNull();
        expect(document.getElementById('total-itens')).not.toBeNull();
    });

    test('Deve possuir lógica de tratamento de erro (try/catch)', () => {
        // O robô procura se o aluno usou a estrutura try/catch exigida no contrato
        expect(jsCode).toMatch(/try\s*\{/);
        expect(jsCode).toMatch(/catch\s*\(/);
    });
});