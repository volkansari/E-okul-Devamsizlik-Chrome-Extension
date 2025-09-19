

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Dropdown seçeneklerini kaydet (bir kere)
function clearLocalStorageOnce() {
// Tüm localStorage'ı temizler
localStorage.clear();
console.log("LocalStorage tamamen temizlendi.");
}


// Dropdown seçeneklerini kaydet (bir kere)
function saveDropdownToLocalStorageOnce() {
  if (localStorage.getItem('ddlSinifiSube_options') && JSON.parse(localStorage.getItem('ddlSinifiSube_options')).length > 0) {
    console.log('Dropdown zaten kayıtlı.');
    return;
  }

  const dropdown = document.getElementById('ddlSinifiSube');
  if (!dropdown) {
     window.location.href = "https://e-okul.meb.gov.tr/IlkOgretim/OKL/IOK08001.aspx";
    console.log('ddlSinifiSube bulunamadı!');
    return;
  }

  const options = Array.from(dropdown.options).map(opt => ({
    value: opt.value,
    text: opt.text,
    step: "listele"
  }));

  localStorage.setItem('ddlSinifiSube_options', JSON.stringify(options));
  console.log('Dropdown ilk kez kaydedildi.');
  console.log(`${options.length} seçenek kaydedildi.`);
}

// Tablo yüklenmesini bekle
async function waitForTableToLoad(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const tableBody = document.querySelector('#dgListe > tbody');
    const start = Date.now();

    const observer = new MutationObserver(() => {
      const rows = tableBody.querySelectorAll('tr');
      if (rows.length > 1) { // başlık dışında satır varsa
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(tableBody, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject("Tablo yüklenme süresi aşıldı.");
    }, timeout);
  });
}

// Ana fonksiyon
async function runDropdownLoopWithDelay() {
  let options = JSON.parse(localStorage.getItem('ddlSinifiSube_options') || '[]');
   let durum = parseInt(JSON.parse(localStorage.getItem('Durum') || '[]'));
  if(durum){
  for (let i = 0; i < options.length; ) {
    console.log(i);
    const current = options[i];
    try {
      switch (current.step) {
        case "listele":
          await listele(current.text, current.value);
          current.step = "islemYap";
          console.log("Listele");
          break;

        case "islemYap":
          await islemYap();
          current.step = "kaydet";
          console.log("islemYap");
          break;

        case "kaydet":
          await kaydet();
          current.step = "ilerle";
          console.log("kaydet");
          break;

        case "ilerle":
          await ilerle();
          i++; // sıradaki option'a geç
          console.log(i);
          break;

      }

      // Güncellenmiş options’ı kaydet
      localStorage.setItem("ddlSinifiSube_options", JSON.stringify(options));
    
    } catch (err) {
      console.log("Hata yakalandı:", err);
    }

  }
  }

  
  localStorage.removeItem('ddlSinifiSube_options');
  console.log('Tüm dropdown elemanları işlendi ve tamamlandı.');
}

// Fonksiyonlar
async function ilerle() {
  await delay(1000);
  console.log('sil fonksiyonu çalıştı');
}

async function listele(text, value) {
  console.log(`İşleniyor: ${text} (${value})`);
  const dropdown = document.getElementById('ddlSinifiSube');
  const listeleBtn = document.querySelector('#Table3 input.submitButton[title="Listele"]');
  await delay(1000);
  if (dropdown && listeleBtn) {
    dropdown.value = value;
    dropdown.dispatchEvent(new Event('change', { bubbles: true }));
    listeleBtn.click();
    console.log('listeleBtn.click()');
  }
  
}

async function kaydet() {
  await delay(1000);
  const img = document.querySelector('#IOMToolbarActive1_kaydet_b img');
  if (img) {
    img.click();
    console.log('kaydet.click()');
  } else {
    console.log('Kaydet butonundaki img bulunamadı');
  }
  
}

async function islemYap() {
  const satirlar = document.querySelectorAll('#dgListe > tbody > tr');

  for (let index = 1; index < satirlar.length; index++) {
    const tr = satirlar[index];
    const td10 = tr.querySelector('td:nth-child(10)');
    const td4 = tr.querySelector('td:nth-child(4)');
    if (!td10 || !td4) continue;

    const okulno = parseInt(td4.textContent.replace(/\n/g, ''));
    const text = td10.textContent.replace(/\n/g, '').trim();
    const arr = !text || text.trim() === '' ? [] : text.split(',');
    const devamsizlikSayisi = arr.length;

    const yarimCheckbox = document.getElementById(`dgListe_chkYarimGun_${index - 1}`);
    const tamCheckbox = document.getElementById(`dgListe_chkTamGun_${index - 1}`);

    if (!isNaN(okulno) && okulno >= 2000) {
      if (yarimCheckbox && yarimCheckbox.checked) yarimCheckbox.click();
      if (tamCheckbox && !tamCheckbox.checked) tamCheckbox.click();
    } else {
      if (devamsizlikSayisi > 0 && devamsizlikSayisi < 7) {
        if (yarimCheckbox && !yarimCheckbox.checked) yarimCheckbox.click();
        if (tamCheckbox && tamCheckbox.checked) tamCheckbox.click();
      } else if (devamsizlikSayisi > 6) {
        if (yarimCheckbox && yarimCheckbox.checked) yarimCheckbox.click();
        if (tamCheckbox && !tamCheckbox.checked) tamCheckbox.click();
      } else {
        if (yarimCheckbox && yarimCheckbox.checked) yarimCheckbox.click();
        if (tamCheckbox && tamCheckbox.checked) tamCheckbox.click();
      }
    }
  }

  
}








chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startDevamsizlik') {
    console.log("Devamsizlik başlatılıyor...");
       saveDropdownToLocalStorageOnce();
    localStorage.setItem("Durum", 1);

  } else if (message.action === 'stopDevamsizlik') {
    console.log("Devamsizlik durduruluyor...");
      clearLocalStorageOnce();
  
  }
});








// DOMContentLoaded kontrolü
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runDropdownLoopWithDelay);
} else {
  const options = JSON.parse(localStorage.getItem('ddlSinifiSube_options') || '[]');
  if (options.length > 0) {
    console.log('Devamsızlık işlemi kaldığı yerden devam ediyor...');
    runDropdownLoopWithDelay();
    console.log(options.length);
  }
}
