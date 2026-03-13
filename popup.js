let seconds = 0;
let timerInterval;

const toggleBtn = document.getElementById('toggleBtn');
const issueKeyInput = document.getElementById('issueKey');
const worklogCommentInput = document.getElementById('worklogComment');
const startDateInput = document.getElementById('startDate');

const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  startDateInput.value = now.toISOString().slice(0, 16);

  chrome.storage.local.get(['startTime', 'isRunning', 'savedSeconds', 'lastIssueKey', 'lastComment'], (res) => {
    if (res.isRunning && res.startTime) {
      const currentTime = Date.now();
      const elapsedSinceStart = Math.floor((currentTime - res.startTime) / 1000);
      seconds = (res.savedSeconds || 0) + elapsedSinceStart;
      
      startTimer();
      updateButtonUI(true);
    } else {
      seconds = res.savedSeconds || 0;
      updateDisplay();
      updateButtonUI(false);
    }

    if (res.lastIssueKey) issueKeyInput.value = res.lastIssueKey;
    if (res.lastComment) worklogCommentInput.value = res.lastComment;

    // Detecção automática do card no Jira
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const match = tabs[0].url.match(/[A-Z]+-\d+/); 
        const detectedKey = match ? match[0] : null;

        if (detectedKey) {
          issueKeyInput.value = detectedKey;
          chrome.storage.local.set({ lastIssueKey: detectedKey });
        }
      }
    });
  });
});


worklogCommentInput.addEventListener('input', () => {
  chrome.storage.local.set({ lastComment: worklogCommentInput.value });
});

function updateDisplay() {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  
  if (hoursDisplay) hoursDisplay.innerText = h;
  if (minutesDisplay) minutesDisplay.innerText = m;
  if (secondsDisplay) secondsDisplay.innerText = s;
}

function updateButtonUI(isRunning) {
  if (isRunning) {
    toggleBtn.innerText = "⏸";
    toggleBtn.classList.add('running');
  } else {
    toggleBtn.innerText = "▶";
    toggleBtn.classList.remove('running');
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds++;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  chrome.storage.local.set({ 
    isRunning: false, 
    savedSeconds: seconds,
    startTime: null 
  });
}

toggleBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], (res) => {
    if (res.isRunning) {
      pauseTimer();
      updateButtonUI(false);
    } else {
      chrome.storage.local.set({ 
        isRunning: true, 
        startTime: Date.now(),
        lastIssueKey: issueKeyInput.value,
        lastComment: worklogCommentInput.value
      });
      startTimer();
      updateButtonUI(true);
    }
  });
});

const modal = document.getElementById('customModal');
document.getElementById('cancelBtn').addEventListener('click', () => {
  modal.style.display = 'flex';
});

document.getElementById('confirmZerar').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 0;
  updateDisplay();
  updateButtonUI(false);
  issueKeyInput.value = ""; 
  worklogCommentInput.value = "";
  chrome.storage.local.set({ 
    savedSeconds: 0, isRunning: false, startTime: null, lastIssueKey: "", lastComment: "" 
  });
  modal.style.display = 'none';
});

document.getElementById('closeModal').addEventListener('click', () => {
  modal.style.display = 'none';
});

document.getElementById('sendBtn').addEventListener('click', async () => {
  const issueKey = issueKeyInput.value;
  const startDate = startDateInput.value;
  const comment = worklogCommentInput.value;
  const status = document.getElementById('status');

  if (seconds < 1800) {
    status.innerText = "⚠️ Mínimo de 30 minutos necessários.";
    return;
  }

  status.innerText = "Enviando...";

  chrome.storage.local.get(['jiraEmail', 'jiraToken', 'jiraDomain'], async (config) => {
    if (!config.jiraEmail || !config.jiraToken) {
      status.innerText = "❌ Configure o Token primeiro!";
      return;
    }

    const auth = btoa(`${config.jiraEmail}:${config.jiraToken}`);
    const url = `https://${config.jiraDomain}.atlassian.net/rest/api/2/issue/${issueKey}/worklog`;
    const formattedDate = new Date(startDate).toISOString().replace('Z', '-0300');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "started": formattedDate,
          "timeSpentSeconds": seconds,
          "comment": comment || "Registrado via Chrome Extension Timer."
        })
      });

      if (response.ok) {
        status.innerText = "✅ Enviado com sucesso!";
        clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
        updateDisplay();
        updateButtonUI(false);
        issueKeyInput.value = ""; 
        worklogCommentInput.value = "";
        chrome.storage.local.set({ 
          savedSeconds: 0, 
          isRunning: false,
          startTime: null,
          lastIssueKey: "",
          lastComment: ""
        });
      } else {
        status.innerText = "❌ Erro ao enviar.";
      }
    } catch (err) {
      status.innerText = "❌ Falha na conexão.";
    }
  });
});

document.getElementById('openOptions').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});