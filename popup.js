document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startDevamsizlik' });
  });

  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopDevamsizlik' });
  });
});
