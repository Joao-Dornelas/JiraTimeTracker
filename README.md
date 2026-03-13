# ⏱️ Jira Time Tracker - Chrome Extension

![Versão](https://img.shields.io/badge/version-1.1-blue)
![Manifest](https://img.shields.io/badge/manifest-V3-green)
[![Disponível na Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Dispon%C3%ADvel-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/cdhhcbgofadmioednlahcfghmbldnbkl)
![Autor](https://img.shields.io/badge/autor-Jo%C3%A3o%20Ant%C3%B4nio%20de%20Souza%20Dornelas-orange)

Uma extensão para Google Chrome desenvolvida para simplificar e automatizar o registro de **worklogs** no **Jira Cloud**. Esta ferramenta elimina o preenchimento manual de horas ao final do dia, garantindo precisão no faturamento de demandas.


## 🚀 Principais Funcionalidades

* **Cronômetro Persistente:** Inicie o timer e feche o popup; o tempo continua sendo contabilizado graças à integração com `chrome.storage`.
* **Detecção Inteligente de Contexto:** Utiliza a permissão `activeTab` para capturar automaticamente a chave da tarefa (ex: `TIS-3056`) se você estiver navegando em uma página do Jira.
* **Lançamento Direto via API:** Envia o tempo gasto (convertido para segundos) diretamente para a API REST da Atlassian com um único clique.
* **Segurança Local:** E-mail, API Token e Domínio são armazenados localmente no navegador, garantindo que suas credenciais nunca saiam da sua máquina.

## 🛠️ Stack Técnica

* **Linguagem:** JavaScript
* **Arquitetura:** Chrome Extension Manifest V3
* **Interface:** HTML5 & CSS3 (Design responsivo para popup)
* **Integração:** Jira Cloud REST API (Worklog Endpoint)

## 📦 Instalação para Desenvolvedores

Se você deseja clonar este projeto e rodar em modo de desenvolvimento em sua máquina:

1.  Clone este repositório:
    ```bash
    git clone [Jira Time Tracker](https://github.com/Joao-Dornelas/JiraTimeTracker)
    ```
2.  Abra o Google Chrome e acesse `chrome://extensions/`.
3.  Ative o **Modo do desenvolvedor** (canto superior direito).
4.  Clique em **Carregar sem compactação** e selecione a pasta onde clonou o projeto.

## ⚙️ Configuração da API

Para que a extensão se comunique com o seu Jira, siga estes passos:
1.  Clique com o botão direito no ícone da extensão e vá em **Opções**.
2.  Insira o seu **Domínio** (ex: `minhaempresa`).
3.  Insira seu **E-mail Atlassian**.
4.  Gere e insira um **API Token** oficial da Atlassian [neste link](https://id.atlassian.com/manage-profile/security/api-tokens).



## 🛡️ Privacidade e Segurança

O **Jira Time Tracker** foi construído sob o princípio de *Privacy by Design*:
* **Sem Coleta Remota:** Não utiliza scripts externos (No Remote Code).
* **Isolamento de Dados:** Nenhuma informação é enviada para servidores de terceiros.
* **Transparência:** O único destino dos dados é o endpoint oficial da Atlassian configurado pelo usuário.

---

## 👨‍💻 Autor

Desenvolvido por **João Dornelas** 📍 São João del Rei - MG, Brasil.

---
© 2026 Jira Time Tracker - Distribuído sob a Licença MIT.
