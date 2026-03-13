// Salva as configurações
document.getElementById('saveBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const token = document.getElementById('token').value;
  const domain = document.getElementById('domain').value;

  chrome.storage.local.set({
    jiraEmail: email,
    jiraToken: token,
    jiraDomain: domain
  }, () => {
    const status = document.getElementById('status');
    status.innerText = "✅ Configurações salvas!";
    setTimeout(() => { status.innerText = ""; }, 2000);
  });
});

// Carrega os dados salvos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['jiraEmail', 'jiraToken', 'jiraDomain'], (res) => {
    if (res.jiraEmail) document.getElementById('email').value = res.jiraEmail;
    if (res.jiraToken) document.getElementById('token').value = res.jiraToken;
    if (res.jiraDomain) document.getElementById('domain').value = res.jiraDomain;
  });
});