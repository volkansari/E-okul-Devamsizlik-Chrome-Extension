// Satır sayısını al
var satirSayisi = document.querySelectorAll('#dgListe > tbody > tr').length;
console.log(satirSayisi);

// Satırları döngü ile işle
for (var i = 0; i < satirSayisi; i++) {
    // Checkbox'ları seç
    var yarimGunCheckbox = document.getElementById('dgListe_chkYarimGun_' + i);
    var tamGunCheckbox = document.getElementById('dgListe_chkTamGun_' + i);

    // Eğer checkbox'lar bulunamazsa, uyarı ver ve bir sonraki satıra geç
    if (!yarimGunCheckbox || !tamGunCheckbox) {
        console.warn('Tablodaki' + i + ' satır bulunamadı');
        continue;
    }

    // Devamsızlık hücresini seç
    var devamsizlikCell = document.querySelector('#dgListe > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(10)');
    if (!devamsizlikCell) {
        console.warn('Devamsizlik cell for row ' + (i + 1) + ' not found');
        continue;
    }

    // Devamsızlık verisini al ve temizle
    var devamsizlik = devamsizlikCell.textContent.trim();
    var arr = devamsizlik.split(',');

    // Devamsızlık veri uzunluğunu belirle
    var index = arr[0] === '\xa0' ? 0 : arr.length;

    console.log(index);

    // Checkbox'ları işaretle
    if (index > 0 && index < 7) {
        yarimGunCheckbox.checked = true;
        tamGunCheckbox.checked = false;
    } else if (index > 6) {
        yarimGunCheckbox.checked = false;
        tamGunCheckbox.checked = true;
    } else {
        yarimGunCheckbox.checked = false;
        tamGunCheckbox.checked = false;
    }
}
