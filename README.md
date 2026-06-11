# Sistema de Controle de Almoxarifado — Gestão de Materiais

Este projeto consiste em um sistema web dinâmico desenvolvido para a gestão simplificada de estoque e controle de materiais em um almoxarifado. A aplicação consome dados em tempo real de uma API Restful simulada (MockAPI), permitindo a listagem dinâmica e o cadastro de novos insumos de forma totalmente persistente.

---

## 🎨 Identidade Visual & Cores do Projeto

Para manter a consistência com a interface do seu sistema e com o padrão institucional da faculdade, o projeto utiliza a seguinte paleta de cores oficial:

* 🔵 **Azul Institucional (Headers):** `#004B8D` — Cor predominante nos títulos principais e cabeçalhos de tabelas (`Materiais em Estoque`).
* 🔷 **Azul Interativo (Botões/Ações):** `#4A90E2` — Utilizado no botão de cadastro (`#btn-cadastrar`) e estados de foco.
* 🔴 **Erros e Alertas:** `#FF0000` — Utilizado para mensagens e tarjas visuais de falha na sincronização da API.
* ⚪ **Fundo da Interface:** `#F8FAFC` — Base limpa para otimização da leitura de tabelas e formulários.
* ⚫ **Texto Principal:** `#1E293B` — Grafite escuro para máxima acessibilidade e contraste de leitura.

---

## 🚀 Funcionalidades Implementadas (Sprint 1)

* **Listagem Dinâmica:** Consumo de dados assíncrono via método `GET` na API do MockAPI e renderização automatizada dos materiais na tabela HTML.
* **Mapeamento Dinâmico de Identificadores:** Tratamento robusto de chaves (`material.id || material.material`), garantindo que o identificador único seja exibido perfeitamente na interface, independente da nomenclatura interna gerada pelo Schema da API.
* **Cadastro de Materiais:** Envio de novos registros estruturados utilizando o método `POST`, com persistência imediata no banco de dados em nuvem.
* **Validação de Dados no Front-end:** Mecanismo de segurança para impedir o envio de campos vazios, strings em campos numéricos ou quantidades inválidas (valores menores que zero).
* **Otimização de UX:** Bloqueio temporário do botão de envio (`disabled = true`) e alteração visual do texto para *"Cadastrando..."* durante a requisição assíncrona, evitando duplicidade de cliques e registros redundantes.
* **Tratamento de Erros e Resiliência:** Implementação de blocos `try/catch/finally` para capturar falhas de rede de forma graciosa, substituindo o travamento da tela por mensagens amigáveis e reativando os controles de forma automática.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5 Estrutural, CSS3 (Estilização baseada em paleta corporativa) e JavaScript Moderno (ES6+, requisições assíncronas com `Async/Await` e `Fetch API`).
* **Banco de Dados/API:** MockAPI (Serviço de simulação de APIs REST).
* **Versionamento e Entrega:** Git e GitHub (Repositório institucional da organização).

---