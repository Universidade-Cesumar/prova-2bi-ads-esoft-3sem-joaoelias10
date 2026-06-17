# Sistema de Controle de Almoxarifado — Gestão de Materiais

Este projeto consiste em um sistema web dinâmico desenvolvido para a gestão simplificada de estoque e controle de materiais em um almoxarifado de Enfermagem do SENAC Zona Norte. A aplicação consome e manipula dados em tempo real de uma API RESTful simulada (MockAPI), permitindo o cadastro, listagem, atualização de saldo (baixas) e exclusão de insumos de forma totalmente persistente e sem a necessidade de frameworks externos.

---

## 🎨 Identidade Visual & Cores do Projeto

Para manter a consistência com a interface do sistema e com o padrão institucional, o projeto utiliza a seguinte paleta de cores oficial:

* 🔵 **Azul Institucional (Headers & Destaques):** `#004c97` — Cor predominante nos títulos principais, cabeçalhos de tabelas e foco de interações.
* 🟢 **Verde Saúde/Sucesso (Ações Positivas):** `#008542` — Utilizado no botão principal de cadastro (`#btn-cadastrar`).
* 🔴 **Erros, Alertas e Remoção:** `#dc3545` / `#FF0000` — Utilizado para o botão de exclusão e mensagens visuais de falha na sincronização da API.
* ⚪ **Fundo da Interface:** `#f4f6f9` / `#f8fafc` — Base limpa para otimização da leitura de tabelas e formulários.
* ⚫ **Texto Principal:** `#333333` — Grafite escuro para máxima acessibilidade e contraste de leitura.

---

## 🚀 Funcionalidades do Sistema

* **Listagem Dinâmica e Resiliente:** Consumo de dados assíncrono via método `GET` no MockAPI com renderização automatizada. Possui tratamento robusto para mapeamento de chaves de identificação (`material.id`), evitando falhas de exibição na interface.
* **Cadastro de Materiais:** Envio de novos registros estruturados utilizando o método `POST`, com persistência imediata no banco de dados em nuvem e limpeza automatizada do formulário.
* **Controle Estatístico de Saídas (Baixa de Estoque):** Módulo de retirada integrado que recalcula o saldo de insumos e atualiza o servidor em nuvem utilizando o método `PUT`.
* **Exclusão Definitiva de Itens:** Módulo de remoção física de registros utilizando o método `DELETE`, limpando o banco de dados e removendo a linha correspondente do DOM em tempo real.
* **Otimização de UX & Proteção de Interface:** Bloqueio temporário de botões (`disabled = true`) durante requisições assíncronas para evitar cliques duplos, além de caixas de diálogo para dupla confirmação em ações críticas (como exclusões).
* **Tratamento de Erros:** Implementação generalizada de blocos `try/catch/finally` para capturar falhas de rede de forma graciosa, substituindo o travamento da tela por feedbacks amigáveis.

---

## 📐 Regras de Negócio & Contrato Técnico

A aplicação implementa regras rígidas de consistência localizadas na arquitetura através de especificações estritas:

1. **Validação de Retiradas:** Através da função lógica `validarRetirada(estoqueAtual, quantidadeRetirada)`, o sistema impede que sejam processadas saídas de valores negativos, nulos, caracteres inválidos (`NaN`) ou quantidades superiores ao saldo atual disponível no almoxarifado.
2. **Elementos de Interface Obrigatórios:**
   * `id="input-retirada"`: Input numérico por linha para coleta da quantidade a ser deduzida.
   * `class="btn-baixar"`: Classe de disparo para a atualização e subtração do estoque (Método `PUT`).
   * `class="btn-excluir"`: Classe de disparo para a remoção permanente do material (Método `DELETE`).

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5 Estrutural, CSS3 (Estilização baseada em variáveis nativas e design responsivo) e JavaScript Moderno puro (ES6+, requisições assíncronas com `Async/Await`, `Fetch API` e arquitetura baseada em Delegação de Eventos).
* **Banco de Dados/API:** MockAPI (Serviço de simulação de APIs RESTful).
* **Versionamento e Entrega:** Git e GitHub (Histórico de progresso documentado por commits semânticos incrementais).