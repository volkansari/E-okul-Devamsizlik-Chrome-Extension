// Flag ile start/stop kontrolü
let isRunning = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     // Aktif sekmeyi bul
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;

      // content.js’i yükle
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Script yüklenemedi:', chrome.runtime.lastError.message);
          return;
        }

        // content.js’e mesaj gönder
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
      });
    });

    sendResponse({ status: 'Bot başlatıldı' });
    return true; // async sendResponse için
  

 
});
