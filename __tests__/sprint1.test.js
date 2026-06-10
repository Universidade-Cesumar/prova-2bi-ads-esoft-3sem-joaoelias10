const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Sprint 1 - Fundação e Inventário', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    });

    test('Deve conter os IDs obrigatórios do formulário e lista', () => {
        expect(document.getElementById('input-nome')).not.toBeNull();
        expect(document.getElementById('input-quantidade')).not.toBeNull();
        expect(document.getElementById('btn-cadastrar')).not.toBeNull();
        expect(document.getElementById('lista-materiais')).not.toBeNull();
    });
});